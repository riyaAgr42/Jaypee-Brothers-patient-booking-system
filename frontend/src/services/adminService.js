import api from "./api";

export const fetchAdminDashboard = async () => {
  const { data } = await api.get("/api/admin/dashboard");
  return data;
};

export const createDoctorByAdmin = async (payload) => {
  const { data } = await api.post("/api/admin/doctors", payload);
  return data;
};

export const fetchAllDoctorsByAdmin = async () => {
  const { data } = await api.get("/api/admin/doctors");
  return data;
};

export const updateDoctorByAdmin = async (doctorId, payload) => {
  const { data } = await api.put(`/api/admin/doctors/${doctorId}`, payload);
  return data;
};

export const deleteDoctorByAdmin = async (doctorId) => {
  const { data } = await api.delete(`/api/admin/doctors/${doctorId}`);
  return data;
};

export const updateDoctorApprovalByAdmin = async (doctorId, status) => {
  const { data } = await api.patch(`/api/admin/doctors/${doctorId}/approval`, {
    status
  });
  return data;
};

export const fetchAllAppointments = async () => {
  const { data } = await api.get("/api/admin/appointments");
  return data;
};

export const updateAppointmentStatusByAdmin = async (appointmentId, status) => {
  const { data } = await api.patch(`/api/admin/appointments/${appointmentId}/status`, {
    status
  });
  return data;
};

export const fetchPatients = async () => {
  const { data } = await api.get("/api/admin/patients");
  return data;
};
