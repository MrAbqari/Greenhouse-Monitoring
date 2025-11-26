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

export default function WaterPump() {
  const [isOn, setIsOn] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  // Humidity
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [savedMin, setSavedMin] = useState(null);
  const [savedMax, setSavedMax] = useState(null);

  // -------------------------------------------------
  // LOAD BLYNK + ASYNC STORAGE
  // -------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const sMin = await AsyncStorage.getItem("wp_min");
        const sMax = await AsyncStorage.getItem("wp_max");

        if (sMin) setSavedMin(sMin);
        if (sMax) setSavedMax(sMax);
      } catch (err) {
        console.log("Async load error:", err);
      }
    };

    const fetchBlynkStatus = async () => {
      try {
        const res = await fetch(
          `https://blynk.cloud/external/api/get?token=${TOKEN}&v6&v9`
        );
        const data = await res.json();

        if (data.v9 !== undefined) setIsOn(data.v9 == 1);
        if (data.v6 !== undefined) setIsAuto(data.v6 == 1);
      } catch (err) {
        console.log("Blynk fetch error:", err);
      }
    };

    loadData();
    fetchBlynkStatus();
  }, []);

  // -------------------------------------------------
  // SAVE LOCAL
  // -------------------------------------------------
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  // -------------------------------------------------
  // APPLY HUMIDITY MIN/MAX
  // -------------------------------------------------
  const applyValues = () => {
    if (minValue) {
      setSavedMin(minValue);
      saveData("wp_min", minValue);
      fetch(
        `https://blynk.cloud/external/api/update?token=${TOKEN}&V16=${minValue}`
      ).catch(console.log);
    }

    if (maxValue) {
      setSavedMax(maxValue);
      saveData("wp_max", maxValue);
      fetch(
        `https://blynk.cloud/external/api/update?token=${TOKEN}&V17=${maxValue}`
      ).catch(console.log);
    }

    setMinValue("");
    setMaxValue("");
  };

  // -------------------------------------------------
  // ON / OFF + AUTO / MANUAL
  // -------------------------------------------------
  const updateOnOff = (val) => {
    setIsOn(val);
    fetch(
      `https://blynk.cloud/external/api/update?token=${TOKEN}&V9=${val ? 1 : 0}`
    ).catch(console.log);
  };

  const updateMode = (auto) => {
    setIsAuto(auto);
    fetch(
      `https://blynk.cloud/external/api/update?token=${TOKEN}&V6=${
        auto ? 1 : 0
      }`
    ).catch(console.log);
  };

  const disabledBox = !isOn ? { opacity: 0.4 } : {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.cfHeader}>Water Pump</Text>

        {/* SWITCH ON/OFF */}
        <View style={styles.cfRow}>
          <Text style={styles.cfLabel}>Status</Text>
          <Switch
            value={isOn}
            onValueChange={updateOnOff}
            trackColor={{ false: "#ddd", true: "#a5d6a7" }}
            thumbColor={isOn ? "#2e7d32" : "#f4f3f4"}
          />
        </View>

        {/* BOX KONTROL */}
        <View style={[styles.cfBox, disabledBox]}>
          <Text style={styles.cfSubTitle}>Mode Pengoperasian</Text>

          {/* MODE BUTTONS */}
          <View
            style={styles.cfModeRow}
            pointerEvents={isOn ? "auto" : "none"}
          >
            <TouchableOpacity
              onPress={() => updateMode(false)}
              style={[styles.cfModeButton, !isAuto && styles.cfModeActive]}
            >
              <Text
                style={[
                  styles.cfModeText,
                  !isAuto && styles.cfModeTextActive,
                ]}
              >
                Manual
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => updateMode(true)}
              style={[styles.cfModeButton, isAuto && styles.cfModeActive]}
            >
              <Text
                style={[
                  styles.cfModeText,
                  isAuto && styles.cfModeTextActive,
                ]}
              >
                Auto
              </Text>
            </TouchableOpacity>
          </View>

          {/* AUTO SETTINGS */}
          {isAuto && (
            <View
              style={styles.cfBoxInner}
              pointerEvents={isOn ? "auto" : "none"}
            >
              <Text style={styles.cfSubTitle}>
                Pengaturan Target Humidity
              </Text>

              {/* MIN */}
              <View style={styles.cfInputRow}>
                <Text style={styles.cfInputLabel}>Minimum</Text>

                {savedMin !== null ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSavedMin(null);
                      saveData("wp_min", "");
                    }}
                    style={styles.cfReadonlyBox}
                  >
                    <Text style={styles.cfReadonlyText}>{savedMin}</Text>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    style={styles.cfInput}
                    placeholder="Masukkan nilai..."
                    keyboardType="numeric"
                    value={minValue}
                    onChangeText={setMinValue}
                  />
                )}
              </View>

              {/* MAX */}
              <View style={styles.cfInputRow}>
                <Text style={styles.cfInputLabel}>Maximum</Text>

                {savedMax !== null ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSavedMax(null);
                      saveData("wp_max", "");
                    }}
                    style={styles.cfReadonlyBox}
                  >
                    <Text style={styles.cfReadonlyText}>{savedMax}</Text>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    style={styles.cfInput}
                    placeholder="Masukkan nilai..."
                    keyboardType="numeric"
                    value={maxValue}
                    onChangeText={setMaxValue}
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.cfApplyButton}
                onPress={applyValues}
              >
                <Text style={styles.cfApplyText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

