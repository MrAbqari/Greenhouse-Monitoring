import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style";
import { SafeAreaView } from "react-native-safe-area-context";

const TOKEN = "-";

export default function CoolingFan() {
  const [isOn, setIsOn] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  // suhu
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [savedMin, setSavedMin] = useState(null);
  const [savedMax, setSavedMax] = useState(null);

  // CO2
  const [minCO2, setMinCO2] = useState("");
  const [maxCO2, setMaxCO2] = useState("");
  const [savedMinCO2, setSavedMinCO2] = useState(null);
  const [savedMaxCO2, setSavedMaxCO2] = useState(null);

  // Kelembapan udahra
  const [minHumUdara, setMinHumUdara] = useState("");
  const [maxHumUdara, setMaxHumUdara] = useState("");
  const [savedMinHumUdara, setSavedMinHumUdara] = useState(null);
  const [savedMaxHumUdara, setSavedMaxHumUdara] = useState(null);

  const disabledUI = !isOn; // <-- UI disable flag

  useEffect(() => {
    const loadData = async () => {
      try {
        const sMin = await AsyncStorage.getItem("cf_min");
        const sMax = await AsyncStorage.getItem("cf_max");
        const sMinCO2 = await AsyncStorage.getItem("cf_min_co2");
        const sMaxCO2 = await AsyncStorage.getItem("cf_max_co2");
        const sMinHumUdara = await AsyncStorage.getItem("cf_min_humudara");
        const sMaxHumUdara = await AsyncStorage.getItem("cf_max_humudara");

        if (sMin !== null) setSavedMin(sMin);
        if (sMax !== null) setSavedMax(sMax);
        if (sMinCO2 !== null) setSavedMinCO2(sMinCO2);
        if (sMaxCO2 !== null) setSavedMaxCO2(sMaxCO2);
        if (sMinHumUdara !== null) setSavedMinHumUdara(sMinHumUdara);
        if (sMaxHumUdara !== null) setSavedMaxHumUdara(sMaxHumUdara);
      } catch (err) {
        console.log("Load AsyncStorage error:", err);
      }
    };

    const fetchBlynkStatus = async () => {
      try {
        const res = await fetch(
          `https://blynk.cloud/external/api/get?token=${TOKEN}&v5&v8`
        );
        const data = await res.json();
        if (data.v8 !== undefined) setIsOn(data.v8 == 1);
        if (data.v5 !== undefined) setIsAuto(data.v5 == 1);
      } catch (err) {
        console.log("Fetch Blynk status error:", err);
      }
    };

    loadData();
    fetchBlynkStatus();
  }, []);

  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  const applyValues = () => {
    if (disabledUI) return; // <-- cegah jika OFF

    if (minValue !== "") {
      setSavedMin(minValue);
      saveData("cf_min", minValue);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V12=${minValue}`);
    }
    if (maxValue !== "") {
      setSavedMax(maxValue);
      saveData("cf_max", maxValue);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V13=${maxValue}`);
    }
    if (minCO2 !== "") {
      setSavedMinCO2(minCO2);
      saveData("cf_min_co2", minCO2);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V14=${minCO2}`);
    }
    if (maxCO2 !== "") {
      setSavedMaxCO2(maxCO2);
      saveData("cf_max_co2", maxCO2);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V15=${maxCO2}`);
    }
    if (minHumUdara !== "") {
      setSavedMinHumUdara(minHumUdara);
      saveData("cf_min_humudara", minHumUdara);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V19=${minHumUdara}`);
    }
    if (maxHumUdara !== "") {
      setSavedMaxHumUdara(maxHumUdara);
      saveData("cf_max_humudara", maxHumUdara);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V20=${maxHumUdara}`);
    }

    setMinValue("");
    setMaxValue("");
    setMinCO2("");
    setMaxCO2("");
    setMinHumUdara("");
    setMaxHumUdara("");
  };

  const updateOnOff = (val) => {
    setIsOn(val);
    fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V8=${val ? 1 : 0}`);
  };

  const updateMode = (auto) => {
    if (disabledUI) return; // <-- disabled saat OFF
    setIsAuto(auto);
    fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V5=${auto ? 1 : 0}`);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.cfHeader}>Cooling Fan</Text>

        {/* SWITCH UTAMA */}
        <View style={styles.cfRow}>
          <Text style={styles.cfLabel}>Status</Text>
          <Switch
            value={isOn}
            onValueChange={updateOnOff}
            trackColor={{ false: "#ddd", true: "#a5d6a7" }}
            thumbColor={isOn ? "#2e7d32" : "#f4f3f4"}
          />
        </View>

        {/* UI TETAP ADA, TAPI GREYED & NON-AKTIF */}
        <View style={{ opacity: isOn ? 1 : 0.4 }}>
          <View style={styles.cfBox}>
            <Text style={styles.cfSubTitle}>Mode Pengoperasian</Text>

            <View style={styles.cfModeRow}>
              <TouchableOpacity
                disabled={disabledUI}
                onPress={() => updateMode(false)}
                style={[styles.cfModeButton, !isAuto && styles.cfModeActive]}
              >
                <Text
                  style={[styles.cfModeText, !isAuto && styles.cfModeTextActive]}
                >
                  Manual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={disabledUI}
                onPress={() => updateMode(true)}
                style={[styles.cfModeButton, isAuto && styles.cfModeActive]}
              >
                <Text
                  style={[styles.cfModeText, isAuto && styles.cfModeTextActive]}
                >
                  Auto
                </Text>
              </TouchableOpacity>
            </View>

            {/* AUTO CONFIG */}
            {isAuto && (
              <View style={styles.cfBoxInner}>
                <Text style={styles.cfSubTitle}>Pengaturan Target Suhu</Text>

                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Minimum</Text>
                  {savedMin !== null ? (
                    <TouchableOpacity
                      disabled={disabledUI}
                      onPress={() => {
                        setSavedMin(null);
                        saveData("cf_min", "");
                      }}
                      style={styles.cfReadonlyBox}
                    >
                      <Text style={styles.cfReadonlyText}>{savedMin}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      editable={!disabledUI}
                      style={styles.cfInput}
                      placeholder="Masukkan nilai..."
                      keyboardType="numeric"
                      value={minValue}
                      onChangeText={setMinValue}
                    />
                  )}
                </View>

                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Maximum</Text>
                  {savedMax !== null ? (
                    <TouchableOpacity
                      disabled={disabledUI}
                      onPress={() => {
                        setSavedMax(null);
                        saveData("cf_max", "");
                      }}
                      style={styles.cfReadonlyBox}
                    >
                      <Text style={styles.cfReadonlyText}>{savedMax}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      editable={!disabledUI}
                      style={styles.cfInput}
                      placeholder="Masukkan nilai..."
                      keyboardType="numeric"
                      value={maxValue}
                      onChangeText={setMaxValue}
                    />
                  )}
                </View>

                <Text style={styles.cfSubTitle}>Pengaturan Target CO2</Text>

                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Minimum</Text>
                  {savedMinCO2 !== null ? (
                    <TouchableOpacity
                      disabled={disabledUI}
                      onPress={() => {
                        setSavedMinCO2(null);
                        saveData("cf_min_co2", "");
                      }}
                      style={styles.cfReadonlyBox}
                    >
                      <Text style={styles.cfReadonlyText}>{savedMinCO2}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      editable={!disabledUI}
                      style={styles.cfInput}
                      placeholder="Masukkan nilai..."
                      keyboardType="numeric"
                      value={minCO2}
                      onChangeText={setMinCO2}
                    />
                  )}
                </View>

                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Maximum</Text>
                  {savedMaxCO2 !== null ? (
                    <TouchableOpacity
                      disabled={disabledUI}
                      onPress={() => {
                        setSavedMaxCO2(null);
                        saveData("cf_max_co2", "");
                      }}
                      style={styles.cfReadonlyBox}
                    >
                      <Text style={styles.cfReadonlyText}>{savedMaxCO2}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      editable={!disabledUI}
                      style={styles.cfInput}
                      placeholder="Masukkan nilai..."
                      keyboardType="numeric"
                      value={maxCO2}
                      onChangeText={setMaxCO2}
                    />
                  )}
                </View>

                <Text style={styles.cfSubTitle}>Pengaturan Target Kelembapan Udara</Text>

                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Minimum</Text>
                  {savedMinHumUdara !== null ? (
                    <TouchableOpacity
                      disabled={disabledUI}
                      onPress={() => {
                        setSavedMinHumUdara(null);
                        saveData("cf_min_humudara", "");
                      }}
                      style={styles.cfReadonlyBox}
                    >
                      <Text style={styles.cfReadonlyText}>{savedMinHumUdara}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      editable={!disabledUI}
                      style={styles.cfInput}
                      placeholder="Masukkan nilai..."
                      keyboardType="numeric"
                      value={minHumUdara}
                      onChangeText={setMinHumUdara}
                    />
                  )}
                </View>

                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Maximum</Text>
                  {savedMaxHumUdara !== null ? (
                    <TouchableOpacity
                      disabled={disabledUI}
                      onPress={() => {
                        setSavedMaxHumUdara(null);
                        saveData("cf_max_humudara", "");
                      }}
                      style={styles.cfReadonlyBox}
                    >
                      <Text style={styles.cfReadonlyText}>{savedMaxHumUdara}</Text>
                    </TouchableOpacity>
                  ) : (
                    <TextInput
                      editable={!disabledUI}
                      style={styles.cfInput}
                      placeholder="Masukkan nilai..."
                      keyboardType="numeric"
                      value={maxHumUdara}
                      onChangeText={setMaxHumUdara}
                    />
                  )}
                </View>

                <TouchableOpacity
                  disabled={disabledUI}
                  style={styles.cfApplyButton}
                  onPress={applyValues}
                >
                  <Text style={styles.cfApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}