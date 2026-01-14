import React, { useEffect, useState } from "react";
import "./Address.css";
import Pagewrapper from "../../components/common/Pagewrapper";
import Footer from "../../components/common/Footer";
import { validateAddress } from "../../Utills/validateAddress";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/LoadingSlice";
import Error from "../../components/common/Error";

const initialForm = {
  address: "",
  city: "",
  postalcode: "",
  country: "",
};

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { loading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const error = validateAddress(form);
    if (error) {
      alert(error);
      return;
    }
    let response = null;
    if (isEdit) {
      try {
        dispatch(SetLoader(true));
        response = await axios.put(
          `${import.meta.env.VITE_BASEURL}/api/patient/address/${editId}`,
          form,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          handleAddress();
        }
      } catch (error) {
        console.error("Error adding address:", error);
      }
      dispatch(SetLoader(false));
    } else {
      try {
        dispatch(SetLoader(true));
        response = await axios.post(
          `${import.meta.env.VITE_BASEURL}/api/patient/address/`,
          form,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          handleAddress();
        }
      } catch (error) {
        console.error("Error adding address:", error);
      }
      dispatch(SetLoader(false));
    }
    closeModal();
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/patient/address/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        handleAddress();
      }
    } catch (error) {
      console.log("Error deleting address:", error);
    }
  };

  const handleAddress = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/patient/address/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setAddresses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const openAddModal = () => {
    setForm({
      address: "",
      city: "",
      postalcode: 0,
      country: "",
    });
    setIsEdit(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({
      address: "",
      city: "",
      postalcode: "",
      country: "",
    });
    setIsEdit(false);
    setEditId(null);
  };

  const openEditModal = (address) => {
    setForm({
      address: address.address,
      city: address.city,
      postalcode: address.postalcode,
      country: address.country,
    });
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

          {loading ? null : addresses.length >= 1 ? (
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
                    <button
                      className="address-btn"
                      onClick={() => openEditModal(addr)}
                    >
                      Edit
                    </button>
                    <button
                      className="address-btn delete"
                      onClick={() => handleDelete(addr?._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Error message={"No Address Found"} />
          )}

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
                  <button onClick={handleSubmit} disabled={loading}>
                    {loading ? "Saving..." : isEdit ? "Update" : "Add"}
                  </button>
                  <button onClick={() => closeModal()}>Cancel</button>
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
