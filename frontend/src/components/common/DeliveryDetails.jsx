import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import "../css/DeliveryDetails.css";
import { validatePatient } from "../../Utills/validatePatient";
import { validateAddress } from "../../Utills/validateAddress";
import { ToastContainer } from "react-toastify";

const DeliveryDetails = ({
  isOpen,
  handleopenClosed,
  setSelectedPatient,
  selectedPatient,
  selectedAddress,
  setSelectedAddress,
}) => {
  const [showForm, setShowForm] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalcode: 442200,
    country: "",
    age: "",
  });

  const [patients, setPatients] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BASEURL}/api/patient/`, {
        headers: { authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setPatients(response.data.data || []);
    } catch (error) {
      console.log("Error fetching patients:", error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/patient/address`,
        {
          headers: { authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      setAddresses(response.data.data || []);
    } catch (error) {
      console.log("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchAddresses();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    if (showForm === "patient") {
      const { name, age } = formData;
      const error = validatePatient(formData);
      if (error) {
        alert(error);
        return;
      }
      try {
        await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/patient/`,
          { name: name.trim(), age: Number(age) },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        fetchPatients();
      } catch (err) {
        console.error("Error adding patient:", err);
      }
    } else if (showForm === "address") {
      const { address, city, postalcode, country } = formData;
      const error = validateAddress(formData);
      if (error) {
        alert(error);
        return;
      }
      try {
        await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/patient/address`,
          {
            country: country.trim(),
            address: address.trim(),
            city: city.trim(),
            postalcode: Number(postalcode),
          },
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }
        );
        fetchAddresses();
      } catch (err) {
        console.error("Error adding address:", err);
      }
    }
    setFormData({
      name: "",
      address: "",
      city: "",
      postalcode: "",
      country: "",
      age: "",
    });
    setShowForm(null);
  };

  const handleSave = () => {
    setShowForm(null), handleopenClosed();
  };
 
  return (
    <>
      <ToastContainer />
      <div className={`slider-panel ${isOpen ? "open" : ""}`}>
        <div className="header">
          <h2>
            {showForm === "patient"
              ? "Add Patient"
              : showForm === "address"
              ? "Add Address"
              : "Delivery details"}
          </h2>
          <FaTimes size={20} onClick={handleSave} />
        </div>

        {showForm === "patient" && (
          <div className="form">
            <input
              type="text"
              name="name"
              placeholder="Patient Name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="age"
              placeholder="Patient Age"
              value={formData.age}
              onChange={handleFormChange}
            />
            <button onClick={handleFormSubmit}>Save Patient</button>
          </div>
        )}

        {showForm === "address" && (
          <div className="form">
            <input
              type="text"
              name="address"
              placeholder="Address (e.g., 123 Main St)"
              value={formData.address}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City (e.g., Bangalore)"
              value={formData.city}
              onChange={handleFormChange}
            />
            <input
              type="number"
              name="postalcode"
              placeholder="PostalCode (e.g., 560001)"
              value={formData.postalcode}
              onChange={handleFormChange}
            />
            <input
              type="text"
              name="country"
              placeholder="Country (e.g., India)"
              value={formData.country}
              onChange={handleFormChange}
            />
            <button onClick={handleFormSubmit}>Save Address</button>
          </div>
        )}

        {!showForm && (
          <>
            <div className="section">
              <div className="section-header">
                {patients.length>0 && <span>Select patient</span>}
                <button
                  className="dev-btn"
                  onClick={() => setShowForm("patient")}
                >
                  + Add Patient
                </button>
              </div>
              <div className="fixed-section">
                {patients.map((p) => (
                  <div
                    key={p._id}
                    className={`selectable-card ${
                      selectedPatient?._id === p._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedPatient(p)}
                  >
                    <input
                      type="radio"
                      name="patient"
                      checked={selectedPatient?._id === p._id}
                      readOnly
                    />
                    <div className="patient-box">
                      <strong>Patient : {p?.name}</strong>
                      <br />
                      <strong>Age : {p?.age}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section">
              <div className="section-header">
                {addresses.length>0 && <span>Select address</span>}
                <button
                  className="dev-btn"
                  onClick={() => setShowForm("address")}
                >
                  + Add Address
                </button>
              </div>
              <div className="fixed-section-address">
                {addresses.map((a) => (
                  <div
                    key={a._id}
                    className={`selectable-card ${
                      selectedAddress?._id === a._id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedAddress(a)}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress?._id === a._id}
                      readOnly
                    />
                    <div className="address-box">
                      <strong>{a?.address}</strong>
                      <p>{a?.city}</p>
                      <strong>{a?.postalcode}</strong>
                      <p>{a?.country}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="footer-dev">
              <button className="footer-dev-btn" onClick={handleSave}>
                Save & Continue
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DeliveryDetails;
