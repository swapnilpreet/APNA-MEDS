import React, { useEffect, useState } from "react";
import "./css/MedicinesTabs.css";
import Pagination from "../../components/common/Pagination";
import { SetLoader } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import MedicineLoader from "../../components/common/MedicineLoader";
import axios from "axios";
import Error from "../../components/common/Error";

const initialPayload = {
  name: "",
  brand: "",
  price: "",
  countInStock: "",
  description: "",
  category: "",
};

const medicineCategories = [
  "Pain Relief",
  "Cold & Cough",
  "Fever",
  "Diabetes",
  "Blood Pressure",
  "Heart Care",
  "Digestive Care",
  "Liver Care",
  "Kidney Care",
  "Respiratory",
  "Allergy",
  "Skin Care",
  "Eye Care",
  "Ear Care",
  "Dental Care",
  "Neurology",
  "Psychiatric",
  "Antibiotics",
  "Antiviral",
  "Antifungal",
  "Hormonal",
  "Thyroid",
  "Women Care",
  "Pregnancy Care",
  "Infertility",
  "Pediatric",
  "Geriatric",
  "Cancer Care",
  "Immunity Boosters",
  "Vitamins & Supplements",
  "Ayurvedic",
  "Homeopathy",
  "Nutrition & Health Drinks",
  "First Aid",
  "Surgical & Medical Devices",
];

const medicineBrands = [
  "Sun Pharma",
  "Cipla",
  "Dr Reddy’s",
  "Lupin",
  "Aurobindo Pharma",
  "Torrent Pharmaceuticals",
  "Alkem Laboratories",
  "Zydus Lifesciences",
  "Glenmark",
  "Abbott India",
  "Pfizer India",
  "Mankind Pharma",
  "Intas Pharmaceuticals",
  "Alembic Pharmaceuticals",
  "Ipca Laboratories",
  "Biocon",
  "Aristo Pharmaceuticals",
  "USV",
  "Micro Labs",
  "Emcure Pharmaceuticals",
  "Hetero Drugs",
  "Cadila Healthcare",
  "Serum Institute of India",
  "Wockhardt",
  "Sanofi India",
  "Bayer India",
  "Merck India",
  "Johnson & Johnson",
  "AbbVie",
  "Novartis India",
  "GSK India",
  "Roche India",
  "Takeda India",
  "Eli Lilly India",
  "AstraZeneca India",
  "Bristol Myers Squibb",
  "Abbott Healthcare",
  "Natco Pharma",
  "FDC Limited",
  "Blue Cross Laboratories",
  "Eris Lifesciences",
  "Ajanta Pharma",
  "La Renon",
  "Himalaya Wellness",
  "Dabur",
  "Patanjali Ayurved",
  "Charak Pharma",
  "Zandu",
  "Baidyanath",
  "Kerala Ayurveda",
];

const Medicinetabs = () => {
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
  // const [medicineBrand, setMedicineBrand] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // dispatch(SetLoader(true));
    try {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => formData.append(key, payload[key]));

      if (image) {
        formData.append("image", image);
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BASEURL}/api/medicine`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.success) {
        handlegetmedicine();
        resetForm();
      }
    } catch (error) {
      console.error("Add Medicine Error:", error);
    }
    // finally {
    //   // dispatch(SetLoader(false));
    // }
  };

  // ================= GET MEDICINES =================
  const handlegetmedicine = async () => {
    dispatch(SetLoader(true));
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASEURL
        }/api/medicine?pageNumber=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        setMedicineData(response.data.Medicines);
        setTotalPages(response.data.pages);
        // setMedicineBrand(response.data.brandList);
      }
    } catch (error) {
      console.log(error?.message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

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
      const response = await axios.put(
        `${import.meta.env.VITE_BASEURL}/api/medicine/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response?.data?.success) {
        EditresetForm();
        handlegetmedicine();
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // ================= DELETE MEDICINE =================
  const handleDeleteMedicine = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/medicine/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) handlegetmedicine();
    } catch (error) {
      console.log(error);
    }
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

  const resetForm = () => {
    setPayload(initialPayload);
    setImage(null);
    setPreview("");
    setShowMedicineForm(false);
  };

  useEffect(() => {
    handlegetmedicine();
  }, [currentPage]);

  const EditresetForm = () => {
    setEditingId(null);
    setImage(null);
    setPreview("");
  };

  return (
    <>
      {loading ? (
        <MedicineLoader />
      ) : (
        <div className="medicines-content">
          {/* ADD / CLOSE FORM BUTTON */}
          {!showMedicineForm ? (
            <button
              className="medicine-btn"
              onClick={() => setShowMedicineForm(true)}
            >
              Add Medicine
            </button>
          ) : (
            <button className="medicine-btn" onClick={resetForm}>
              Close Form
            </button>
          )}

          {/* ADD MEDICINE FORM */}
          {showMedicineForm && (
            <form className="medicine-form" onSubmit={handleSubmit}>
              <label className="image-upload">
                {preview ? (
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

              <select
                className="medicine-input"
                name="brand"
                value={payload.brand}
                onChange={handleChange}
              >
                <option value="">Select Brand</option>
                {medicineBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

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
                {medicineCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <textarea
                className="medicine-textarea"
                name="description"
                placeholder="Description"
                value={payload.description}
                onChange={handleChange}
              />

              <button className="medicine-btn" type="submit">
                Add Medicine
              </button>
            </form>
          )}

          {/* 🔥 MAIN CONDITION */}
          {medicineData.length === 0 ? (
            <Error message="No Medicine Found" />
          ) : (
            <>
              <h2>Manage Medicines</h2>

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
                          <img
                            src={med.image?.url || med.image}
                            alt="med"
                            width="120"
                          />
                        </td>
                        <td>{med.description}</td>
                        <td>{med.name}</td>
                        <td>{med.brand}</td>
                        <td>{med.countInStock}</td>
                        <td>{med.price}</td>
                        <td>{med.category}</td>
                        <td>
                          <button
                            className="medicine-btn"
                            onClick={() => setEditingId(med._id)}
                          >
                            Edit
                          </button>
                          <button
                            className="medicine-btn delete"
                            onClick={() => handleDeleteMedicine(med._id)}
                          >
                            Delete
                          </button>
                        </td>
                        <td>
                          {med.createdAt
                            ? new Date(med.createdAt).toLocaleString("en-IN")
                            : "—"}
                        </td>
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
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Medicinetabs;
