import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import LineChartComponent from "@/components/LineChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Thermometer, Droplets, Calendar, Download } from "lucide-react";

const generateDetailedMockData = (days: number = 7) => {
  const data = [];
  const now = new Date();
  
  for (let d = days - 1; d >= 0; d--) {
    for (let h = 0; h < 24; h++) {
      const time = new Date(now.getTime() - d * 24 * 60 * 60 * 1000 - (23 - h) * 60 * 60 * 1000);
      data.push({
        time: time.toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: '2-digit',
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        temperature: Math.round((25 + Math.sin(h * 0.3) * 4 + Math.sin(d * 0.1) * 2 + Math.random() * 2) * 10) / 10,
        humidity: Math.round((60 + Math.cos(h * 0.25) * 12 + Math.cos(d * 0.15) * 8 + Math.random() * 3) * 10) / 10
      });
    }
  }
  
  return data;
};

const TemperatureHumidity = () => {
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("7d");
  const [chartData, setChartData] = useState(generateDetailedMockData(7));

  useEffect(() => {
    const days = timeRange === "1d" ? 1 : timeRange === "7d" ? 7 : 30;
    setChartData(generateDetailedMockData(days));
  }, [timeRange]);

  const getStatistics = () => {
    const temps = chartData.map(d => d.temperature);
    const humidities = chartData.map(d => d.humidity);
    
    return {
      avgTemp: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
      maxTemp: Math.max(...temps).toFixed(1),
      minTemp: Math.min(...temps).toFixed(1),
      avgHumidity: (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1),
      maxHumidity: Math.max(...humidities).toFixed(1),
      minHumidity: Math.min(...humidities).toFixed(1),
    };
  };

  const stats = getStatistics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Database Suhu & Kelembaban
          </h1>
          <p className="text-muted-foreground">
            Timeline dan analisis data historis dari sensor DHT22
          </p>
        </div>

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center">
                <Thermometer className="h-4 w-4 mr-1 text-sensor-temp" />
                Rata-rata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-temp">{stats.avgTemp}°C</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Max Suhu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-temp">{stats.maxTemp}°C</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Min Suhu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-temp">{stats.minTemp}°C</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center">
                <Droplets className="h-4 w-4 mr-1 text-sensor-humidity" />
                Rata-rata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-humidity">{stats.avgHumidity}%</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Max Kelembaban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-humidity">{stats.maxHumidity}%</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Min Kelembaban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-humidity">{stats.minHumidity}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <LineChartComponent
          data={chartData}
          title={`Timeline Suhu & Kelembaban - ${timeRange === "1d" ? "24 Jam Terakhir" : 
                    timeRange === "7d" ? "7 Hari Terakhir" : "30 Hari Terakhir"}`}
        />

        {/* Analysis */}
        <Card className="gradient-card border-0 shadow-medium mt-8">
          <CardHeader>
            <CardTitle>Analisis Data</CardTitle>
            <CardDescription>
              Insight dari data sensor DHT22 dalam periode {
                timeRange === "1d" ? "24 jam" : 
                timeRange === "7d" ? "7 hari" : "30 hari"
              } terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sensor-temp mb-2">Kondisi Suhu</h4>
                <p className="text-sm text-muted-foreground">
                  Suhu rata-rata {stats.avgTemp}°C berada dalam rentang optimal untuk penyimpanan makanan. 
                  Fluktuasi antara {stats.minTemp}°C - {stats.maxTemp}°C menunjukkan stabilitas yang baik.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sensor-humidity mb-2">Kondisi Kelembaban</h4>
                <p className="text-sm text-muted-foreground">
                  Kelembaban rata-rata {stats.avgHumidity}% dengan rentang {stats.minHumidity}% - {stats.maxHumidity}% 
                  membantu mencegah pertumbuhan bakteri dan menjaga kualitas makanan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TemperatureHumidity;