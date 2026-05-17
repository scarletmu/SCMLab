// WMO weather code → 中文短标
const WMO_LABELS: Record<number, string> = {
  0: "晴",
  1: "晴间多云",
  2: "多云",
  3: "阴",
  45: "雾",
  48: "雾",
  51: "毛毛雨",
  53: "毛毛雨",
  55: "毛毛雨",
  56: "冻雨",
  57: "冻雨",
  61: "小雨",
  63: "雨",
  65: "大雨",
  66: "冻雨",
  67: "冻雨",
  71: "小雪",
  73: "雪",
  75: "大雪",
  77: "雪粒",
  80: "阵雨",
  81: "阵雨",
  82: "强阵雨",
  85: "阵雪",
  86: "强阵雪",
  95: "雷雨",
  96: "雷雨夹雹",
  99: "雷雨夹雹",
};

type OpenMeteoResp = {
  current?: {
    temperature_2m: number;
    weather_code: number;
  };
};

export async function getWeatherLabel(
  city: string,
  latitude: number,
  longitude: number,
): Promise<string> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}` +
    `&longitude=${longitude}&current=temperature_2m,weather_code` +
    `&timezone=auto`;
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const json = (await res.json()) as OpenMeteoResp;
    if (!json.current) throw new Error("missing current block");
    const label = WMO_LABELS[json.current.weather_code] ?? "—";
    const temp = Math.round(json.current.temperature_2m);
    return `${city} · ${label} ${temp}°C`;
  } catch (err) {
    console.warn("[weather] fetch failed, falling back:", err);
    return `${city} · —`;
  }
}
