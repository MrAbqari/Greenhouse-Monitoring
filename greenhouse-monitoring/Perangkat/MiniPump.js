import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MiniPump() {
  const [isOn, setIsOn] = useState(false);
  const [isAuto, setIsAuto] = useState(true);

  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");

  const [savedMin, setSavedMin] = useState(null);
  const [savedMax, setSavedMax] = useState(null);

  // ------------- LOAD TERAKHIR -------------
  useEffect(() => {
    const loadData = async () => {
      try {
        const sOn = await AsyncStorage.getItem("mp_on");
        const sAuto = await AsyncStorage.getItem("mp_auto");
        const sMin = await AsyncStorage.getItem("mp_min");
        const sMax = await AsyncStorage.getItem("mp_max");

        if (sOn !== null) setIsOn(sOn === "true");
        if (sAuto !== null) setIsAuto(sAuto === "true");
        if (sMin !== null && sMin !== "") setSavedMin(sMin);
        if (sMax !== null && sMax !== "") setSavedMax(sMax);
      } catch (err) {
        console.log("Load error:", err);
      }
    };

    loadData();
  }, []);

  // ------------- SAVE HELPER -------------
  const saveData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  // ------------- APPLY MIN/MAX -------------
  const applyValues = () => {
    if (minValue !== "") {
      setSavedMin(minValue);
      saveData("mp_min", minValue);
    }
    if (maxValue !== "") {
      setSavedMax(maxValue);
      saveData("mp_max", maxValue);
    }

    setMinValue("");
    setMaxValue("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={styles.cfContainer}>
        <Text style={styles.cfHeader}>LED mp</Text>

        {/* STATUS */}
        <View style={styles.cfRow}>
          <Text style={styles.cfLabel}>Status</Text>
          <Switch
            value={isOn}
            onValueChange={(val) => {
              setIsOn(val);
              saveData("mp_on", String(val));
            }}
            trackColor={{ false: "#ddd", true: "#a5d6a7" }}
            thumbColor={isOn ? "#2e7d32" : "#f4f3f4"}
          />
        </View>

        {/* KONTEN KETIKA ON */}
        {isOn && (
          <View style={styles.cfBox}>
            <Text style={styles.cfSubTitle}>Mode Pengoperasian</Text>

            {/* MODE MANUAL/AUTO */}
            <View style={styles.cfModeRow}>
              <TouchableOpacity
                onPress={() => {
                  setIsAuto(false);
                  saveData("mp_auto", "false");
                }}
                style={[
                  styles.cfModeButton,
                  !isAuto && styles.cfModeActive,
                ]}
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
                onPress={() => {
                  setIsAuto(true);
                  saveData("mp_auto", "true");
                }}
                style={[
                  styles.cfModeButton,
                  isAuto && styles.cfModeActive,
                ]}
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

            {/* TAMPILAN AUTO */}
            {isAuto && (
              <View style={styles.cfBoxInner}>
                <Text style={styles.cfSubTitle}>Pengaturan Target</Text>

                {/* MINIMUM */}
                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Minimum</Text>

                  {savedMin !== null ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSavedMin(null);
                        saveData("mp_min", "");
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

                {/* MAXIMUM */}
                <View style={styles.cfInputRow}>
                  <Text style={styles.cfInputLabel}>Maximum</Text>

                  {savedMax !== null ? (
                    <TouchableOpacity
                      onPress={() => {
                        setSavedMax(null);
                        saveData("mp_max", "");
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

                {/* APPLY BUTTON */}
                <TouchableOpacity
                  style={styles.cfApplyButton}
                  onPress={applyValues}
                >
                  <Text style={styles.cfApplyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
