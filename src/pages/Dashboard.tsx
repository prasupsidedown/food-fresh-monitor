import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import SensorCard from "@/components/SensorCard";
import LineChartComponent from "@/components/LineChart";
import FoodStorageList from "@/components/FoodStorageList";
import { Thermometer, Droplets, Wind } from "lucide-react";
import { TipsBox } from "@/components/TipsBox";

// URL API server kamu (ubah sesuai IP atau domain server.js)
const API_URL = "http://localhost:5000/api/sensor";

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "0.0",
    humidity: "0.0",
    airQuality: "0"
  });

  const [chartData, setChartData] = useState<
    { time: string; temperature: number; humidity: number }[]
  >([]);

  // 🔄 Ambil data dari server
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get<
          { temperature: number; humidity: number; airQuality: number; timestamp: string }[]
        >(API_URL);

        // Ambil data terakhir dari database
        const latest = res.data[res.data.length - 1];
        if (latest) {
          setSensorData({
            temperature: latest.temperature.toFixed(1),
            humidity: latest.humidity.toFixed(1),
            airQuality: latest.airQuality.toFixed(0),
          });
        }

        // Siapkan data grafik suhu & kelembaban (max 24 data terakhir)
        const formattedData = res.data
          .slice(-24)
          .map((d) => ({
            time: new Date(d.timestamp).toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temperature: d.temperature,
            humidity: d.humidity,
          }));
        setChartData(formattedData);
      } catch (err) {
        console.error("❌ Gagal mengambil data sensor:", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000); // update tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  // 💨 Status kualitas udara
  const getAirQualityStatus = (value: number) => {
    if (value <= 50) return { status: "Baik", color: "text-iot-success", trend: "stable" as const };
    if (value <= 80) return { status: "Sedang", color: "text-iot-warning", trend: "up" as const };
    return { status: "Buruk", color: "text-iot-danger", trend: "up" as const };
  };

  const airQualityInfo = getAirQualityStatus(parseFloat(sensorData.airQuality));

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Dashboard Monitoring IoT
          </h1>
          <p className="text-muted-foreground">
            Monitoring real-time sensor DHT22 dan MQ-135 untuk deteksi suhu, kelembaban, dan kualitas udara
          </p>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SensorCard
            title="Suhu"
            value={sensorData.temperature}
            unit="°C"
            icon={Thermometer}
            colorClass="bg-sensor-temp"
            trend="stable"
            description="Sensor DHT22"
          />
          <SensorCard
            title="Kelembaban"
            value={sensorData.humidity}
            unit="%"
            icon={Droplets}
            colorClass="bg-sensor-humidity"
            trend="down"
            description="Sensor DHT22"
          />
          <SensorCard
            title="Kualitas Udara"
            value={sensorData.airQuality}
            unit="AQI"
            icon={Wind}
            colorClass="bg-sensor-air-quality"
            trend={airQualityInfo.trend}
            description={`Sensor MQ-135 - ${airQualityInfo.status}`}
          />
        </div>

        {/* Charts and Food Storage */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Temperature & Humidity Chart */}
          <div className="lg:col-span-1">
            <LineChartComponent
              data={chartData}
              title="Grafik Suhu & Kelembaban (Data Terbaru)"
            />
          </div>

          {/* Food Storage List */}
          <div className="lg:col-span-1">
            <FoodStorageList />
          </div>
        </div>

        {/* Status Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="gradient-card p-4 rounded-lg shadow-soft">
            <h3 className="font-semibold text-sensor-temp mb-2">Status Suhu</h3>
            <p className="text-sm text-muted-foreground">
              Suhu saat ini {sensorData.temperature}°C — dalam rentang normal untuk penyimpanan makanan.
            </p>
          </div>
          <div className="gradient-card p-4 rounded-lg shadow-soft">
            <h3 className="font-semibold text-sensor-humidity mb-2">Status Kelembaban</h3>
            <p className="text-sm text-muted-foreground">
              Kelembaban {sensorData.humidity}% — optimal untuk mencegah pertumbuhan bakteri.
            </p>
          </div>
          <div className="gradient-card p-4 rounded-lg shadow-soft">
            <h3 className={`font-semibold mb-2 ${airQualityInfo.color}`}>Status Kualitas Udara</h3>
            <p className="text-sm text-muted-foreground">
              Kualitas udara: {airQualityInfo.status} ({sensorData.airQuality} AQI)
            </p>
          </div>
        </div>

        {/* Tips Box - full width bawah */}
        <div className="mt-6">
          <TipsBox />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
