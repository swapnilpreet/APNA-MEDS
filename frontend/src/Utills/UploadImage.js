import axios from "axios";

export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "apna-meds");
  try {
    console.log("Uploading to Cloudinary...");
    const cloudRes = await axios.post(
      `https://api.cloudinary.com/v1_1/dejqyvuqj/image/upload`,
      formData
    );
    if (cloudRes.data.secure_url) {
      return cloudRes.data.secure_url;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch(err){
    console.error("Cloudinary Upload Error:", err);
    return null;
  }
};
