import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const tips = [
  "[Umum] Simpan sayuran berdaun di laci kelembaban tinggi (4-7°C) untuk kesegaran lebih lama.",
  "[Buah] Pisahkan buah yang mengeluarkan etilen (pisang, apel, tomat) untuk memperlambat pematangan buah lain.",
  "[Sayur] Cuci sayuran hanya sebelum dikonsumsi; kelembaban berlebih mempercepat pembusukan.",
  "[Daging] Simpan daging mentah di rak paling bawah untuk mencegah tetesan mengenai bahan lain.",
  "[Dairy] Susu dan produk susu sensitif terhadap suhu—letakkan di bagian tengah kulkas, bukan pintu.",
  "[Buah] Simpan beri (stroberi, blueberry) dalam wadah terbuka berlapis kertas untuk menyerap kelembaban.",
  "[Sayur] Untuk selada dan sayuran hijau, bungkus dengan kertas tisu untuk menjaga kelembaban ideal.",
  "[Umum] Jangan tumpuk makanan terlalu rapat—sirkulasi udara penting untuk pendinginan merata.",
  "[Daging] Simpan daging matang dan daging mentah terpisah; gunakan wadah tertutup rapat.",
  "[Umum] Periksa dan bersihkan seal pintu kulkas secara berkala untuk menjaga efisiensi pendinginan.",
  "[Buah] Beberapa buah (jeruk, anggur) tahan lama jika disimpan dingin dan kering di rak bagian atas.",
  "[Sayur] Akar seperti wortel dan lobak tahan lama jika disimpan di laci dengan kelembaban sedang.",
  "[Umum] Suhu ideal kulkas sekitar 3-5°C; gunakan termometer kulkas untuk verifikasi.",
  "[Umum] Simpan sisa makanan dalam wadah kecil yang rapat dan dinginkan cepat untuk mencegah bakteri.",
  "[Dairy] Keju yang lebih keras dapat dibungkus kertas khusus keju untuk bernapas namun tetap terjaga.",
  "[Umum] Jangan menyimpan makanan panas langsung ke dalam kulkas—dinginkan sebentar agar efisien.",
  "[Buah] Pisang matang bisa disimpan di suhu ruang; pindahkan ke kulkas jika ingin memperlambat pematangan.",
  "[Sayur] Tomat lebih baik disimpan di suhu ruang hingga matang, lalu pindah ke kulkas jika perlu.",
  "[Umum] Tandai tanggal pembelian/pembuatan pada wadah agar mudah memantau umur simpan.",
  "[Umum] Bersihkan rak dan wadah makanan setiap minggu untuk mencegah kontaminasi silang."
];

export function TipsBox() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Mulai transisi fade out
      setIsTransitioning(true);
      
      // Tunggu transisi fade out selesai sebelum mengganti tip
      setTimeout(() => {
        setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
        // Mulai transisi fade in
        setIsTransitioning(false);
      }, 500); // Setengah dari durasi animasi total
      
    }, 10000); // Ganti setiap 10 detik

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mt-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 overflow-hidden">
      <CardContent className="p-4 flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="w-full">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Tips & Reminder</h4>
          <div className="relative">
            <p 
              className={cn(
                "text-sm text-blue-600 dark:text-blue-200 transition-all duration-1000",
                isTransitioning ? "opacity-0 transform -translate-y-2" : "opacity-100 transform translate-y-0"
              )}
            >
              {tips[currentTipIndex]}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}