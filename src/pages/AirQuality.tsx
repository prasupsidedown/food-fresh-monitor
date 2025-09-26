import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Calendar, Download, AlertTriangle, CheckCircle, Clock } from "lucide-react";

// Generate air quality mock data
const generateAirQualityData = (days: number = 7) => {
  const data = [];
  const now = new Date();
  
  for (let d = days - 1; d >= 0; d--) {
    for (let h = 0; h < 24; h++) {
      const time = new Date(now.getTime() - d * 24 * 60 * 60 * 1000 - (23 - h) * 60 * 60 * 1000);
      
      // Simulate air quality variations (higher values during "cooking" hours)
      let baseValue = 45;
      if (h >= 6 && h <= 8) baseValue += 20; // Morning cooking
      if (h >= 11 && h <= 13) baseValue += 15; // Lunch time
      if (h >= 17 && h <= 19) baseValue += 25; // Dinner time
      
      data.push({
        time: time.toLocaleDateString('id-ID', { 
          day: '2-digit', 
          month: '2-digit',
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        airQuality: Math.round(baseValue + Math.sin(h * 0.2) * 10 + Math.random() * 15),
        timestamp: time.getTime()
      });
    }
  }
  
  return data;
};

const AirQuality = () => {
  const [timeRange, setTimeRange] = useState<"1d" | "7d" | "30d">("7d");
  const [chartData, setChartData] = useState(generateAirQualityData(7));

  useEffect(() => {
    const days = timeRange === "1d" ? 1 : timeRange === "7d" ? 7 : 30;
    setChartData(generateAirQualityData(days));
  }, [timeRange]);

  const getAirQualityCategory = (value: number) => {
    if (value <= 50) return { 
      category: "Baik", 
      color: "bg-iot-success", 
      description: "Udara bersih, aman untuk kesehatan",
      icon: CheckCircle 
    };
    if (value <= 80) return { 
      category: "Sedang", 
      color: "bg-iot-warning", 
      description: "Kualitas udara dapat diterima",
      icon: Clock 
    };
    return { 
      category: "Buruk", 
      color: "bg-iot-danger", 
      description: "Udara berpotensi berbahaya, perlu ventilasi",
      icon: AlertTriangle 
    };
  };

  const getStatistics = () => {
    const values = chartData.map(d => d.airQuality);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Count by category
    const good = values.filter(v => v <= 50).length;
    const moderate = values.filter(v => v > 50 && v <= 80).length;
    const poor = values.filter(v => v > 80).length;
    
    return {
      avg: avg.toFixed(0),
      max,
      min,
      good,
      moderate,
      poor,
      total: values.length
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
                  <Badge className={`${currentCategory.color} text-white mb-2`}>
                    {currentCategory.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {currentCategory.description}
                  </p>
                </div>
              </div>
              <currentCategory.icon className={`h-12 w-12 ${
                currentCategory.category === "Baik" ? "text-iot-success" :
                currentCategory.category === "Sedang" ? "text-iot-warning" : "text-iot-danger"
              }`} />
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
              <CardTitle className="text-sm text-muted-foreground">Rata-rata AQI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-air-quality">{stats.avg}</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Max AQI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-danger">{stats.max}</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Min AQI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-success">{stats.min}</div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Baik</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-success">
                {Math.round((stats.good / stats.total) * 100)}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Sedang</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-warning">
                {Math.round((stats.moderate / stats.total) * 100)}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Buruk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-danger">
                {Math.round((stats.poor / stats.total) * 100)}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card className="gradient-card shadow-medium border-0 mb-8">
          <CardHeader>
            <CardTitle>
              Timeline Kualitas Udara - {timeRange === "1d" ? "24 Jam Terakhir" : 
                        timeRange === "7d" ? "7 Hari Terakhir" : "30 Hari Terakhir"}
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
                  label={{ value: 'AQI', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-medium)'
                  }}
                  formatter={(value: any) => [
                    `${value} AQI (${getAirQualityCategory(value).category})`,
                    'Kualitas Udara'
                  ]}
                />
                {/* Background areas for AQI ranges */}
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--iot-danger))" stopOpacity={0.1} />
                    <stop offset="60%" stopColor="hsl(var(--iot-warning))" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="hsl(var(--iot-success))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Line
                  type="monotone"
                  dataKey="airQuality"
                  stroke="hsl(var(--sensor-air-quality))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--sensor-air-quality))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: 'hsl(var(--sensor-air-quality))', strokeWidth: 2 }}
                  fill="url(#aqiGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Analysis */}
        <Card className="gradient-card border-0 shadow-medium">
          <CardHeader>
            <CardTitle>Analisis Kualitas Udara</CardTitle>
            <CardDescription>
              Insight dari sensor MQ-135 dalam periode {
                timeRange === "1d" ? "24 jam" : 
                timeRange === "7d" ? "7 hari" : "30 hari"
              } terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-iot-success mt-0.5" />
                <div>
                  <h4 className="font-semibold text-iot-success mb-1">Kondisi Baik</h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.good / stats.total) * 100)}% dari waktu monitoring 
                    menunjukkan kualitas udara yang baik untuk kesehatan.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-iot-warning mt-0.5" />
                <div>
                  <h4 className="font-semibold text-iot-warning mb-1">Kondisi Sedang</h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.moderate / stats.total) * 100)}% waktu dalam kategori sedang, 
                    biasanya terjadi saat aktivitas memasak.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-iot-danger mt-0.5" />
                <div>
                  <h4 className="font-semibold text-iot-danger mb-1">Perlu Perhatian</h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((stats.poor / stats.total) * 100)}% waktu dalam kondisi buruk. 
                    Disarankan meningkatkan ventilasi udara.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AirQuality;