import React, { useState, useRef, useEffect } from "react";
import {View, Text, ScrollView, TouchableOpacity, Animated, Dimensions, Pressable} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "react-native-paper";
import { Ionicons, MaterialCommunityIcons, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import styles from "./style";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  // =============================
  // STATE SENSOR DARI BLYNK
  // =============================
  const [devices, setDevices] = useState([
    { title: "Suhu", value: "-", unit: "°C", status: "Normal", target: "30°C" },
    { title: "Kelembapan Tanah", value: "-", unit: "% RH", status: "Optimal", target: "65% RH" },
    { title: "Kelembapan Udara", value: "-", unit: "%", status: "Normal", target: "60%" },
    { title: "Kadar CO2", value: "-", unit: "ppm", status: "Normal", target: "500 ppm" },
    { title: "Kadar Pupuk", value: "-", unit: "ppm", status: "Normal", target: "500 ppm" },
    { title: "Intensitas Cahaya", value: "-", unit: "lx", status: "Normal", target: "500 lx" },
  ]);

  const Aktuator = [
    { title: "Cooling Fan", value: "28", unit: "°C", target: "30°C" },
    { title: "Water Pump", value: "70", unit: "% RH", target: "65% RH" },
    { title: "Fertilizer Pump", value: "70", unit: "% RH", target: "65% RH" },
    { title: "LED UV", value: "450", unit: "ppm", target: "500 ppm" },
  ];

  const [autoStates, setAutoStates] = useState(Aktuator.map(() => true));

  const [index, setIndex] = useState(0);
  const currentDevice = devices[index];
  const [indexA, setIndexA] = useState(0);

  const translateXDevice = useRef(new Animated.Value(0)).current;

  // =============================
  // AMBIL DATA BLYNK
  // =============================
  const TOKEN = "-GFxWLva8e4m7Dslg1SM5Oqebi6tJZQA";
  const [blynkStatus, setBlynkStatus] = useState(false); // false = offline

const fetchBlynkData = async () => {
  try {
    // 1. Cek apakah device Blynk online
    const statusRes = await fetch(
      `https://blynk.cloud/external/api/isHardwareConnected?token=${TOKEN}`
    );
    const statusText = await statusRes.text();
    setBlynkStatus(statusText === "true");

    // 2. Ambil data seperti biasa (punya kamu)
    const res = await fetch(
      `https://blynk.cloud/external/api/get?token=${TOKEN}&v0&v1&v2&v3&v4&v23&v18`
    );
    const data = await res.json();

    setDevices(prev => [
      { ...prev[0], value: data.v0 },
      { ...prev[1], value: data.v1 },
      { ...prev[2], value: data.v18 },
      { ...prev[3], value: data.v3 },
      { ...prev[4], value: 500 },
      { ...prev[5], value: data.v2 },
    ]);

  } catch (err) {
    console.log("Gagal fetch:", err);
    setBlynkStatus(false);
  }
};



  // auto refresh
  useEffect(() => {
    fetchBlynkData();
    const interval = setInterval(fetchBlynkData, 1500);
    return () => clearInterval(interval);
  }, []);

  // =============================
  // WAKTU UPDATE
  // =============================
  const [lastUpdated, setLastUpdated] = useState(getCurrentTime());
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString();
  }

  const handleRefresh = () => {
    setLastUpdated(getCurrentTime());
    fetchBlynkData();
  };

  // =============================
  // ANIMASI CARD
  // =============================
  const animateCard = (direction, nextIndex, translateX, setIndexFn) => {
    const sign = direction === "next" ? -1 : 1;
    const moveDistance = 400;
    Animated.sequence([
      Animated.timing(translateX, {
        toValue: moveDistance * sign,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -moveDistance * sign,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setIndexFn(nextIndex));
  };

  const nextDevice = () => {
    const nextIndex = (index + 1) % devices.length;
    animateCard("next", nextIndex, translateXDevice, setIndex);
  };

  const prevDevice = () => {
    const prevIndex = (index - 1 + devices.length) % devices.length;
    animateCard("prev", prevIndex, translateXDevice, setIndex);
  };

  const handleMenuPress = (title) => {
    if (title === "Cooling Fan") navigation.navigate("CoolingFan");
    else if (title === "Water Pump") navigation.navigate("WaterPump");
    else if (title === "Fertilizer Pump") navigation.navigate("FertPump");
    else if (title === "LED UV") navigation.navigate("LEDUV");
    else alert("Halaman belum tersedia.");
  };

  const renderIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes("suhu")) return <Feather name="thermometer" size={20} color="#2e7d32" />;
    else if (lower.includes("intensitas cahaya")) return <Feather name="sun" size={20} color="#2e7d32" />;
    else if (lower.includes("kadar co2")) return <MaterialCommunityIcons name="molecule-co2" size={20} color="#2e7d32" />;
    else if (lower.includes("kadar pupuk")) return <MaterialCommunityIcons name="sprout" size={20} color="#2e7d32" />;
    else if (lower.includes("kelembapan udara")) return <Entypo name="air" size={20} color="#2e7d32" />;
    else return <Entypo name="drop" size={20} color="#2e7d32" />;
  };

  // =============================
  // RENDER
  // =============================
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="menu" size={28} color="#000" />
          <Text style={styles.title}>
            <Text style={{ fontWeight: "bold" }}>Greenhouse</Text> Monitoring
          </Text>
        </View>

        {/* Info Bar */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Pembaruan: {lastUpdated}{"  "}
              <Text
                style={[
                  styles.statusText,
                  { color: blynkStatus ? "green" : "red" }
                ]}
              >
                • {blynkStatus ? "Online" : "Offline"}
              </Text>
            </Text>
          </View>

          <TouchableOpacity style={styles.reloadBox} onPress={handleRefresh}>
            <Ionicons name="refresh" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Zona Card */}
        <View style={styles.zoneBox}>
          <Text style={styles.zoneTitle}>Zona 1</Text>
          <Text style={styles.zoneSubtitle}>Memiliki 6 perangkat aktif.</Text>
        </View>

        {/* Perangkat Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Perangkat</Text>

          <View style={styles.deviceRow}>
            {/* Panah kiri */}
            <TouchableOpacity onPress={prevDevice} style={{ padding: 20, zIndex: 2, elevation: 2 }}>
              <Ionicons name="chevron-back" size={28} color="#000" />
            </TouchableOpacity>

            {/* Animated Card */}
            <Animated.View
              style={[
                { width: "70%", alignItems: "center" },
                { transform: [{ translateX: translateXDevice }] },
              ]}
            >
              <Card style={styles.tempCard}>
                <View style={styles.deviceHeader}>
                  <Text style={styles.deviceTitle}>{currentDevice.title}</Text>
                  {renderIcon(currentDevice.title)}
                </View>

                <View style={styles.deviceValueRow}>
                  <Text style={styles.deviceValue}>{currentDevice.value}</Text>
                  <Text style={styles.deviceUnit}>{currentDevice.unit}</Text>
                </View>

                <View style={styles.deviceFooter}>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{currentDevice.status}</Text>
                  </View>
                  <Text style={styles.targetText}>
                    Target: {currentDevice.target}
                  </Text>
                </View>
              </Card>
            </Animated.View>

            {/* Panah kanan */}
            <TouchableOpacity onPress={nextDevice} style={{ padding: 20 }}>
              <Ionicons name="chevron-forward" size={28} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Aktuator */}
        <View style={styles.sectionContainerAktuator}>
          <Text style={styles.sectionTitle}>Aktuator</Text>

          <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
           {Aktuator.map((item, index) => (
  <Card key={index} style={[styles.tempCard, styles.aktuatorCard, { marginBottom: 15 }]}>
    <View style={styles.aktuatorRow}>

      {/* Kiri */}
      <View style={styles.aktuatorLeft}>
        <View style={styles.aktuatorIconBox}>
          <MaterialCommunityIcons
            name={
              item.title.toLowerCase().includes("cooling fan")
                ? "fan"
                : item.title.toLowerCase().includes("water pump")
                ? "water-pump"
                : item.title.toLowerCase().includes("fertilizer pump")
                ? "sprout"
                : "lightbulb"
            }
            size={20}
            color="#2e7d32"
          />
        </View>

        <View>
          <Text style={styles.aktuatorTitle}>{item.title}</Text>

          <Text style={styles.aktuatorSub}>
            Trigger: 
            {item.title === "Cooling Fan"
              ? "Temperature"
              : item.title === "Water Pump"
              ? "Soil Moisture"
              : item.title === "Fertilizer Pump"
              ? "Soil Moisture"
              : "Light Sensor"} 
            ({item.value}{item.unit})
          </Text>

          <Text style={styles.aktuatorSubSub}>
            Activates{" "}
            {item.title === "Cooling Fan"
              ? "above"
              : item.title === "Water Pump" || item.title === "Fertilizer Pump"
              ? "below"
              : "below"}{" "}
            {item.target}
          </Text>
        </View>
      </View>

      {/* Kanan */}
      <View style={styles.aktuatorRight}>
        <TouchableOpacity
          onPress={() => handleMenuPress(item.title)}
          style={{ marginRight: 13, marginBottom: 45 }}
        >
          <FontAwesome name="sliders" size={20} color="#444" />
        </TouchableOpacity>
      </View>

    </View>
  </Card>
))}

          </ScrollView>
        </View>

        //grafik
        <View style={[{marginTop: -10}, styles.sectionContainerAktuator]}>
          <Text style={styles.sectionTitle}>Data</Text>
<TouchableOpacity
  onPress={() => navigation.navigate("Grafik")}
  android_ripple={{ color: 'transparent' }}
  activeOpacity={0.7}
  style={[{ margin: 10, marginTop: -5, marginBottom: 20 }]}
>
  <Card style={[{ padding:20 }, styles.tempCard]}>
    <Text style={[{ marginBottom: -10 }, styles.aktuatorTitle]}>Histori Data</Text>
    <Text style={{ color: "#666", marginTop: 0 }}>
      Klik untuk membuka halaman histori lengkap.
    </Text>
  </Card>
</TouchableOpacity>
</View>



      </ScrollView>
    </SafeAreaView>
  );
}
