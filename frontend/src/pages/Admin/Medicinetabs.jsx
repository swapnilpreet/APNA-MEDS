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

const Medicinetabs=()=>{
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
        EditresetForm();
        // setEditingId(null);
        // setImage(null);
        // setPreview("");
        handlegetmedicine();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const EditresetForm = () => {
    setEditingId(null);
    setImage(null);
    setPreview("");
  };

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

export default Medicinetabs;
