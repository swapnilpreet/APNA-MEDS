import { axiosInstance } from "./axiosinstance";

export const SignupUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", payload);
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const LoginUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", payload);
    // console.log("response-loginuser-api", response);
    return response.data;
  } catch (error) {
    return {
      status: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

export const GetMedicalHistory = async () => {
  try {
    const response = await axiosInstance.get("/api/users/medical-history");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const AddMedicalHistory = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/api/users/medical-history",
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const EditMedicalHistory = async (payload, id) => {
  try {
    const response = await axiosInstance.put(
      `/api/users/medical-history/${id}`,
      payload
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};
export const DeleteMedicalHistory = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/api/users/medical-history/${id}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/api/users/profile");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const UpdateUserProfile = async (payload) => {
  try {
    const response = await axiosInstance.put("/api/users/profile", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const AddMedicineTocart = async (medicineId) => {
  console.log(medicineId);
  try {
    const response = await axiosInstance.post("/api/users/cart", medicineId);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetMyAllcart = async () => {
  try {
    const response = await axiosInstance.get("/api/users/getcart");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const Clearmycart = async () => {
  try {
    const response = await axiosInstance.delete("/api/users/clear-cart");
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/api/users/");
    return response.data;
  } catch (error) {
    return error;
  }
};
