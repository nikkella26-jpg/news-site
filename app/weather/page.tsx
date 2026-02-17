"use client";

import { useEffect, useState } from "react";

type WeatherResponse = {
  city: string;
  currentTemperature: number;
};

const STOCKHOLM = {
  city: "Stockholm",
  lat: 59.3293,
  lon: 18.0686,
};

function resolveLocation(): Promise<{
  city: string;
  lat: number;
  lon: number;
}> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(STOCKHOLM);
      return;
    }
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        city: "your location",
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      });
    });
  });
}

export default function Weatherpage() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    async function init() {
      const coords = await resolveLocation();

      const res = await fetch(
        `/api/weather?lat=${coords.lat}&lon=${coords.lon}`,
      );

      const data = await res.json();
      setWeather(data);
    }

    init();
  }, []);

  return (
    <div>
      {weather && (
        <div className="badge">
          {weather.city}: {weather?.currentTemperature}° )
        </div>
      )}
    </div>
  );
}
