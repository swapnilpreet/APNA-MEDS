// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { uploadImageToCloudinary } from "../../Utills/UploadImage";
// import { AddMedicalHistory, EditMedicalHistory } from "../../Apicalls/user";
// import { SetLoader } from "../../redux/LoadingSlice";
// import "../css/MedicalHistoryModal.css";
// import MedicineLoader from "./MedicineLoader";

// const MedicalHistoryModal = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   initialData = null,
// }) => {
//   const loader = useSelector((state) => state.loaders.loading);
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({
//     condition: "",
//     diagnosisDate: "",
//     medications: [""],
//     notes: "",
//     prescriptionUrl: "",
//   });
//   const [preview, setPreview] = useState("");

//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         condition: initialData.condition || "",
//         diagnosisDate: initialData.diagnosisDate?.slice(0, 10) || "",
//         medications: Array.isArray(initialData.medications)
//           ? initialData.medications
//           : [initialData.medications || ""],
//         notes: initialData.notes || "",
//         prescriptionUrl: initialData.prescriptionUrl || "",
//       });
//       setPreview(initialData.prescriptionUrl || "");
//     } else {
//       resetForm();
//     }
//   }, [initialData]);

//   const resetForm = () => {
//     setFormData({
//       condition: "",
//       diagnosisDate: "",
//       medications: [""],
//       notes: "",
//       prescriptionUrl: "",
//     });
//     setPreview("");
//   };

//   const handleChange = (e, index) => {
//     if (e.target.name === "medications") {
//       const meds = [...formData.medications];
//       meds[index] = e.target.value;
//       setFormData({ ...formData, medications: meds });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const addMedicationField = () => {
//     setFormData({ ...formData, medications: [...formData.medications, ""] });
//   };

//   const handleFileChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     try {
//       dispatch(SetLoader(true));
//       const url = await uploadImageToCloudinary(file);
//       if (url) {
//         setFormData({ ...formData, prescriptionUrl: url });
//         setPreview(url);
//       }
//     } catch (error) {
//         console.error("File Upload Error:", error);
//       toast.error("Failed to upload image. Please try again.");
//     } finally {
//       dispatch(SetLoader(false));
//     }
//   };

//   const handleSubmit = async () => {
//     const { condition, diagnosisDate, medications, prescriptionUrl } = formData;
//     if (
//       !condition ||
//       !diagnosisDate ||
//       !prescriptionUrl ||
//       medications.some((m) => !m.trim())
//     ) {
//       toast.warn("Please fill all required fields and upload a prescription.");
//       return;
//     }

//     try {
//       dispatch(SetLoader(true));
//       let response;
//       if (initialData?._id) {
//         response = await EditMedicalHistory(formData, initialData._id);
//       } else {
//         response = await AddMedicalHistory(formData);
//       }
//       if (response) {
//         toast.success(
//           initialData ? "Medical history updated!" : "Medical history added!"
//         );
//         onSuccess?.();
//         onClose();
//         resetForm();
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       dispatch(SetLoader(false));
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <h3>{initialData ? "Edit Medical History" : "Add Medical History"}</h3>

//         <input
//           type="text"
//           name="condition"
//           placeholder="Condition *"
//           value={formData.condition}
//           onChange={handleChange}
//         />

//         <input
//           type="date"
//           name="diagnosisDate"
//           value={formData.diagnosisDate}
//           onChange={handleChange}
//         />

//         {formData.medications.map((med, index) => (
//           <input
//             key={index}
//             type="text"
//             name="medications"
//             placeholder="Medication *"
//             value={med}
//             onChange={(e) => handleChange(e, index)}
//           />
//         ))}
//         <button type="button" onClick={addMedicationField}>
//           + Add Medication
//         </button>

//         <textarea
//           name="notes"
//           placeholder="Notes (optional)"
//           value={formData.notes}
//           onChange={handleChange}
//         />

//         <label htmlFor="file">Upload Prescription Image *</label>
//         <input
//           id="file"
//           type="file"
//           accept="image/*"
//           onChange={handleFileChange}
//         />
//         {loader && <MedicineLoader />}
//         {preview && (
//           <img
//             src={preview}
//             alt="Prescription Preview"
//             className="prescription-preview"
//           />
//         )}

//         <div className="modal-actions">
//           <button onClick={handleSubmit}>
//             {initialData ? "Save Changes" : "Submit"}
//           </button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicalHistoryModal;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { toast, ToastContainer } from "react-toastify";
import { uploadImageToCloudinary } from "../../Utills/UploadImage";
import { AddMedicalHistory, EditMedicalHistory } from "../../Apicalls/user";
import { SetLoader } from "../../redux/LoadingSlice";
import "../css/MedicalHistoryModal.css";
import MedicineLoader from "./MedicineLoader";

const MedicalHistoryModal = ({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
}) => {
  const loader = useSelector((state) => state.loaders.loading);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    condition: "",
    diagnosisDate: "",
    medications: [""],
    notes: "",
    prescriptionUrl: "",
  });

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // ← store file

  useEffect(() => {
    if (initialData) {
      setFormData({
        condition: initialData.condition || "",
        diagnosisDate: initialData.diagnosisDate?.slice(0, 10) || "",
        medications: Array.isArray(initialData.medications)
          ? initialData.medications
          : [initialData.medications || ""],
        notes: initialData.notes || "",
        prescriptionUrl: initialData.prescriptionUrl || "",
      });

      setPreview(initialData.prescriptionUrl || "");
      setSelectedFile(null);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      condition: "",
      diagnosisDate: "",
      medications: [""],
      notes: "",
      prescriptionUrl: "",
    });
    setPreview("");
    setSelectedFile(null);
  };

  // -------------------------------
  //  FIXED: NO CLOUDINARY UPLOAD HERE
  // -------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file)); // show local preview
  };

  const handleSubmit = async () => {
    const { condition, diagnosisDate, medications, notes, prescriptionUrl } =
      formData;

    if (!condition || !diagnosisDate || medications.some((m) => !m.trim())) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      dispatch(SetLoader(true));

      let uploadedUrl = formData.prescriptionUrl;

      // ---------------------------------------------
      //   FIXED: Upload only when submitting
      // ---------------------------------------------
      if (selectedFile) {
        uploadedUrl = await uploadImageToCloudinary(selectedFile);
      }

      const finalData = {
        ...formData,
        prescriptionUrl: uploadedUrl,
      };

      let response;

      if (initialData?._id) {
        console.log("initialData?._id", initialData?._id);
        response = await EditMedicalHistory(finalData, initialData._id);
      } else {
        response = await AddMedicalHistory(finalData);
      }

      console.log("response", response);
      if (response.success) {
        dispatch(SetLoader(false));
        // console.log("response inside",response.message)
        // alert(response.message);
        onSuccess();
        onClose();
        resetForm();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      console.error(error);
      // alert(error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal">
          <h3>
            {initialData ? "Edit Medical History" : "Add Medical History"}
          </h3>

          <input
            type="text"
            name="condition"
            placeholder="Condition *"
            value={formData.condition}
            onChange={(e) =>
              setFormData({ ...formData, condition: e.target.value })
            }
          />

          <input
            type="date"
            name="diagnosisDate"
            value={formData.diagnosisDate}
            onChange={(e) =>
              setFormData({ ...formData, diagnosisDate: e.target.value })
            }
          />

          {formData.medications.map((med, index) => (
            <input
              key={index}
              type="text"
              name="medications"
              placeholder="Medication *"
              value={med}
              onChange={(e) => {
                const meds = [...formData.medications];
                meds[index] = e.target.value;
                setFormData({ ...formData, medications: meds });
              }}
            />
          ))}

          <button
            type="button"
            onClick={() =>
              setFormData({
                ...formData,
                medications: [...formData.medications, ""],
              })
            }
          >
            + Add Medication
          </button>

          <textarea
            name="notes"
            placeholder="Notes (optional)"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          />

          <label htmlFor="file">Upload Prescription Image *</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          {preview && (
            <img src={preview} alt="Preview" className="prescription-preview" />
          )}

          {loader && <MedicineLoader />}

          <div className="modal-actions">
            <button onClick={handleSubmit}>
              {initialData ? "Save Changes" : "Submit"}
            </button>
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MedicalHistoryModal;
