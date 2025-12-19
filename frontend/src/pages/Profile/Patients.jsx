import React, { useState, useEffect } from "react";
import "./Patients.css";
import {
  AddPatient,
  DeletePatient,
  GetAllPatients,
  UpdatePatient,
} from "../../Apicalls/petient";
import Pagewrapper from "../../components/common/Pagewrapper";
import Footer from "../../components/common/Footer";
import { validatePatient } from "../../Utills/validatePatient";
import { toast, ToastContainer } from "react-toastify";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchAllPatients = async () => {
    try {
      const response = await GetAllPatients();
      if (response) setPatients(response);
      else throw new Error("Failed to fetch patients");
    } catch (error) {
      console.log("Error fetching patients:", error);
    }
  };

  useEffect(() => {
    fetchAllPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const error = validatePatient(form);
    if (error) {
      toast(error);
      return;
    }

    try {
      if(isEdit){
        await UpdatePatient(editingId, form);
        toast.success("Patient Updated");
      }else{
        await AddPatient(form);
        toast.success("Patient Added successfully");
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
      await DeletePatient(id);
      fetchAllPatients();
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

          {patients?.length >= 1 ? (
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
            <p className="no-patients-text">No patients found.</p>
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
