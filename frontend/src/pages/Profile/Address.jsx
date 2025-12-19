import React, { useEffect, useState } from "react";
import "./Address.css";
import {
  AddAddress,
  DeleteAddress,
  GetAllAddresses,
  UpdateAddress,
} from "../../Apicalls/petient";
import Pagewrapper from "../../components/common/Pagewrapper";
import Footer from "../../components/common/Footer";
import { validateAddress } from "../../Utills/validateAddress";

const Address = () => {
  const [addresses, setAddresses] = useState([]);

  console.log("Address component rendered", addresses);
  const [form, setForm] = useState({
    address: "",
    city: "",
    postalcode: 442200,
    country: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const openAddModal = () => {
    setForm({
      address: "",
      city: "",
      postalcode: 442200,
      country: "",
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEditModal = (address) => {
    setForm({ ...address });
    setEditId(address._id);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const error = validateAddress(form);
    if (error) {
      alert(error);
      return;
    }
    if (isEdit) {
      try {
        const response = await UpdateAddress(editId, form);
        if (response) {
          handleAddress();
        }
      } catch (error) {
        console.error("Error adding address:", error);
      }
    } else {
      try {
        const response = await AddAddress(form);
        if (response) {
          handleAddress();
        }
      } catch (error) {
        console.error("Error adding address:", error);
      }
    }

    setModalOpen(false);
    setForm({
      name: "",
      phone: "",
      pincode: "",
      city: "",
      state: "",
      line1: "",
      line2: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await DeleteAddress(id);
      if (response) {
        console.log("Address deleted successfully:", response);
        handleAddress();
      }
    } catch (error) {
      console.log("Error deleting address:", error);
    }
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleAddress = async () => {
    try {
      const response = await GetAllAddresses();
      if (response) {
        console.log("Fetched addresses successfully:", response);
        setAddresses(response.data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  useEffect(() => {
    handleAddress();
  }, []);

  return (
    <>
      <Pagewrapper>
        <div className="address-container">
          <h1>Your Addresses</h1>
          <button className="add-btn" onClick={openAddModal}>
            Add Address
          </button>

          <div className="address-list">
            {addresses?.map((addr) => (
              <div className="address-card" key={addr?._id}>
                <div className="address-box">
                  <h3>{addr?.address}</h3>
                  <p>{addr?.city},</p>
                  <br />
                  <p>
                    {addr?.country} - {addr?.postalcode}
                  </p>
                </div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(addr)}>Edit</button>
                  <button onClick={() => handleDelete(addr?._id)}>
                  Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {modalOpen && (
            <div className="modal-backdrop">
              <div className="modal-content">
                <h2>{isEdit ? "Edit Address" : "Add Address"}</h2>

                <input
                  type="text"
                  name="address"
                  placeholder="Address (e.g., 123 Main St)"
                  value={form.address}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="city"
                  placeholder="City (e.g., Bangalore)"
                  value={form.city}
                  onChange={handleChange}
                  required
                />
                <input
                  type="number"
                  name="postalcode"
                  placeholder="PostalCode (e.g., 560001)"
                  value={form.postalcode}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="country"
                  placeholder="Country (e.g., India)"
                  value={form.country}
                  onChange={handleChange}
                  required
                />
                <div className="modal-actions">
                  <button onClick={handleSubmit}>
                    {isEdit ? "Update" : "Add"}
                  </button>
                  <button onClick={() => setModalOpen(false)}>Cancel</button>
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

export default Address;
