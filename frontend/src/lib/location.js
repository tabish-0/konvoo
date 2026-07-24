const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

export async function reverseGeocode(lat, lng) {
  if (!LOCATIONIQ_KEY) {
    console.warn("VITE_LOCATIONIQ_KEY is not set");
    return "";
  }
  try {
    const res = await fetch(
      `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_KEY}&lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();

    if (data.error) {
      console.log("LocationIQ error:", data.error);
      return "";
    }

    const address = data?.address || {};
    const city = address.city || address.town || address.village || address.county || "";
    const country = address.country || "";
    return [city, country].filter(Boolean).join(", ");
  } catch (err) {
    console.log("LocationIQ reverse geocode failed:", err.message);
    return "";
  }
}

export function getCurrentCoords() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (err) => reject(err),
      { timeout: 8000 }
    );
  });
}