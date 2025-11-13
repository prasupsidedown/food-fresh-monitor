import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ======== Middleware ========
app.use(cors());
app.use(express.json());

// ======== MongoDB Connection ========
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Terhubung ke MongoDB Atlas"))
  .catch((err) => console.error("❌ Gagal koneksi MongoDB:", err));

// ======== Schema & Model ========
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  airQuality: Number, // tetap dipakai frontend lama
  gasAnalog: Number,  // MQ135 analog
  gasDigital: Number, // MQ135 digital
  detected: Boolean,  // true kalau salah satu sensor mendeteksi gas
  timestamp: { type: Date, default: Date.now },
});

const Sensor = mongoose.model("Sensor", sensorSchema);

// ======== Routes ========

// Endpoint uji koneksi server
app.get("/", (req, res) => {
  res.send("Server aktif dan terhubung ke MongoDB Atlas!");
});

// Endpoint untuk menerima data dari Wemos
app.post("/api/sensor", async (req, res) => {
  try {
    const {
      temperature,
      humidity,
      gasAnalog,
      gasDigital,
      detected
    } = req.body;

    if (
      temperature === undefined ||
      humidity === undefined ||
      gasAnalog === undefined ||
      gasDigital === undefined ||
      detected === undefined
    ) {
      return res.status(400).json({ error: "Data sensor tidak lengkap" });
    }

    // tetap isi airQuality dari gasAnalog (biar dashboard lama tetap bisa)
    const newData = new Sensor({
      temperature,
      humidity,
      airQuality: gasAnalog,
      gasAnalog,
      gasDigital,
      detected
    });

    await newData.save();

    console.log(
      `📥 Data diterima: Suhu=${temperature}°C | Kelembapan=${humidity}% | MQ135A=${gasAnalog} | MQ135D=${gasDigital} | Status=${detected ? "BAHAYA" : "AMAN"}`
    );
    res.status(201).json({ message: "Data berhasil disimpan", data: newData });
  } catch (err) {
    console.error("❌ Gagal menyimpan data:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// Endpoint untuk ambil data terakhir (buat frontend)
app.get("/api/sensor", async (req, res) => {
  try {
    const data = await Sensor.find().sort({ timestamp: -1 }).limit(50);
    res.json(data);
  } catch (err) {
    console.error("❌ Gagal mengambil data:", err);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

// ======== Jalankan Server ========
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server berjalan di port ${PORT} (${new Date().toLocaleTimeString()})`);
  console.log(`🌐 Akses dari jaringan lokal: http://<IP_LAPTOP_KAMU>:${PORT}`);
});
