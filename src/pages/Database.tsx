import { useState, useEffect } from "react";
import axios from "axios";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Database as DatabaseIcon, Search, Download, Filter } from "lucide-react";

// Ganti URL ini sesuai alamat server.js kamu
const API_URL = "http://localhost:5000/api/sensor";

const Database = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 20;

  // 🔄 Ambil data dari MongoDB
  useEffect(() => {
  async function fetchData() {
    try {
      const res = await axios.get<
        { temperature: number; humidity: number; airQuality: number; timestamp: string }[]
      >(API_URL);

      const sorted = res.data
        .reverse() // data terbaru di atas
        .map((item, index) => ({
          id: index + 1,
          timestamp: new Date(item.timestamp).toLocaleString("id-ID"),
          temperature: item.temperature.toFixed(1),
          humidity: item.humidity.toFixed(1),
          airQuality: Math.round(item.airQuality),
          status: item.airQuality > 80 ? "Alert" : "Normal",
        }));

      setRecords(sorted);
    } catch (err) {
      console.error("❌ Gagal mengambil data dari database:", err);
    }
  }

  fetchData();
  const interval = setInterval(fetchData, 5000); // auto refresh tiap 5 detik
  return () => clearInterval(interval);
}, []);


  // 🔍 Filter berdasarkan pencarian
  const filteredRecords = records.filter(
    (record) =>
      record.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const paginatedRecords = filteredRecords.slice(startIndex, startIndex + recordsPerPage);

  const getStatusColor = (status: string) =>
    status === "Normal" ? "bg-iot-success" : "bg-iot-danger";

  const getAirQualityStatus = (value: number) => {
    if (value <= 50) return { status: "Baik", color: "bg-iot-success" };
    if (value <= 80) return { status: "Sedang", color: "bg-iot-warning" };
    return { status: "Buruk", color: "bg-iot-danger" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Database Sensor</h1>
          <p className="text-muted-foreground">
            Database lengkap semua pembacaan sensor IoT dengan riwayat dan analisis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground flex items-center">
                <DatabaseIcon className="h-4 w-4 mr-1" />
                Total Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{records.length.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Status Normal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-iot-success">
                {records.length > 0
                  ? Math.round(
                      (records.filter((r) => r.status === "Normal").length / records.length) * 100
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Suhu Rata-rata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-temp">
                {records.length > 0
                  ? (
                      records.reduce((sum, r) => sum + parseFloat(r.temperature), 0) / records.length
                    ).toFixed(1)
                  : "0.0"}
                °C
              </div>
            </CardContent>
          </Card>

          <Card className="gradient-card border-0 shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Kelembaban Rata-rata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sensor-humidity">
                {records.length > 0
                  ? (
                      records.reduce((sum, r) => sum + parseFloat(r.humidity), 0) / records.length
                    ).toFixed(1)
                  : "0.0"}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search + Table */}
        <Card className="gradient-card border-0 shadow-medium mb-6">
          <CardHeader>
            <CardTitle>Data Records</CardTitle>
            <CardDescription>Riwayat pembacaan sensor dengan filter dan pencarian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berdasarkan waktu atau status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
              </div>
            </div>

            {/* Data Table */}
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Suhu (°C)</TableHead>
                    <TableHead>Kelembaban (%)</TableHead>
                    <TableHead>Air Quality</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRecords.length > 0 ? (
                    paginatedRecords.map((record) => {
                      const aqiStatus = getAirQualityStatus(record.airQuality);
                      return (
                        <TableRow key={record.id} className="hover:bg-muted/20">
                          <TableCell className="font-mono text-sm">#{record.id}</TableCell>
                          <TableCell className="font-mono text-sm">{record.timestamp}</TableCell>
                          <TableCell>
                            <span className="font-semibold text-sensor-temp">
                              {record.temperature}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-sensor-humidity">
                              {record.humidity}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{record.airQuality}</span>
                              <Badge className={`${aqiStatus.color} text-white text-xs`}>
                                {aqiStatus.status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(record.status)} text-white`}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-6">
                        Belum ada data sensor yang tersimpan.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Menampilkan {startIndex + 1}-
                {Math.min(startIndex + recordsPerPage, filteredRecords.length)} dari{" "}
                {filteredRecords.length} records
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "gradient-primary" : ""}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Database;