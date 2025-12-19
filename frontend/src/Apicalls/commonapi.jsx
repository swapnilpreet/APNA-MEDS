import axios from "axios";


export const UploadImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "apna-meds");

  try {
    const response = await axios.post("https://api.cloudinary.com/v1_1/dejqyvuqj/image/upload", formData);
    return response.data;
  } catch (error) {
    return error.message;
  }
};
