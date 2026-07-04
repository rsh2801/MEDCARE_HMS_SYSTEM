export const TIME_SLOTS = [
  "09:00","09:20","09:40","10:00","10:20","10:40",
  "11:00","11:20","11:40","12:00","12:20","12:40",
  "13:00","13:20","13:40","14:00","14:20","14:40",
  "15:00","15:20","15:40","16:00","16:20","16:40",
  "17:00","17:20","17:40","18:00","18:20","18:40",
];

export const PERIODS = {
  Morning:   { start: "09:00", end: "12:00", label: "Morning (9:00 AM - 12:00 PM)" },
  Afternoon: { start: "12:00", end: "16:00", label: "Afternoon (12:00 PM - 4:00 PM)" },
  Evening:   { start: "16:00", end: "19:00", label: "Evening (4:00 PM - 7:00 PM)" },
};

export function getSlotsByPeriod() {
  return {
    Morning:   TIME_SLOTS.filter(s => s >= "09:00" && s < "12:00"),
    Afternoon: TIME_SLOTS.filter(s => s >= "12:00" && s < "16:00"),
    Evening:   TIME_SLOTS.filter(s => s >= "16:00" && s <= "18:40"),
  };
}

export function formatSlotTo12h(slot) {
  const [h, m] = slot.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${suffix}`;
}
