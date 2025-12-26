import { useEffect, useState } from "react";
import {
  DeleteMedicalHistory,
  GetCurrentUser,
  UpdateUserProfile,
} from "../../Apicalls/user";
import { SetLoader } from "../../redux/LoadingSlice";
import { useDispatch, useSelector } from "react-redux";
import Footer from "../../components/common/Footer";
import Pagewrapper from "../../components/common/Pagewrapper";
import "./Profile.css";
import MedicineLoader from "../../components/common/MedicineLoader";
import MedicalHistoryModal from "../../components/common/MedicalHistoryModal";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({});
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [editUser, setEditUser] = useState({});

  // NEW STATES FOR PREVIEW + ACTUAL FILE
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  const [newCondition, setNewCondition] = useState({
    condition: "",
    diagnosisDate: "",
    medications: "",
    notes: "",
    prescriptionUrl: "",
  });

  const { loading } = useSelector((state) => state.loaders);
  const [isEditingMedical, setIsEditingMedical] = useState(false);
  const [editConditionId, setEditConditionId] = useState(null);
  const dispatch = useDispatch();

  const getcurrentUser = async () => {
    try {
      const response = await GetCurrentUser();
      if (response?.data) {
        setUser(response.data);
        setEditUser(response.data);
        setMedicalHistory(response.data.medicalHistory || []);
      } else {
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    getcurrentUser();
  }, []);

  // Save profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    dispatch(SetLoader(true));

    try {
      const formData = new FormData();

      formData.append("name", editUser.name);
      formData.append("contactNumber", editUser.contactNumber);

      // image only if selected
      if (selectedProfileFile) {
        formData.append("image", selectedProfileFile);
      }

      await axios.put("http://localhost:3000/api/users/profile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      getcurrentUser();
      setShowUserModal(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      dispatch(SetLoader(false));
    }
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
    setShowMedicalModal(true);
  };

  const handleDeleteCondition = async (id) => {
    try {
      dispatch(SetLoader(true));
      await DeleteMedicalHistory(id);
      getcurrentUser();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const resetMedicalForm = () => {
    setNewCondition({
      condition: "",
      diagnosisDate: "",
      medications: "",
      notes: "",
      prescriptionUrl: "",
    });
    setIsEditingMedical(false);
    setEditConditionId(null);
    setShowMedicalModal(false);
  };
  // console.log(user?.profilePicture);
  return (
    <>
      <ToastContainer />
      <Pagewrapper>
        <div className="page-layout">
          <div className="profile-container">
            <h2>User Profile</h2>

            {/* --- PROFILE INFORMATION --- */}
            <div className="profile-info">
              <img
                src={user?.profilePicture?.url}
                alt="Profile"
                className="profile-img"
              />

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
            <h3>Medical History</h3>
            <div className="history-list">
              {medicalHistory.map((item) => (
                <div key={item._id} className="history-inside-dev">
                  <div>
                    {item.prescriptionUrl && (
                      <img
                        src={item.prescriptionUrl}
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

            {/* BUTTON GROUP */}
            <div className="btn-group">
              <button
                className="add-btn"
                onClick={() => setShowUserModal(true)}
              >
                Edit User Info
              </button>
              <button
                className="add-btn"
                onClick={() => setShowMedicalModal(true)}
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
                  setEditUser({ ...editUser, contactNumber: e.target.value })
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
                    style={{height:"250px",width:"250px"}}
                  />
                </div>
              )}

              {loading && <MedicineLoader />}

              <button className="model-btn-submit" type="submit">
                Save Changes
              </button>

              <button
                className="model-btn-cancel"
                type="button"
                onClick={() => setShowUserModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MEDICAL MODAL --- */}
      <MedicalHistoryModal
        isOpen={showMedicalModal}
        onClose={resetMedicalForm}
        onSuccess={getcurrentUser}
        initialData={
          isEditingMedical ? { ...newCondition, _id: editConditionId } : null
        }
        toast={toast}
      />

      <Footer />
    </>
  );
};

export default Profile;
