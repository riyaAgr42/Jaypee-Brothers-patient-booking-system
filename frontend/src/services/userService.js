import api from "./api";

export const fetchProfileSummary = async () => {
  const { data } = await api.get("/api/users/profile");
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.put("/api/users/profile", payload);
  return data;
};
