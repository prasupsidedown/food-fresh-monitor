import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Activity, Thermometer, Droplets } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login for demo purposes
    setTimeout(() => {
      if (email && password) {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di IoT Dashboard!",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login Gagal",
          description: "Silakan masukkan email dan password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="p-2 rounded-lg gradient-primary">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-iot-primary to-iot-secondary bg-clip-text text-transparent">
              IoT Monitor
            </h1>
          </div>
          <div className="flex justify-center space-x-4">
            <div className="flex items-center space-x-1 text-sensor-temp">
              <Thermometer className="h-5 w-5" />
              <span className="text-sm font-medium">Suhu</span>
            </div>
            <div className="flex items-center space-x-1 text-sensor-humidity">
              <Droplets className="h-5 w-5" />
              <span className="text-sm font-medium">Kelembaban</span>
            </div>
            <div className="flex items-center space-x-1 text-sensor-air-quality">
              <Activity className="h-5 w-5" />
              <span className="text-sm font-medium">Air Quality</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="gradient-card shadow-medium border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Masuk Dashboard</CardTitle>
            <CardDescription>
              Masukkan kredensial Anda untuk mengakses monitoring sensor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@iot.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="shadow-soft"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="shadow-soft"
                />
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary shadow-medium hover:shadow-strong transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Masuk..." : "Masuk Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="gradient-card border-0 shadow-soft">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Demo Credentials:</strong><br />
              Email: admin@iot.com<br />
              Password: password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;