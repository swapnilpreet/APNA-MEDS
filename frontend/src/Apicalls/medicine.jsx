import { axiosInstance } from "./axiosinstance";

export const AddMedicine = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/medicine/", payload);
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// get all products

export const Getmedicine = async ({
  keyword,
  brand,
  minPrice,
  maxPrice,
  pageNumber,
}) => {
  try {
    const queryParams = new URLSearchParams();

    if (keyword) queryParams.append("keyword", keyword);
    if (brand) queryParams.append("brand", brand);
    if (minPrice) queryParams.append("minPrice", minPrice);
    if (maxPrice) queryParams.append("maxPrice", maxPrice);
    if (pageNumber) queryParams.append("pageNumber", pageNumber);

    const response = await axiosInstance.get(
      `/api/medicine?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

// export const GetProductsBysearch = async (value)=>{
//     try {
//         const response = await axiosInstance.get(`/api/products/search/${value}`);
//         return response.data;
//     } catch (error) {
//         return error.message;
//     }
// }

// // edit a products

// export const EditProduct = async(id,payload)=>{
//     try {
//         const response = await axiosInstance.put(`/api/products/edit-products/${id}`,payload);
//         return response.data;
//     } catch (error) {
//         return error.message;
//     }
// }
// // get products by id

// GetProductById
export const GetMedicineById=async(id)=>{
    try{
        const response=await axiosInstance.get(`/api/medicine/${id}`)
        return response.data;
    }catch(error){
        return error.message;
    }
}

export const UpdateMedicine = async (id, payload) => {
  try {
    const response = await axiosInstance.put(`/api/medicine/${id}`, payload);
    return response.data; // return updated medicine
  } catch (error) {
    console.error("Error updating medicine:", error.response?.data || error.message);
    throw error;
  }
};

export const DeleteMedicine = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/medicine/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating medicine:", error.response?.data || error.message);
    throw error;
  }
};
// // /delete-product/:id
// // Delete a product by id

// export const Deletemedicine = async(id)=>{
//     try {
//         const response = await axiosInstance.delete(`/api/products/delete-products/${id}`);
//         return response.data;
//     } catch (error) {
//          return error.message;
//     }
// }

// // upload products images

// export const UploadProductImage = async(payload)=>{
//       try {
//         const response = await axiosInstance.post('/api/products/upload-product-image', payload);
//         return response.data;
//       } catch (error) {
//         return error.message;
//       }
// }

// // update product status
// export const updateProductStatus =async(id,status)=>{
//     try {
//         const response = await axiosInstance.put(`/api/products/update-product-status/${id}`, {status});
//         return response.data;
//     } catch (error) {
//         return error.message;
//     }
// };

// export const PlaceNewBids = async (payload)=>{
//        try {
//           const response = await axiosInstance.post('/api/bids/place-new-bid', payload);
//           return response.data;
//        } catch (error) {
//          return error.message;
//        }
// }

// export const getAllBids = async (filters)=>{
//     try {
//         const response = await axiosInstance.post('/api/bids/get-all-bid', filters);
//         return response.data;
//     } catch (error) {
//         return error.message;
//     }
// };
