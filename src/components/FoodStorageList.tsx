import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Apple, Clock, AlertTriangle, CheckCircle, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  status: "fresh" | "warning" | "expired";
  daysLeft: number;
}

const FoodStorageList = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [newFood, setNewFood] = useState({ name: "", category: "", expiryDate: "" });

  // 🔹 Load dari localStorage saat pertama kali render
  useEffect(() => {
    const stored = localStorage.getItem("foods");
    if (stored) {
      setFoods(JSON.parse(stored));
    }
  }, []);

  // 🔹 Simpan ke localStorage tiap kali data berubah
  useEffect(() => {
    localStorage.setItem("foods", JSON.stringify(foods));
  }, [foods]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fresh": return "bg-iot-success text-white";
      case "warning": return "bg-iot-warning text-white";
      case "expired": return "bg-iot-danger text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fresh": return <CheckCircle className="h-4 w-4" />;
      case "warning": return <Clock className="h-4 w-4" />;
      case "expired": return <AlertTriangle className="h-4 w-4" />;
      default: return <Apple className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string, daysLeft: number) => {
    switch (status) {
      case "fresh": return `${daysLeft} hari lagi`;
      case "warning": return `${daysLeft} hari lagi`;
      case "expired": return `Kadaluarsa ${Math.abs(daysLeft)} hari`;
      default: return "Unknown";
    }
  };

  // 🔹 Tambah makanan
  const addFood = () => {
    if (!newFood.name || !newFood.category || !newFood.expiryDate) return;

    const expiry = new Date(newFood.expiryDate);
    const today = new Date();
    const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

    let status: FoodItem["status"] = "fresh";
    if (diff <= 0) status = "expired";
    else if (diff <= 2) status = "warning";

    const food: FoodItem = {
      id: Date.now().toString(),
      name: newFood.name,
      category: newFood.category,
      expiryDate: newFood.expiryDate,
      status,
      daysLeft: diff,
    };

    setFoods([...foods, food]);
    setNewFood({ name: "", category: "", expiryDate: "" });
  };

  // 🔹 Hapus makanan
  const deleteFood = (id: string) => {
    setFoods(foods.filter((f) => f.id !== id));
  };

  return (
    <Card className="gradient-card shadow-medium border-0">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Apple className="h-5 w-5 text-iot-secondary" />
          <span>Daftar Makanan di Storage</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Form Tambah Makanan */}
        <div className="flex space-x-2">
          <Input
            placeholder="Nama makanan"
            value={newFood.name}
            onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
          />
          <Input
            placeholder="Kategori"
            value={newFood.category}
            onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
          />
          <Input
            type="date"
            value={newFood.expiryDate}
            onChange={(e) => setNewFood({ ...newFood, expiryDate: e.target.value })}
          />
          <Button onClick={addFood}><Plus className="h-4 w-4" /></Button>
        </div>

        {/* List Makanan */}
        {foods.map((item, index) => (
          <div key={item.id}>
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(item.status)}
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{item.expiryDate}</p>
                  <p className="text-xs text-muted-foreground">
                    {getStatusText(item.status, item.daysLeft)}
                  </p>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status === "fresh" ? "Segar" : 
                   item.status === "warning" ? "Peringatan" : "Kadaluarsa"}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteFood(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
            {index < foods.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FoodStorageList;