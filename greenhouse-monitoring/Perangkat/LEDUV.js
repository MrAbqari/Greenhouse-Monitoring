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

const TOKEN = "-GFxWLva8e4m7Dslg1SM5Oqebi6tJZQA";

export default function LEDUV() {
  const [isOn, setIsOn] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  // MIN – MAX Lux
  const [minValue, setMinValue] = useState("");
  const [savedMin, setSavedMin] = useState(null);

  const [maxValue, setMaxValue] = useState("");
  const [savedMax, setSavedMax] = useState(null);

  // -----------------------------------------------------
  // LOAD TERAKHIR + STATUS DARI BLYNK
  // -----------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const sOn = await AsyncStorage.getItem("uv_on");
        const sAuto = await AsyncStorage.getItem("uv_auto");
        const sMin = await AsyncStorage.getItem("uv_min");
        const sMax = await AsyncStorage.getItem("uv_max");

        if (sOn !== null) setIsOn(sOn === "true");
        if (sAuto !== null) setIsAuto(sAuto === "true");

        if (sMin !== null && sMin !== "") setSavedMin(sMin);
        if (sMax !== null && sMax !== "") setSavedMax(sMax);
      } catch (err) {
        console.log("Load AsyncStorage error:", err);
      }
    };

    const fetchBlynkStatus = async () => {
      try {
        const res = await fetch(
          `https://blynk.cloud/external/api/get?token=${TOKEN}&V4&V7&V10&V11`
        );
        const data = await res.json();

        if (data.V7 !== undefined) setIsOn(data.V7 === "1" || data.V7 === 1);
        if (data.V4 !== undefined) setIsAuto(data.V4 === "1" || data.V4 === 1);

        if (data.V10 !== undefined) setSavedMin(data.V10);
        if (data.V11 !== undefined) setSavedMax(data.V11);
      } catch (err) {
        console.log("Fetch Blynk status error:", err);
      }
    };

    loadData();
    fetchBlynkStatus();
  }, []);

  // -----------------------------------------------------
  // SIMPAN ASYNCSTORAGE
  // -----------------------------------------------------
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  // -----------------------------------------------------
  // APPLY MIN & MAX LUX → KIRIM KE BLYNK
  // -----------------------------------------------------
  const applyValues = () => {
    // MIN
    if (minValue !== "") {
      setSavedMin(minValue);
      saveData("uv_min", minValue);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V10=${minValue}`)
        .catch(console.log);
    }

    // MAX
    if (maxValue !== "") {
      setSavedMax(maxValue);
      saveData("uv_max", maxValue);
      fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V11=${maxValue}`)
        .catch(console.log);
    }

    setMinValue("");
    setMaxValue("");
  };

  // -----------------------------------------------------
  // ON/OFF & AUTO/MANUAL
  // -----------------------------------------------------
  const updateOnOff = (val) => {
    setIsOn(val);
    saveData("uv_on", val.toString());
    fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V7=${val ? 1 : 0}`)
      .catch(console.log);
  };

  const updateMode = (auto) => {
    setIsAuto(auto);
    saveData("uv_auto", auto.toString());
    fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V4=${auto ? 1 : 0}`)
      .catch(console.log);
  };

  // -----------------------------------------------------
  // DISABLE STYLE
  // -----------------------------------------------------
  const disabledStyle = {
    opacity: isOn ? 1 : 0.4,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.cfHeader}>LED UV</Text>

        {/* STATUS ON/OFF */}
        <View style={styles.cfRow}>
          <Text style={styles.cfLabel}>Status</Text>
          <Switch
            value={isOn}
            onValueChange={updateOnOff}
            trackColor={{ false: "#ddd", true: "#a5d6a7" }}
            thumbColor={isOn ? "#2e7d32" : "#f4f3f4"}
          />
        </View>

        {/* BOX */}
        <View
          style={[styles.cfBox, disabledStyle]}
          pointerEvents={isOn ? "auto" : "none"}
        >
          <Text style={styles.cfSubTitle}>Mode Pengoperasian</Text>

          {/* AUTO / MANUAL */}
          <View style={styles.cfModeRow}>
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
            <View style={styles.cfBoxInner}>
              <Text style={styles.cfSubTitle}>Pengaturan Target Lux</Text>

              {/* MIN */}
              <View style={styles.cfInputRow}>
                <Text style={styles.cfInputLabel}>Minimum</Text>

                {savedMin !== null ? (
                  <TouchableOpacity
                    onPress={() => {
                      setSavedMin(null);
                      saveData("uv_min", "");
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
                      saveData("uv_max", "");
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

              {/* APPLY */}
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
