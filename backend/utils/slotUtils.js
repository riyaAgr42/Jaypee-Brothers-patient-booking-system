const toMinutes = (time) => {
  if (!time) return null;

  const match = String(time).trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3]?.toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

const formatMinutes = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
};

export const parseList = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const generateSlots = ({ availableSlots, startTime, endTime, slotDuration }) => {
  const manualSlots = parseList(availableSlots);

  if (manualSlots.length > 0) {
    return manualSlots;
  }

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const duration = Number(slotDuration) || 30;

  if (start === null || end === null || end <= start || duration <= 0) {
    return [];
  }

  const slots = [];
  for (let current = start; current + duration <= end; current += duration) {
    slots.push(formatMinutes(current));
  }

  return slots;
};
