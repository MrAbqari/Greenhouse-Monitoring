/***********************
 * BLYNK & WiFi SETUP
 ***********************/
#define BLYNK_TEMPLATE_ID "-"
#define BLYNK_TEMPLATE_NAME "-"
#define BLYNK_AUTH_TOKEN "-"

#define BLYNK_PRINT Serial

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>
#include <HTTPClient.h>

#include <Wire.h>
#include <BH1750.h>
#include <DHT.h>


/***********************
 * SENSOR DEFINITIONS
 ***********************/
BH1750 lightMeter;

#define DHTPIN 19
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const int MQ7_PIN  = 34;
const int SOIL_PIN = 35;

// Soil calibration (YL-69)
int soilDry = 3500;
int soilWet = 1200;


/***********************
 * AKTUATOR
 ***********************/
#define LED_PIN 12
#define FAN_PIN 14
#define PUMP_PIN 27

bool ledAutoMode  = true;
bool fanAutoMode  = true;
bool pumpAutoMode = true;

bool ledOnOff  = true ;
bool fanOnOff  = true;
bool pumpOnOff = true;


/***********************
 * BATAS KONTROL
 ***********************/
int luxMin = 1000;
int luxMax = 4000;

float tempMin = 20.0;
float tempMax = 24.0;

int gasMin = 1000;
int gasMax = 1500;

float humUdaraMin = 40.0;
float humUdaraMax = 60.0;

int humTanahMin = 40;   // tanah kering %
int humTanahMax = 80;   // tanah basah %


/***********************
 * WiFi Credentials
 ***********************/
char ssid[] = "-";
char pass[] = "-";


/***********************
 * THINGSPEAK
 ***********************/
String TS_API = "-";
BlynkTimer timer;


/***********************
 * SEND SENSOR DATA
 ***********************/
void sendData() {

  // ----- GAS MQ7 -----
  int adcValue = analogRead(MQ7_PIN);

  // ----- LDR BH1750 -----
  float lux = lightMeter.readLightLevel();

  // ----- DHT22 -----
  float humUdara = dht.readHumidity();
  float temp = dht.readTemperature();

  // ----- SOIL -----
  int rawSoil = analogRead(SOIL_PIN);
  int humTanah = map(rawSoil, soilDry, soilWet, 0, 100);
  humTanah = constrain(humTanah, 0, 100);

  // ----- SERIAL MONITOR -----
  Serial.println("\n===== SENSOR UPDATE =====");
  Serial.println("Gas MQ7          : " + String(adcValue));
  Serial.println("Lux              : " + String(lux));
  Serial.println("Suhu             : " + String(temp));
  Serial.println("Kelembapan Udara : " + String(humUdara));
  Serial.println("Kelembapan Tanah : " + String(humTanah));
  Serial.println("=========================");


  // ----- SEND TO BLYNK -----
  Blynk.virtualWrite(V3, adcValue);
  Blynk.virtualWrite(V2, lux);
  Blynk.virtualWrite(V0, temp);
  Blynk.virtualWrite(V18, humUdara);
  Blynk.virtualWrite(V1, humTanah);


  /*****************************************
   * LOGIC KONTROL
   *****************************************/

  // ---------- LED ----------
  if (!ledOnOff) {
    digitalWrite(LED_PIN, LOW);
    Serial.println("LED: OFF (manual)");
  } else if (ledAutoMode) {
    if (lux < luxMin) {
      digitalWrite(LED_PIN, HIGH);
      Serial.println("LED: ON (AUTO — lux < min)");
    }
    else if (lux > luxMax) {
      digitalWrite(LED_PIN, LOW);
      Serial.println("LED: OFF (AUTO — lux > max)");
    }
  } else {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("LED: ON (manual override)");
  }


  // ---------- FAN (suhu + gas + kelembapan udara) ----------
  if (!fanOnOff) {
    digitalWrite(FAN_PIN, LOW);
    Serial.println("FAN: OFF (manual)");
  } 
  else if (fanAutoMode) {

    // FAN ON jika salah satu parameter bahaya
    if (temp > tempMax || adcValue > gasMax || humUdara > humUdaraMax) {
      digitalWrite(FAN_PIN, HIGH);
      Serial.println("FAN: ON (AUTO — suhu/gas/humUdara tinggi)");
    }

    // FAN OFF jika semuanya kembali normal
    else if (temp < tempMin && adcValue < gasMin && humUdara < humUdaraMin) {
      digitalWrite(FAN_PIN, LOW);
      Serial.println("FAN: OFF (AUTO — kondisi normal)");
    }
  }
  else {
    digitalWrite(FAN_PIN, HIGH);
    Serial.println("FAN: ON (manual override)");
  }


  // ---------- PUMP ----------
  if (!pumpOnOff) {
    digitalWrite(PUMP_PIN, LOW);
    Serial.println("PUMP: OFF (manual)");
  } else if (pumpAutoMode) {
    if (humTanah < humTanahMin) {
      digitalWrite(PUMP_PIN, HIGH);
      Serial.println("PUMP: ON (AUTO — tanah kering)");
    }
    else if (humTanah > humTanahMax) {
      digitalWrite(PUMP_PIN, LOW);
      Serial.println("PUMP: OFF (AUTO — tanah lembab)");
    }
  } else {
    digitalWrite(PUMP_PIN, HIGH);
    Serial.println("PUMP: ON (manual override)");
  }


  /********************
   * THINGSPEAK
   ********************/
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    String url = "http://api.thingspeak.com/update?api_key=" + TS_API;
    url += "&field1=" + String(adcValue);
    url += "&field2=" + String(lux);
    url += "&field3=" + String(temp);
    url += "&field4=" + String(humUdara);
    url += "&field5=" + String(humTanah);

    http.begin(url);
    http.GET();
    http.end();
  }
}


/***********************
 * BLYNK WRITE HANDLERS
 ***********************/
BLYNK_WRITE(V4) { ledAutoMode = param.asInt(); Serial.println("LED AutoMode = " + String(ledAutoMode)); }
BLYNK_WRITE(V5) { fanAutoMode = param.asInt(); Serial.println("FAN AutoMode = " + String(fanAutoMode)); }
BLYNK_WRITE(V6) { pumpAutoMode = param.asInt(); Serial.println("PUMP AutoMode = " + String(pumpAutoMode)); }

BLYNK_WRITE(V7) { ledOnOff = param.asInt(); Serial.println("LED Switch = " + String(ledOnOff)); }
BLYNK_WRITE(V8) { fanOnOff = param.asInt(); Serial.println("FAN Switch = " + String(fanOnOff)); }
BLYNK_WRITE(V9) { pumpOnOff = param.asInt(); Serial.println("PUMP Switch = " + String(pumpOnOff)); }

BLYNK_WRITE(V10) { luxMin = param.asInt(); Serial.println("luxMin = " + String(luxMin)); }
BLYNK_WRITE(V11) { luxMax = param.asInt(); Serial.println("luxMax = " + String(luxMax)); }

BLYNK_WRITE(V12) { tempMin = param.asFloat(); Serial.println("tempMin = " + String(tempMin)); }
BLYNK_WRITE(V13) { tempMax = param.asFloat(); Serial.println("tempMax = " + String(tempMax)); }

BLYNK_WRITE(V14) { gasMin = param.asInt(); Serial.println("gasMin = " + String(gasMin)); }
BLYNK_WRITE(V15) { gasMax = param.asInt(); Serial.println("gasMax = " + String(gasMax)); }

BLYNK_WRITE(V16) { humTanahMin = param.asInt(); Serial.println("humTanahMin = " + String(humTanahMin)); }
BLYNK_WRITE(V17) { humTanahMax = param.asInt(); Serial.println("humTanahMax = " + String(humTanahMax)); }

BLYNK_WRITE(V19) { humUdaraMin = param.asFloat(); Serial.println("humUdaraMin = " + String(humUdaraMin)); }
BLYNK_WRITE(V20) { humUdaraMax = param.asFloat(); Serial.println("humUdaraMax = " + String(humUdaraMax)); }


/***********************
 * SETUP
 ***********************/
void setup() {
  Serial.begin(115200);

  Wire.begin(21, 22);
  lightMeter.begin(BH1750::CONTINUOUS_HIGH_RES_MODE);

  dht.begin();

  pinMode(LED_PIN, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
  pinMode(PUMP_PIN, OUTPUT);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  timer.setInterval(2000L, sendData);

  Serial.println("=== SISTEM SIAP ===");
}


/*********************** 
 * LOOP
 ***********************/
void loop() {
  Blynk.run();
  timer.run();
}
