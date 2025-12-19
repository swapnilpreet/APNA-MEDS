import { axiosInstance } from "./axiosinstance";


export const GetAllPatients = async () => {
  try {
    const response = await axiosInstance.get("/api/patient/");
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const AddPatient = async (patientData) => {
  try {
    const response = await axiosInstance.post("/api/patient/", patientData);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const UpdatePatient = async (id, patientData) => {
  console.log("Updating patient with ID:", id, "Data:", patientData);
  try {
    const response = await axiosInstance.put(`/api/patient/${id}`, patientData);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const DeletePatient = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/patient/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const GetAllAddresses = async () => {
  try {
    const response = await axiosInstance.get("/api/patient/address");
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const AddAddress = async (addressData) => {
  try {
    const response = await axiosInstance.post("/api/patient/address", addressData);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const UpdateAddress = async (id, patientData) => {
  try {
    const response = await axiosInstance.put(`/api/patient/address/${id}`, patientData);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};


export const DeleteAddress = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/patient/address/${id}`);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || error.message;
  }
};
