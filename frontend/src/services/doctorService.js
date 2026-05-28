import api from "./api";

export const fetchDoctors = async (search = "") => {
  const { data } = await api.get("/api/doctors", {
    params: typeof search === "string" ? { search } : search
  });
  return data;
};

export const fetchDoctorById = async (id) => {
  const { data } = await api.get(`/api/doctors/${id}`);
  return data;
};

export const fetchMyDoctorProfile = async () => {
  const { data } = await api.get("/api/doctors/me");
  return data;
};

export const updateMyDoctorProfile = async (payload) => {
  const { data } = await api.put("/api/doctors/me", payload);
  return data;
};
