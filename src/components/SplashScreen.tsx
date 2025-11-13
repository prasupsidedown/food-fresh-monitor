import { useEffect } from "react";
import { Activity } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
  duration?: number;
}

export function SplashScreen({ onFinish, duration = 2000 }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish, duration]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-iot-primary/80 to-iot-secondary/80 animate-fade-in overflow-hidden">
      <div className="relative mb-8">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-white/20 blur-xl animate-pulse-glow scale-150" />
        
        {/* Logo container with rotating shine effect */}
        <div className="relative p-6 rounded-full bg-white shadow-2xl animate-pulse-glow">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-rotate-shine" />
          <Activity className="h-20 w-20 text-iot-primary animate-rotate-shine" />
        </div>
      </div>

      {/* Title with gradient and glow */}
      <h1 className="text-5xl font-bold relative">
        <span className="absolute inset-0 bg-gradient-to-r from-iot-primary to-iot-secondary blur-xl opacity-50 animate-pulse-glow" />
        <span className="relative bg-gradient-to-r from-iot-primary to-iot-secondary bg-clip-text text-transparent">
          IoT Monitor
        </span>
      </h1>
    </div>
  );
}

// Tailwind animasi custom (tambahkan di tailwind.config jika belum ada):
// .animate-bounce-slow { animation: bounce 2s infinite; }
// .animate-spin-slow { animation: spin 2s linear infinite; }
// .animate-fade-in { animation: fadeIn 1s ease-in; }
