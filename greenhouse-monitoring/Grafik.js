import React, { useEffect, useState } from "react";
import { View, Text, Dimensions, ActivityIndicator, ScrollView } from "react-native";
import { Card } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";
import styles from "./style";

export default function Grafik() {
  const [labels, setLabels] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [humUdaraData, setHumUdaraData] = useState([]);
  const [humTanahData, setHumTanahData] = useState([]);
  const [luxData, setLuxData] = useState([]);
  const [CO2Data, setCO2Data] = useState([]);
  const [loading, setLoading] = useState(true);

  const CHANNEL_ID = "-";
  const READ_API = "-";

  const fetchData = async () => {
    try {
      setLoading(true);

      const url = `-`;
      const response = await fetch(url);
      const json = await response.json();
      const feeds = json.feeds || [];

      const timeLabels = feeds.map(f => {
        try {
          return new Date(f.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        } catch {
          return "";
        }
      });

      setLabels(timeLabels);

      setTempData(
        feeds.map(f => parseFloat(f.field3)).filter(v => !isNaN(v))
      );
      setHumUdaraData(
        feeds.map(f => parseFloat(f.field4)).filter(v => !isNaN(v))
      );
      setHumTanahData(
        feeds.map(f => parseFloat(f.field5)).filter(v => !isNaN(v))
      );
      setLuxData(
        feeds.map(f => parseFloat(f.field2)).filter(v => !isNaN(v))
      );
      setCO2Data(
        feeds.map(f => parseFloat(f.field1)).filter(v => !isNaN(v))
      );

    } catch (err) {
      console.log("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 480000);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const width = Dimensions.get("window").width - 40;
  const chartConfig = {
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    decimalPlaces: 1,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* TEMPERATURE */}
        <Card style={{ padding: 10, margin: 10, borderRadius: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Temperature (°C)
          </Text>

          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: tempData, color: () => "red" }],
            }}
            width={width}
            height={220}
            chartConfig={chartConfig}
            bezier={false}
            style={{ borderRadius: 16 }}
          />
        </Card>

        {/* HUMIDITY Udara*/}
        <Card style={{ padding: 10, margin: 10, borderRadius: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Kelembapan Udara (%)
          </Text>

          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: humUdaraData, color: () => "green" }],
            }}
            width={width}
            height={220}
            chartConfig={chartConfig}
            bezier={false}
            style={{ borderRadius: 16 }}
          />
        </Card>

        {/* HUMIDITY Tanah*/}
        <Card style={{ padding: 10, margin: 10, borderRadius: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Kelembapan Tanah (%)
          </Text>

          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: humTanahData, color: () => "green" }],
            }}
            width={width}
            height={220}
            chartConfig={chartConfig}
            bezier={false}
            style={{ borderRadius: 16 }}
          />
        </Card>

        {/* LIGHT (LUX) */}
        <Card style={{ padding: 10, margin: 10, borderRadius: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Light Intensity (Lux)
          </Text>

          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: luxData, color: () => "blue" }],
            }}
            width={width}
            height={220}
            chartConfig={chartConfig}
            bezier={false}
            style={{ borderRadius: 16 }}
          />
        </Card>

        {/* CO2 */}
        <Card style={{ padding: 10, margin: 10, borderRadius: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            CO₂ (ppm)
          </Text>

          <LineChart
            data={{
              labels: labels,
              datasets: [{ data: CO2Data, color: () => "#8B0000" }], // dark red
            }}
            width={width}
            height={220}
            chartConfig={chartConfig}
            bezier={false}
            style={{ borderRadius: 16 }}
          />
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}

