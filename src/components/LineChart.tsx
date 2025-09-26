import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

interface LineChartComponentProps {
  data: DataPoint[];
  title: string;
}

const LineChartComponent = ({ data, title }: LineChartComponentProps) => {
  return (
    <Card className="gradient-card shadow-medium border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
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
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: 'none',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-medium)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="hsl(var(--sensor-temp))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--sensor-temp))', strokeWidth: 2, r: 4 }}
              name="Suhu (°C)"
              activeDot={{ r: 6, stroke: 'hsl(var(--sensor-temp))', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="humidity"
              stroke="hsl(var(--sensor-humidity))"
              strokeWidth={3}
              dot={{ fill: 'hsl(var(--sensor-humidity))', strokeWidth: 2, r: 4 }}
              name="Kelembaban (%)"
              activeDot={{ r: 6, stroke: 'hsl(var(--sensor-humidity))', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LineChartComponent;