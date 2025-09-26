import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import SensorCard from "@/components/SensorCard";
import LineChartComponent from "@/components/LineChart";
import FoodStorageList from "@/components/FoodStorageList";
import { Thermometer, Droplets, Wind } from "lucide-react";

// Mock data generator
const generateMockData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      temperature: Math.round((25 + Math.sin(i * 0.1) * 3 + Math.random() * 2) * 10) / 10,
      humidity: Math.round((60 + Math.cos(i * 0.15) * 10 + Math.random() * 5) * 10) / 10
    });
  }
  
  return data;
};

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: "27.5",
    humidity: "65.2",
    airQuality: "78"
  });
  
  const [chartData, setChartData] = useState(generateMockData());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData(prev => ({
        temperature: (25 + Math.sin(Date.now() * 0.001) * 3 + Math.random() * 1).toFixed(1),
        humidity: (60 + Math.cos(Date.now() * 0.001) * 10 + Math.random() * 2).toFixed(1),
        airQuality: (70 + Math.sin(Date.now() * 0.0008) * 15 + Math.random() * 5).toFixed(0)
      }));
      
      // Update chart data (keep last 24 points)
      setChartData(prev => {
        const newData = [...prev];
        const now = new Date();
        newData.shift(); // Remove oldest point
        newData.push({
          time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          temperature: parseFloat(sensorData.temperature),
          humidity: parseFloat(sensorData.humidity)
        });
        return newData;
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [sensorData]);

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
              title="Grafik Suhu & Kelembaban (24 Jam Terakhir)"
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
              Suhu saat ini dalam rentang normal untuk penyimpanan makanan
            </p>
          </div>
          <div className="gradient-card p-4 rounded-lg shadow-soft">
            <h3 className="font-semibold text-sensor-humidity mb-2">Status Kelembaban</h3>
            <p className="text-sm text-muted-foreground">
              Kelembaban optimal untuk mencegah pertumbuhan bakteri
            </p>
          </div>
          <div className="gradient-card p-4 rounded-lg shadow-soft">
            <h3 className={`font-semibold mb-2 ${airQualityInfo.color}`}>Status Kualitas Udara</h3>
            <p className="text-sm text-muted-foreground">
              Tingkat {airQualityInfo.status} - {sensorData.airQuality} AQI
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
