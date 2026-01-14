import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import "../css/MedicalHistoryModal.css";
import MedicineLoader from "./MedicineLoader";
import axios from "axios";

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
  });

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        condition: initialData.condition || "",
        diagnosisDate: initialData.diagnosisDate?.slice(0, 10) || "",
        medications: Array.isArray(initialData.medications)
          ? initialData.medications
          : [initialData.medications || ""],
        notes: initialData.notes || "",
      });
      setPreview(initialData.prescriptionUrl?.url || "");
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
    });
    setPreview("");
    setSelectedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };


  const handleSubmit = async () => {
    try {
      dispatch(SetLoader(true));
      const payload = new FormData();
      payload.append("condition", formData.condition);
      payload.append("diagnosisDate", formData.diagnosisDate);
      payload.append("notes", formData.notes);

      formData.medications.forEach((med) => payload.append("medications", med));

      if (selectedFile) {
        payload.append("image", selectedFile);
      }

      let response;
 
      if (initialData?._id) {
        response = await axios.put(
          `${import.meta.env.VITE_BASEURL}/api/users/medical-history/${
            initialData._id
          }`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/users/medical-history`,
          payload,
          {
            headers: {
              Authorization:`Bearer ${localStorage.getItem("token")}`,
              "Content-Type":"multipart/form-data",
            },
          }
        );
      }

      if(response.data?.success) {
        // console.log("onClose()")
        onClose();
        onSuccess();
        resetForm();
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{initialData ? "Edit Medical History" : "Add Medical History"}</h3>

        <input
          type="text"
          placeholder="Condition *"
          value={formData.condition}
          onChange={(e) =>
            setFormData({ ...formData, condition: e.target.value })
          }
        />

        <input
          type="date"
          value={formData.diagnosisDate}
          onChange={(e) =>
            setFormData({ ...formData, diagnosisDate: e.target.value })
          }
        />

        {formData.medications.map((med, index) => (
          <input
            key={index}
            type="text"
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
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />

        <label>Upload Prescription Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

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
  );
};

export default MedicalHistoryModal;
