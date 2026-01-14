import React, { useState, useEffect } from "react";
import "./Patients.css";
import Pagewrapper from "../../components/common/Pagewrapper";
import Footer from "../../components/common/Footer";
import { validatePatient } from "../../Utills/validatePatient";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import Error from "../../components/common/Error";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const { loading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  
  const fetchAllPatients = async () => {
    try {
      try {
        dispatch(SetLoader(true))
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `${import.meta.env.VITE_BASEURL}/api/patient/`,
          {
            headers: { authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (data.success) {
          setPatients(data.data);
        }
      } catch (error) {
        console.log("Error fetching patients:", error);
      }
    } catch (error) {
      console.log("Error fetching patients:", error);
    } finally{
      dispatch(SetLoader(false))
    }
  };

  const handleSubmit = async () => {
    const error = validatePatient(form);
    if (error) {
      toast(error);
      return;
    }
    let response = null;
    try {
      if (isEdit) {
        response = await axios.put(
          `${import.meta.env.VITE_BASEURL}/api/patient/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          toast.success("Patient Updated successfully");
        }
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/patient`,
          form,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          toast.success("Patient Added successfully");
        }
      }
      fetchAllPatients();
    } catch (error) {
      console.log("Error saving patient:", error);
    }
    setModalOpen(false);
    setForm({ name: "", age: "" });
    setIsEdit(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/patient/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        toast.success("Patient Deleted successfully");
        fetchAllPatients();
      }
    } catch (error) {
      console.log("Error deleting patient:", error);
    }
  };

  const handleEdit = (patient) => {
    setForm({ name: patient.name, age: patient.age });
    setIsEdit(true);
    setEditingId(patient._id);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  return (
    <>
      <ToastContainer />
      <Pagewrapper>
        <div className="patients-container">
          <h1 className="patients-title">Patient List</h1>
          <button
            className="add-patient-btn"
            onClick={() => setModalOpen(true)}
          >
            Add Patient
          </button>

          {loading ? null : patients?.length >= 1 ? (
            <div className="table-wrapper">
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p._id} className="patients-row">
                      <td className="patients-td">{p.name}</td>
                      <td className="patients-td">{p.age}</td>
                      <td className="patients-td">
                        <button
                          className="medicine-btn"
                          onClick={() => handleEdit(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="medicine-btn delete"
                          onClick={() => handleDelete(p._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Error message={"No patients found."} />
          )}

          {modalOpen && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h2 className="modal-title">
                  {isEdit ? "Edit Patient" : "Add Patient"}
                </h2>
                <input
                  name="name"
                  className="modal-input"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                />
                <input
                  name="age"
                  className="modal-input"
                  placeholder="Age"
                  value={form.age}
                  onChange={handleChange}
                />
                <div className="modal-actions">
                  <button className="modal-btn save-btn" onClick={handleSubmit}>
                    {isEdit ? "Update" : "Add"}
                  </button>
                  <button
                    className="modal-btn cancel-btn"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Pagewrapper>
      <Footer />
    </>
  );
};

export default Patients;
