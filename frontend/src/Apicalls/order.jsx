import { axiosInstance } from "./axiosinstance";

export const PlaceOrder = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/orders", payload);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || "Order placement failed";
  }
};


export const GetMyOrders = async () => {
  try {
    const response = await axiosInstance.get("/api/orders/myorders",);
    return response.data;
  } catch (error) {
    return error.response?.data?.message || "Order placement failed";
  }
};

export const GetAllOrdersByAdmin=async()=>{
  try {
    const response=await axiosInstance.get("/api/orders");
    return response.data;
  } catch(error){
    return error.response?.data?.message || "Failed to fetch orders";
  }
}