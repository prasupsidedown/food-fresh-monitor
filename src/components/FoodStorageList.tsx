import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Apple, Clock, AlertTriangle, CheckCircle } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  expiryDate: string;
  status: "fresh" | "warning" | "expired";
  daysLeft: number;
}

const mockFoodData: FoodItem[] = [
  {
    id: "1",
    name: "Apel Fuji",
    category: "Buah",
    expiryDate: "2024-01-15",
    status: "fresh",
    daysLeft: 5
  },
  {
    id: "2",
    name: "Susu UHT",
    category: "Minuman",
    expiryDate: "2024-01-12",
    status: "warning",
    daysLeft: 2
  },
  {
    id: "3",
    name: "Daging Sapi",
    category: "Protein",
    expiryDate: "2024-01-08",
    status: "expired",
    daysLeft: -2
  },
  {
    id: "4",
    name: "Wortel",
    category: "Sayuran",
    expiryDate: "2024-01-20",
    status: "fresh",
    daysLeft: 10
  },
  {
    id: "5",
    name: "Keju Cheddar",
    category: "Dairy",
    expiryDate: "2024-01-11",
    status: "warning",
    daysLeft: 1
  }
];

const FoodStorageList = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "fresh":
        return "bg-iot-success text-white";
      case "warning":
        return "bg-iot-warning text-white";
      case "expired":
        return "bg-iot-danger text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "fresh":
        return <CheckCircle className="h-4 w-4" />;
      case "warning":
        return <Clock className="h-4 w-4" />;
      case "expired":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Apple className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string, daysLeft: number) => {
    switch (status) {
      case "fresh":
        return `${daysLeft} hari lagi`;
      case "warning":
        return `${daysLeft} hari lagi`;
      case "expired":
        return `Kadaluarsa ${Math.abs(daysLeft)} hari`;
      default:
        return "Unknown";
    }
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
        {mockFoodData.map((item, index) => (
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
              </div>
            </div>
            {index < mockFoodData.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FoodStorageList;