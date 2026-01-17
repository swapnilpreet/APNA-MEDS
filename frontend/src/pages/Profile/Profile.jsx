import { useEffect, useState } from "react";
import { SetLoader, SetShowModel } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/common/Footer";
import Pagewrapper from "../../components/common/Pagewrapper";
import "./Profile.css";
import MedicineLoader from "../../components/common/MedicineLoader";
import MedicalHistoryModal from "../../components/common/MedicalHistoryModal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import OnlineStatus from "../../components/common/OnlineStatus";
import useOnlineStatus from "../../Utills/useOnlineStatus";

const Profile = () => {
  const isOnline = useOnlineStatus();
  const [user, setUser] = useState({});
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showpasswordModal, setshowpasswordmodal] = useState(false);
  const [editUser, setEditUser] = useState({});
  const showModal = useSelector((state) => state.loaders.showmodel);
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [newCondition, setNewCondition] = useState({
    condition: "",
    diagnosisDate: "",
    medications: "",
    notes: "",
    prescriptionUrl: "",
  });

  const [changePassowrd, setchangePassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const { loading } = useSelector((state) => state.loaders);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editConditionId, setEditConditionId] = useState(null);
  const dispatch = useDispatch();

  const getcurrentUser = async () => {
    try {
      dispatch(SetLoader(true))
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASEURL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        setUser(data.data);
        setEditUser(data.data);
        setMedicalHistory(data.data.medicalHistory || []);
      } else {
        throw new Error("Failed to fetch user data At Profile page");
      }
    } catch (err) {
      console.error(err);
    }finally{
      dispatch(SetLoader(false))
    }

  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // dispatch(SetLoader(true));

    try {
      const formData = new FormData();
      formData.append("name", editUser.name);
      formData.append("contactNumber", editUser.contactNumber);
      if (selectedProfileFile) {
        formData.append("image", selectedProfileFile);
      }
      await axios.put(
        `${import.meta.env.VITE_BASEURL}/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      resetUserModel();
      getcurrentUser();
    } catch (error) {
      console.error("Update failed:", error);
    } 
    // finally {
    //   dispatch(SetLoader(false));
    // }
  };

  const handleEditCondition = (item) => {
    setNewCondition({
      condition: item.condition,
      diagnosisDate: item.diagnosisDate?.slice(0, 10),
      medications: item.medications,
      notes: item.notes,
      prescriptionUrl: item.prescriptionUrl || "",
    });
    setEditConditionId(item._id);
    setIsEditingMedical(true);
    dispatch(SetShowModel(true));
  };

  const handleDeleteCondition = async (id) => {
    try {
      // dispatch(SetLoader(true));
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BASEURL}/api/users/medical-history/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (data.success) {
        getcurrentUser();
      }
    } catch (error) {
      console.error(error);
    }
    //  finally {
    //   dispatch(SetLoader(false));
    // }
  };

  const handlepasswordchange=async()=>{
    event.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BASEURL}/api/auth/password`,
        changePassowrd,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("response", response);
      if (response.data.success) {
        resetpasswordmodal();
        handleLogout();
      }
      toast(response.data.message || response.response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const resetMedicalForm = () => {
    dispatch(SetShowModel(false));
    setEditConditionId(null);
    setIsEditingMedical(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const resetUserModel = () => {
    setShowUserModal(false);
    setSelectedProfileFile(null);
    setPreviewImage("");
  };

  const resetpasswordmodal = () => {
    setshowpasswordmodal(false);
    setchangePassword({
      oldPassword: "",
      newPassword: "",
    });
  };

  useEffect(() => {
    getcurrentUser();
  }, []);

  return (
    <>
      {loading ? (
        <MedicineLoader />
      ) : (
        <>
          <ToastContainer position="top-right" autoClose={3000} />
          <Pagewrapper>
            <div className="page-layout">
              <div className="profile-container">
                <h2>User Profile</h2>

                {/* --- PROFILE INFORMATION --- */}
                <div className="profile-info">
                  <img
                    src={
                      user?.profilePicture?.url
                        ? user?.profilePicture?.url
                        : "https://loremipsum.imgix.net/gPyHKDGI0md4NkRDjs4k8/36be1e73008a0181c1980f727f29d002/avatar-placeholder-generator-500x500.jpg?w=1280&q=60&auto=format,compress"
                    }
                    alt="Profile"
                    className="profile-img"
                    style={{
                      border: `3px dashed ${isOnline ? "green" : "red"}`,
                    }}
                  />

                  <OnlineStatus />

                  <p>
                    <strong>Name:</strong> {user?.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                  <p>
                    <strong>Contact:</strong> {user?.contactNumber || "N/A"}
                  </p>
                </div>

                {/* --- MEDICAL HISTORY LIST --- */}
                {medicalHistory.length > 0 ? (
                  <div className="history-list">
                    <h3>Medical History</h3>
                    {medicalHistory.map((item) => (
                      <div key={item._id} className="history-inside-dev">
                        <div>
                          {item.prescriptionUrl && (
                            <img
                              src={
                                item.prescriptionUrl.url
                                  ? item.prescriptionUrl.url
                                  : item.prescriptionUrl
                              }
                              alt="prescription"
                              className="prescription-img-large"
                            />
                          )}
                        </div>

                        <div className="history-content">
                          <strong>Condition: </strong> {item.condition}{" "}
                          <strong>{item.diagnosisDate?.slice(0, 10)}</strong>
                          <br />
                          <strong>Medications: </strong>
                          {item.medications.map((med, index) => (
                            <span key={index}>
                              {med}
                              {index < item.medications.length - 1 ? ", " : ""}
                            </span>
                          ))}
                          <br />
                          <strong>Notes:</strong> {item.notes}
                          <br />
                          <button
                            className="edit-btn-profile"
                            onClick={() => handleEditCondition(item)}
                          >
                            Edit
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => handleDeleteCondition(item._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: "gray" }}>No medical history available.</p>
                )}

                {/* BUTTON GROUP */}
                <div className="btn-group">
                  <button
                    className="add-btn"
                    onClick={() => setshowpasswordmodal(true)}
                  >
                    Change Password
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => setShowUserModal(true)}
                  >
                    Edit User Info
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => dispatch(SetShowModel(true))}
                  >
                    Add Medical History
                  </button>
                </div>
              </div>
            </div>
          </Pagewrapper>

          {/* --- EDIT USER MODAL --- */}
          {showUserModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Edit User Info</h2>
                <form onSubmit={handleUpdateProfile}>
                  <input
                    type="text"
                    value={editUser?.name || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, name: e.target.value })
                    }
                    placeholder="Name"
                  />

                  <input
                    type="email"
                    value={editUser?.email || ""}
                    placeholder="Email"
                    readOnly
                  />

                  <input
                    type="number"
                    value={editUser?.contactNumber || ""}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="Contact Number"
                  />

                  <label htmlFor="profileUpload" className="upload-label">
                    Upload Profile Picture
                  </label>

                  <input
                    id="profileUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setSelectedProfileFile(file);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />

                  {/* IMAGE PREVIEW */}
                  {previewImage && (
                    <div className="profile-preview">
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        style={{ height: "250px", width: "250px" }}
                      />
                    </div>
                  )}

                  {/* {loading && <MedicineLoader />} */}

                  <button className="model-btn-submit" type="submit">
                    Save Changes
                  </button>

                  <button
                    className="model-btn-cancel"
                    type="button"
                    onClick={() => resetUserModel()}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* --- MEDICAL MODAL --- */}
          <MedicalHistoryModal
            isOpen={showModal}
            onClose={resetMedicalForm}
            onSuccess={getcurrentUser}
            initialData={
              isEditingMedical
                ? { ...newCondition, _id: editConditionId }
                : null
            }
          />

          {showpasswordModal && (
            <div className="modal-overlay">
              <div className="modal">
                <form onSubmit={handlepasswordchange}>
                  <label htmlFor="oldpassword">Old Password</label>
                  <input
                    name="oldpassword"
                    type="text"
                    value={changePassowrd.oldPassword}
                    onChange={(e) =>
                      setchangePassword({
                        ...changePassowrd,
                        oldPassword: e.target.value,
                      })
                    }
                    placeholder="Enter old password"
                    required
                  />
                  <label htmlFor="NewPassword">New Password</label>
                  <input
                    name="NewPassword"
                    type="text"
                    value={changePassowrd.newPassword}
                    onChange={(e) =>
                      setchangePassword({
                        ...changePassowrd,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password"
                    required
                  />
                  <button type="submit" className="model-btn-submit">
                    submit
                  </button>
                  <button
                    type="button"
                    className="model-btn-cancel"
                    onClick={() => resetpasswordmodal()}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}

          <Footer />
        </>
      )}
    </>
  );
};

export default Profile;
