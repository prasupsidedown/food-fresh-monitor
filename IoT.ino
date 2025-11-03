#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <DHT.h>

const char* ssid = "MIE BARA";
const char* password = "miebangladesh";

const char* serverName = "http://192.168.18.164:3000/api/sensor";  

#define DHTPIN D2
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

#define MQ135_PIN A0

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("Menyambungkan WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nWiFi Tersambung!");
  dht.begin();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float suhu = dht.readTemperature();
    float kelembaban = dht.readHumidity();
    int mq135 = analogRead(MQ135_PIN);

    if (isnan(suhu) || isnan(kelembaban)) {
      Serial.println("Gagal baca DHT22");
      return;
    }

    Serial.print("Suhu: ");
    Serial.print(suhu, 2);
    Serial.print(" °C  |  Kelembaban: ");
    Serial.print(kelembaban, 2);
    Serial.print(" %  |  MQ135: ");
    Serial.println(mq135);

    String jsonData = "{";
    jsonData += "\"temperature\":" + String(suhu, 2) + ",";
    jsonData += "\"humidity\":" + String(kelembaban, 2) + ",";
    jsonData += "\"airQuality\":" + String(mq135);
    jsonData += "}";

    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverName);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonData);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Respon server: " + response);
    } else {
      Serial.print("Error kirim data, kode: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }

  delay(15000);
}