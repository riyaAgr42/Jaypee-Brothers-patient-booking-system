import api from "./api";

export const createAppointment = async (payload) => {
  const { data } = await api.post("/api/appointments", payload);
  return data;
};

export const fetchMyAppointments = async () => {
  const { data } = await api.get("/api/appointments/my");
  return data;
};

export const cancelAppointment = async (appointmentId) => {
  const { data } = await api.patch(`/api/appointments/${appointmentId}/cancel`);
  return data;
};

export const updateAppointmentStatusByDoctor = async (appointmentId, status) => {
  const { data } = await api.patch(`/api/appointments/${appointmentId}/doctor-status`, {
    status
  });
  return data;
};
