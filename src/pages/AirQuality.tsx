import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Wind,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

// 🌐 Ganti URL ini sesuai alamat server kamu
// misal: "http://192.168.1.100:5000/api/sensor" kalau server lokal
const API_URL = "http://localhost:5000/api/sensor";

const AirQuality = () => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("7d");

  // 🔄 Ambil data dari server setiap 5 detik
  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get<{ temperature: number; humidity: number; airQuality: number; timestamp: string }[]>(API_URL);
      const data = res.data.map((d) => ({
        time: new Date(d.timestamp).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        airQuality: d.airQuality,
        timestamp: d.timestamp,
      }));
      setChartData(data.reverse());
    } catch (err) {
      console.error("❌ Gagal mengambil data sensor:", err);
    }
  };

  fetchData();
  const interval = setInterval(fetchData, 5000);
  return () => clearInterval(interval);
}, []);


  // 📊 Klasifikasi kualitas udara
  const getAirQualityCategory = (value: number) => {
    if (value <= 50)
      return {
        category: "Baik",
        color: "bg-iot-success",
        description: "Udara bersih, aman untuk kesehatan",
        icon: CheckCircle,
      };
    if (value <= 80)
      return {
        category: "Sedang",
        color: "bg-iot-warning",
        description: "Kualitas udara dapat diterima",
        icon: Clock,
      };
    return {
      category: "Buruk",
      color: "bg-iot-danger",
      description: "Udara berpotensi berbahaya, perlu ventilasi",
      icon: AlertTriangle,
    };
  };

  // 📈 Hitung statistik
  const getStatistics = () => {
    if (chartData.length === 0)
      return {
        avg: 0,
        max: 0,
        min: 0,
        good: 0,
        moderate: 0,
        poor: 0,
        total: 0,
      };

    const values = chartData.map((d) => d.airQuality);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    const good = values.filter((v) => v <= 50).length;
    const moderate = values.filter((v) => v > 50 && v <= 80).length;
    const poor = values.filter((v) => v > 80).length;

    return {
      avg: avg.toFixed(0),
      max,
      min,
      good,
      moderate,
      poor,
      total: values.length,
    };
  };

  const stats = getStatistics();
  const currentAQI = chartData[chartData.length - 1]?.airQuality || 0;
  const currentCategory = getAirQualityCategory(currentAQI);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Timeline Kualitas Udara
          </h1>
          <p className="text-muted-foreground">
            Monitoring dan analisis data kualitas udara dari sensor MQ-135
          </p>
        </div>

        {/* Current Status */}
        <Card className="gradient-card border-0 shadow-medium mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wind className="h-6 w-6 text-sensor-air-quality" />
              <span>Status Kualitas Udara Saat Ini</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-sensor-air-quality">
                  {currentAQI}
                </div>
                <div>
                  <Badge
                    className={`${currentCategory.color} text-white mb-2`}
                  >
                    {currentCategory.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {currentCategory.description}
                  </p>
                </div>
              </div>
              <currentCategory.icon
                className={`h-12 w-12 ${
                  currentCategory.category === "Baik"
                    ? "text-iot-success"
                    : currentCategory.category === "Sedang"
                    ? "text-iot-warning"
                    : "text-iot-danger"
                }`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Time Range Selector */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">Rentang Waktu:</span>
            <div className="flex space-x-1">
              {[
                { key: "1d", label: "1 Hari" },
                { key: "7d", label: "7 Hari" },
                { key: "30d", label: "30 Hari" },
              ].map((range) => (
                <Button
                  key={range.key}
                  variant={timeRange === range.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range.key as any)}
                  className={timeRange === range.key ? "gradient-primary" : ""}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Rata-rata AQI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-air-quality">
                {stats.avg}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Max AQI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-danger">
                {stats.max}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Min AQI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-success">
                {stats.min}
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Baik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-success">
                {stats.total > 0
                  ? Math.round((stats.good / stats.total) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Sedang
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-warning">
                {stats.total > 0
                  ? Math.round((stats.moderate / stats.total) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Buruk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-danger">
                {stats.total > 0
                  ? Math.round((stats.poor / stats.total) * 100)
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="gradient-card shadow-medium border-0 mb-8">
          <CardHeader>
            <CardTitle>
              Timeline Kualitas Udara -{" "}
              {timeRange === "1d"
                ? "24 Jam Terakhir"
                : timeRange === "7d"
                ? "7 Hari Terakhir"
                : "30 Hari Terakhir"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  label={{ value: "AQI", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "var(--shadow-medium)",
                  }}
                  formatter={(value: any) => [
                    `${value} AQI (${getAirQualityCategory(value).category})`,
                    "Kualitas Udara",
                  ]}
                />
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="hsl(var(--iot-danger))"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="60%"
                      stopColor="hsl(var(--iot-warning))"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="100%"
                      stopColor="hsl(var(--iot-success))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="airQuality"
                  stroke="hsl(var(--sensor-air-quality))"
                  strokeWidth={3}
                  dot={{
                    fill: "hsl(var(--sensor-air-quality))",
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    stroke: "hsl(var(--sensor-air-quality))",
                    strokeWidth: 2,
                  }}
                  fill="url(#aqiGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AirQuality;
