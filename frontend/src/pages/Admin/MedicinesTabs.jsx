// import React, { useEffect, useState } from "react";
// import "./css/MedicinesTabs.css"; // ✅ Import CSS file
// import Pagination from "../../components/common/Pagination";
// import { SetLoader } from "../../redux/LoadingSlice";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import MedicineLoader from "../../components/common/MedicineLoader";
// import {
//   AddMedicine,
//   DeleteMedicine,
//   Getmedicine,
//   UpdateMedicine,
// } from "../../Apicalls/medicine";

// const initialPayload = {
//   name: "",
//   brand: "",
//   price: "",
//   countInStock: "",
//   description: "",
//   image: "",
//   category: "",
// };

// const MedicinesTabs = () => {
//   const [showMedicineForm, setShowMedicineForm] = useState(false);
//   const [image, setimage] = useState(null);
//   const { loading } = useSelector((state) => state?.loaders);
//   const [preview, setpreview] = useState();
//   const dispatch = useDispatch();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [payload, setPayload] = useState(initialPayload);
//   const [medicineData, setMedicineData] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const handleSubmit = async (e) => {
//     // e.preventDefault();
//     // dispatch(SetLoader(true));

//     // try {
//     //   const finalPayload = {
//     //     ...payload,
//     //     image: payload.image,
//     //   };
//     //   const response = await AddMedicine(finalPayload);
//     //   if (response) {
//     //     console.log("Medicine added successfully");
//     //     handlegetmedicine();
//     //     setPayload(initialPayload);
//     //     setimage(null);
//     //     setpreview("");
//     //   } else {
//     //     throw new Error("Something went wrong in AddMedicine route");
//     //   }
//     // } catch (error) {
//     //   console.error("Error:", error.message);
//     // } finally {
//     //   dispatch(SetLoader(false));
//     // }
//     // ...........

//     e.preventDefault();
//     dispatch(SetLoader(true));

//     try {
//       const formData = new FormData();

//       formData.append("name", payload.name);
//       formData.append("brand", payload.brand);
//       formData.append("price", payload.price);
//       formData.append("countInStock", payload.countInStock);
//       formData.append("category", payload.category);
//       formData.append("description", payload.description);

//       // 👇 IMPORTANT
//       if (image) {
//         formData.append("image", image);
//       }

//       const response = await AddMedicine(formData);

//       if (response) {
//         handlegetmedicine();
//         setPayload(initialPayload);
//         setimage(null);
//         setpreview("");
//         setShowMedicineForm(false);
//       }
//     } catch (error) {
//       console.error("Add Medicine Error:", error);
//     } finally {
//       dispatch(SetLoader(false));
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPayload((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleMedicineChange = (e, field, id) => {
//     const { value } = e.target;
//     setMedicineData((prev) =>
//       prev.map((med) => (med._id === id ? { ...med, [field]: value } : med))
//     );
//   };

//   const handleUploadImage = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     try {
//       setimage(file);
//       setpreview(URL.createObjectURL(file));
//       const cloudinaryFormData = new FormData();
//       cloudinaryFormData.append("file", file);
//       cloudinaryFormData.append("upload_preset", "apna-meds");
//       cloudinaryFormData.append("cloud_name", "dejqyvuqj");

//       const cloudRes = await axios.post(
//         `https://api.cloudinary.com/v1_1/dejqyvuqj/image/upload`,
//         cloudinaryFormData
//       );
//       const uploadedUrl = cloudRes.data.secure_url;
//       setPayload((prev) => ({
//         ...prev,
//         image: uploadedUrl,
//       }));
//     } catch (error) {
//       console.error("Cloudinary Upload Failed:", error);
//     }
//   };

//   const handleEditImage = async (e, id) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     try {
//       setimage(file);
//       setpreview(URL.createObjectURL(file));
//       const cloudinaryFormData = new FormData();
//       cloudinaryFormData.append("file", file);
//       cloudinaryFormData.append("upload_preset", "apna-meds");
//       cloudinaryFormData.append("cloud_name", "dejqyvuqj");

//       const cloudRes = await axios.post(
//         `https://api.cloudinary.com/v1_1/dejqyvuqj/image/upload`,
//         cloudinaryFormData
//       );
//       const uploadedUrl = cloudRes.data.secure_url;

//       setMedicineData((prev) =>
//         prev.map((med) => {
//           if (med._id === id) {
//             return {
//               ...med,
//               image: uploadedUrl,
//             };
//           } else {
//             return med;
//           }
//         })
//       );
//     } catch (error) {
//       console.error("Cloudinary Upload Failed:", error);
//     }
//   };

//   const handlePageChange = (pageNum) => {
//     if (pageNum >= 1 && pageNum <= totalPages) {
//       setCurrentPage(pageNum);
//     }
//   };

//   const handlegetmedicine = async () => {
//     try {
//       const response = await Getmedicine({ pageNumber: currentPage });
//       if (response) {
//         setMedicineData(response.Medicines);
//         setTotalPages(response.pages);
//       } else {
//         throw new Error("something went wrong");
//       }
//     } catch (error) {
//       console.log("Error-Occred", error?.message);
//     }
//   };

//   useEffect(() => {
//     handlegetmedicine();
//   }, [currentPage]);

//   const handleSaveMedicine = async (id) => {
//     // try {
//     //   const medToUpdate = medicineData.find((m) => m._id === id);
//     //   const response = await UpdateMedicine(id, medToUpdate);
//     //   if (response) {
//     //     console.log("Updated successfully");
//     //     setEditingId(null);
//     //     handlegetmedicine();
//     //   }
//     // } catch (error) {
//     //   console.error("Update failed:", error);
//     // }
//     // ...........

//     try {
//       const med = medicineData.find((m) => m._id === id);

//       const formData = new FormData();

//       formData.append("name", med.name);
//       formData.append("brand", med.brand);
//       formData.append("price", med.price);
//       formData.append("countInStock", med.countInStock);
//       formData.append("category", med.category);
//       formData.append("description", med.description);

//       // 👇 only if user selected new image
//       if (image) {
//         formData.append("image", image);
//       }

//       const response = await UpdateMedicine(id, formData);

//       if (response) {
//         setEditingId(null);
//         setimage(null);
//         setpreview("");
//         handlegetmedicine();
//       }
//     } catch (error) {
//       console.error("Update failed:", error);
//     }
//   };

//   const handleDeleteMedicine = async (id) => {
//     try {
//       const response = await DeleteMedicine(id);
//       if (response) {
//         console.log("Deleted successfully");
//         handlegetmedicine();
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="medicines-content">
//       <h2>Manage Medicines</h2>
//       <button
//         className="medicine-btn"
//         onClick={() => setShowMedicineForm(!showMedicineForm)}
//       >
//         {showMedicineForm ? "Close Form" : "Add Medicine"}
//       </button>

//       {showMedicineForm && (
//         <form className="medicine-form" onSubmit={handleSubmit}>
//           <label htmlFor="addimage" className="image-upload">
//             {loading ? (
//               <MedicineLoader loading={loading} />
//             ) : preview ? (
//               <img src={preview} alt="medicine" />
//             ) : (
//               "Upload Medicine Picture"
//             )}
//           </label>
//           <input type="file" id="addimage" onChange={handleUploadImage} />

//           <input
//             type="text"
//             className="medicine-input"
//             name="name"
//             placeholder="Medicine Name"
//             value={payload.name}
//             onChange={handleChange}
//           />
//           <input
//             type="text"
//             className="medicine-input"
//             name="brand"
//             placeholder="Brand Name"
//             value={payload.brand}
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             className="medicine-input"
//             name="price"
//             placeholder="Price"
//             value={payload.price}
//             onChange={handleChange}
//           />
//           <input
//             type="number"
//             className="medicine-input"
//             name="countInStock"
//             placeholder="Stock Count"
//             value={payload.countInStock}
//             onChange={handleChange}
//           />

//           <select
//             name="category"
//             className="medicine-input"
//             value={payload.category}
//             onChange={handleChange}
//           >
//             <option value="">Select Category</option>
//             <option value="Pain Relief">Pain Relief</option>
//             <option value="Antibiotics">Antibiotics</option>
//             <option value="Cough & Cold">Cough & Cold</option>
//             <option value="Skin Care">Skin Care</option>
//             <option value="Heart">Heart</option>
//             <option value="Diabetes">Diabetes</option>
//             <option value="Vitamins">Vitamins</option>
//           </select>

//           <textarea
//             className="medicine-textarea"
//             name="description"
//             placeholder="Description"
//             rows={3}
//             value={payload.description}
//             onChange={handleChange}
//           ></textarea>

//           <button type="submit" className="medicine-btn">
//             {loading ? "Adding..." : "Add Medicine"}
//           </button>
//         </form>
//       )}

//       <div>
//         <h3>Existing Medicines</h3>
//         <div className="table-wrapper">
//           <table className="medicines-table">
//             <thead>
//               <tr>
//                 <th>Image</th>
//                 <th>Description</th>
//                 <th>Name</th>
//                 <th>Brand</th>
//                 <th>countInStock</th>
//                 <th>Price</th>
//                 <th>Category</th>
//                 <th>Action</th>
//                 <th>Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {medicineData?.map((med) => (
//                 <tr key={med._id}>
//                   <td>
//                     {editingId === med._id ? (
//                       <>
//                         <label htmlFor="addimage" className="image-upload">
//                           {loading ? (
//                             <MedicineLoader loading={loading} />
//                           ) : preview ? (
//                             <img src={preview} alt="medicine" />
//                           ) : (
//                             "Upload"
//                           )}
//                         </label>
//                         <input
//                           type="file"
//                           id="addimage"
//                           onChange={(e) => handleEditImage(e, med._id)}
//                         />
//                       </>
//                     ) : (
//                       // <input
//                       //   className="medicine-input"
//                       //   value={med.image}
//                       //   onChange={(e) =>
//                       //     handleMedicineChange(e, "image", med._id)
//                       //   }
//                       // />
//                       <img
//                         src={med.image}
//                         alt="med"
//                         width={"130px"}
//                         height={"130px"}
//                       />
//                     )}
//                   </td>
//                   <td
//                     style={{
//                       maxWidth: "200px",
//                       whiteSpace: "nowrap",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                     }}
//                   >
//                     {editingId === med._id ? (
//                       <textarea
//                         className="medicine-textarea"
//                         value={med.description}
//                         onChange={(e) =>
//                           handleMedicineChange(e, "description", med._id)
//                         }
//                       />
//                     ) : (
//                       med.description
//                     )}
//                   </td>
//                   <td>
//                     {editingId === med._id ? (
//                       <input
//                         className="medicine-input"
//                         value={med.name}
//                         onChange={(e) =>
//                           handleMedicineChange(e, "name", med._id)
//                         }
//                       />
//                     ) : (
//                       med.name
//                     )}
//                   </td>
//                   <td>
//                     {editingId === med._id ? (
//                       <input
//                         className="medicine-input"
//                         value={med.brand}
//                         onChange={(e) =>
//                           handleMedicineChange(e, "brand", med._id)
//                         }
//                       />
//                     ) : (
//                       med.brand
//                     )}
//                   </td>
//                   <td>
//                     {editingId === med._id ? (
//                       <input
//                         className="medicine-input"
//                         value={med.countInStock}
//                         onChange={(e) =>
//                           handleMedicineChange(e, "countInStock", med._id)
//                         }
//                       />
//                     ) : (
//                       med.countInStock
//                     )}
//                   </td>
//                   <td>
//                     {editingId === med._id ? (
//                       <input
//                         className="medicine-input"
//                         value={med.price}
//                         onChange={(e) =>
//                           handleMedicineChange(e, "price", med._id)
//                         }
//                       />
//                     ) : (
//                       med.price
//                     )}
//                   </td>
//                   <td>
//                     {editingId === med._id ? (
//                       <input
//                         className="medicine-input"
//                         value={med.category}
//                         onChange={(e) =>
//                           handleMedicineChange(e, "category", med._id)
//                         }
//                       />
//                     ) : (
//                       med.category
//                     )}
//                   </td>
//                   <td>
//                     {editingId === med._id ? (
//                       <button
//                         className="medicine-btn"
//                         onClick={() => handleSaveMedicine(med._id)}
//                       >
//                         Save
//                       </button>
//                     ) : (
//                       <button
//                         className="medicine-btn"
//                         onClick={() => setEditingId(med._id)}
//                       >
//                         Edit
//                       </button>
//                     )}
//                     <button
//                       className="medicine-btn delete"
//                       onClick={() => handleDeleteMedicine(med._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                   <td>{new Date(med?.createdAt).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <Pagination
//         totalPages={totalPages}
//         currentPage={currentPage}
//         handlePageChange={handlePageChange}
//       />
//     </div>
//   );
// };

// export default MedicinesTabs;

import React, { useEffect, useState } from "react";
import "./css/MedicinesTabs.css";
import Pagination from "../../components/common/Pagination";
import { SetLoader } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import MedicineLoader from "../../components/common/MedicineLoader";
import {
  AddMedicine,
  DeleteMedicine,
  Getmedicine,
  UpdateMedicine,
} from "../../Apicalls/medicine";

const initialPayload = {
  name: "",
  brand: "",
  price: "",
  countInStock: "",
  description: "",
  category: "",
};

const MedicinesTabs = () => {
  const [showMedicineForm, setShowMedicineForm] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const { loading } = useSelector((state) => state?.loaders);
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [payload, setPayload] = useState(initialPayload);
  const [medicineData, setMedicineData] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // ================= ADD MEDICINE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(SetLoader(true));

    try {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

      if (image) {
        formData.append("image", image);
      }

      const response = await AddMedicine(formData);
      if (response) {
        handlegetmedicine();
        // setPayload(initialPayload);
        // setImage(null);
        // setPreview("");
        // setShowMedicineForm(false);
        resetForm();
      }
    } catch (error) {
      console.error("Add Medicine Error:", error);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const resetForm = () => {
    setPayload(initialPayload);
    setImage(null);
    setPreview("");
    setShowMedicineForm(false);
  };

  // ================= INPUT HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedicineChange = (e, field, id) => {
    const { value } = e.target;
    setMedicineData((prev) =>
      prev.map((med) => (med._id === id ? { ...med, [field]: value } : med))
    );
  };

  // ================= IMAGE HANDLERS =================
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleEditImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ================= GET MEDICINES =================
  const handlegetmedicine = async () => {
    try {
      const response = await Getmedicine({ pageNumber: currentPage });
      if (response) {
        setMedicineData(response.Medicines);
        setTotalPages(response.pages);
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    handlegetmedicine();
  }, [currentPage]);

  // ================= UPDATE MEDICINE =================
  const handleSaveMedicine = async (id) => {
    try {
      const med = medicineData.find((m) => m._id === id);
      const formData = new FormData();

      formData.append("name", med.name);
      formData.append("brand", med.brand);
      formData.append("price", med.price);
      formData.append("countInStock", med.countInStock);
      formData.append("category", med.category);
      formData.append("description", med.description);

      if (image) {
        formData.append("image", image);
      }

      const response = await UpdateMedicine(id, formData);
      if (response) {
        EditresetForm()
        // setEditingId(null);
        // setImage(null);
        // setPreview("");
        handlegetmedicine();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const EditresetForm=()=>{
    setEditingId(null);
    setImage(null);
    setPreview("")
  }


  // ================= DELETE MEDICINE =================
  const handleDeleteMedicine = async (id) => {
    try {
      const response = await DeleteMedicine(id);
      if (response) handlegetmedicine();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= RENDER =================
  return (
    <div className="medicines-content">
      <h2>Manage Medicines</h2>

      {!showMedicineForm && (
        <button
          className="medicine-btn"
          onClick={() => setShowMedicineForm(!showMedicineForm)}
        >
          Add Medicine
        </button>
      )}

      {showMedicineForm && (
        <button className="medicine-btn" onClick={() => resetForm()}>
          Close Form
        </button>
      )}

      {showMedicineForm && (
        <form className="medicine-form" onSubmit={handleSubmit}>
          <label className="image-upload">
            {loading ? (
              <MedicineLoader loading={loading} />
            ) : preview ? (
              <img src={preview} alt="preview" />
            ) : (
              "Upload Medicine Picture"
            )}
            <input type="file" hidden onChange={handleUploadImage} />
          </label>

          <input
            type="text"
            className="medicine-input"
            name="name"
            placeholder="Name"
            value={payload.name}
            onChange={handleChange}
          />
          <input
            type="text"
            className="medicine-input"
            name="brand"
            placeholder="Brand"
            value={payload.brand}
            onChange={handleChange}
          />
          <input
            className="medicine-input"
            name="price"
            type="number"
            placeholder="Price"
            value={payload.price}
            onChange={handleChange}
          />
          <input
            className="medicine-input"
            name="countInStock"
            type="number"
            placeholder="Stock"
            value={payload.countInStock}
            onChange={handleChange}
          />

          <select
            className="medicine-input"
            name="category"
            value={payload.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            <option value="Pain Relief">Pain Relief</option>
            <option value="Antibiotics">Antibiotics</option>
            <option value="Cough & Cold">Cough & Cold</option>
            <option value="Skin Care">Skin Care</option>
            <option value="Heart">Heart</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Vitamins">Vitamins</option>
          </select>

          <textarea
            className="medicine-textarea"
            name="description"
            placeholder="Description"
            value={payload.description}
            onChange={handleChange}
          />

          <button className="medicine-btn" type="submit">
            {loading ? "Adding..." : "Add Medicine"}
          </button>
        </form>
      )}

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="medicines-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Description</th>
              <th>Name</th>
              <th>Brand</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Category</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {medicineData.map((med) => (
              <tr key={med._id}>
                <td>
                  {editingId === med._id ? (
                    <>
                      <label className="image-upload">
                        {preview ? (
                          <img src={preview} alt="preview" />
                        ) : (
                          "Change"
                        )}
                        <input type="file" hidden onChange={handleEditImage} />
                      </label>
                    </>
                  ) : (
                    <img src={med.image?.url} alt="med" width="120" />
                  )}
                </td>

                <td
                  style={{
                    maxWidth: "200px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {editingId === med._id ? (
                    <textarea
                      className="medicine-textarea"
                      value={med.description}
                      onChange={(e) =>
                        handleMedicineChange(e, "description", med._id)
                      }
                    />
                  ) : (
                    med.description
                  )}
                </td>
                <td>
                  {editingId === med._id ? (
                    <input
                      className="medicine-input"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(e, "name", med._id)}
                    />
                  ) : (
                    med.name
                  )}
                </td>
                <td>
                  {editingId === med._id ? (
                    <input
                      className="medicine-input"
                      value={med.brand}
                      onChange={(e) =>
                        handleMedicineChange(e, "brand", med._id)
                      }
                    />
                  ) : (
                    med.brand
                  )}
                </td>
                <td>
                  {editingId === med._id ? (
                    <input
                      className="medicine-input"
                      value={med.countInStock}
                      onChange={(e) =>
                        handleMedicineChange(e, "countInStock", med._id)
                      }
                    />
                  ) : (
                    med.countInStock
                  )}
                </td>
                <td>
                  {editingId === med._id ? (
                    <input
                      className="medicine-input"
                      value={med.price}
                      onChange={(e) =>
                        handleMedicineChange(e, "price", med._id)
                      }
                    />
                  ) : (
                    med.price
                  )}
                </td>
                <td>
                  {editingId === med._id ? (
                    <input
                      className="medicine-input"
                      value={med.category}
                      onChange={(e) =>
                        handleMedicineChange(e, "category", med._id)
                      }
                    />
                  ) : (
                    med.category
                  )}
                </td>

                <td>
                  {editingId === med._id ? (
                    <>
                      <button
                        className="medicine-btn"
                        onClick={() => handleSaveMedicine(med._id)}
                      >
                        Save
                      </button>

                      <button
                        className="medicine-btn"
                        onClick={() => EditresetForm()}
                      >
                        cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="medicine-btn"
                      onClick={() => setEditingId(med._id)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="medicine-btn delete"
                    onClick={() => handleDeleteMedicine(med._id)}
                  >
                    Delete
                  </button>
                </td>

                <td>{new Date(med.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={setCurrentPage}
      />
    </div>
  );
};

export default MedicinesTabs;
