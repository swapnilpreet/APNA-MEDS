// import { useEffect, useState } from "react";
// import {
//   DeleteMedicalHistory,
//   GetCurrentUser,
//   UpdateUserProfile,
// } from "../../Apicalls/user";
// import { SetLoader } from "../../redux/LoadingSlice";
// import { useDispatch, useSelector } from "react-redux";
// import Footer from "../../components/common/Footer";
// import Pagewrapper from "../../components/common/Pagewrapper";
// import { uploadImageToCloudinary } from "../../Utills/UploadImage";
// import "./Profile.css";
// import MedicineLoader from "../../components/common/MedicineLoader";
// import MedicalHistoryModal from "../../components/common/MedicalHistoryModal";
// import { toast, ToastContainer } from "react-toastify";

// const Profile = () => {
//   const [user, setUser] = useState({});
//   const [medicalHistory, setMedicalHistory] = useState([]);
//   const [showUserModal, setShowUserModal] = useState(false);
//   const [showMedicalModal, setShowMedicalModal] = useState(false);
//   const [editUser, setEditUser] = useState({});
//   const [newCondition, setNewCondition] = useState({
//     condition: "",
//     diagnosisDate: "",
//     medications: "",
//     notes: "",
//     prescriptionUrl: "",
//   });
//   const { loading } = useSelector((state) => state.loaders);
//   const [isEditingMedical, setIsEditingMedical] = useState(false);
//   const [editConditionId, setEditConditionId] = useState(null);
//   const dispatch = useDispatch();

//   const getcurrentUser = async () => {
//     try {
//       const response = await GetCurrentUser();
//       console.log("response",response)
//       if (response?.data) {
//         setUser(response.data);
//         setEditUser(response.data);
//         setMedicalHistory(response.data.medicalHistory || []);
//       } else {
//         localStorage.removeItem("token");
//       }
//     } catch (err) {
//       console.error(err);
//       localStorage.removeItem("token");
//     }
//   };

//   useEffect(() => {
//     getcurrentUser();
//   }, []);

//   const handleUpdateProfile = async (e) => {
//     e.preventDefault();
//     try {
//       dispatch(SetLoader(true));
//       const response = await UpdateUserProfile(editUser);
//       if (response) {
//         setUser(response);
//         toast.success("Profile updated!");
//         getcurrentUser();
//         setShowUserModal(false);
//       }
//     } catch (error) {
//       console.error("Update failed:", error);
//     } finally {
//       dispatch(SetLoader(false));
//     }
//   };

//   const handleEditCondition = (item) => {
//     setNewCondition({
//       condition: item.condition,
//       diagnosisDate: item.diagnosisDate?.slice(0, 10),
//       medications: item.medications,
//       notes: item.notes,
//       prescriptionUrl: item.prescriptionUrl || "",
//     });
//     setEditConditionId(item._id);
//     setIsEditingMedical(true);
//     setShowMedicalModal(true);
//   };

//   const handleDeleteCondition = async (id) => {
//     try {
//       dispatch(SetLoader(true));
//       await DeleteMedicalHistory(id);
//       getcurrentUser();
//     } catch(error){
//       console.error(error);
//     } finally {
//       dispatch(SetLoader(false));
//     }
//   };

//   const resetMedicalForm = () => {
//     setNewCondition({
//       condition: "",
//       diagnosisDate: "",
//       medications: "",
//       notes: "",
//       prescriptionUrl: "",
//     });
//     setIsEditingMedical(false);
//     setEditConditionId(null);
//     setShowMedicalModal(false);
//   };

//   // console.log("medicalHistory", medicalHistory);

//   return (
//     <>
//       <ToastContainer />
//       <Pagewrapper>
//         <div className="page-layout">
//           <div className="profile-container">
//             <h2>User Profile</h2>
//             <div className="profile-info">
//               <img
//                 src={
//                   user?.profilePicture
//                     ? user?.profilePicture
//                     : "https://loremipsum.imgix.net/gPyHKDGI0md4NkRDjs4k8/36be1e73008a0181c1980f727f29d002/avatar-placeholder-generator-500x500.jpg?w=1280&q=60&auto=format,compress"
//                 }
//                 alt="Profile"
//                 className="profile-img"
//               />
//               <p>
//                 <strong>Name:</strong> {user?.name}
//               </p>
//               <p>
//                 <strong>Email:</strong> {user?.email}
//               </p>
//               <p>
//                 <strong>Contact:</strong> {user?.contactNumber || "N/A"}
//               </p>
//             </div>

//             <h3>Medical History</h3>

//             <div className="history-list">
//               {medicalHistory.map((item) => (
//                 <div key={item._id} className="history-inside-dev">
//                   <div>
//                     {item.prescriptionUrl && (
//                       <img
//                         src={item.prescriptionUrl}
//                         alt="prescription"
//                         className="prescription-img-large"
//                       />
//                     )}
//                   </div>
//                   <div className="history-content">
//                     <strong>condition: </strong> {item.condition}{" "}
//                     <strong>{item.diagnosisDate?.slice(0, 10)}</strong>
//                     <br />
//                     <strong>Medications</strong>{" "}
//                     {item.medications.map((med, index) => (
//                       <span key={index}>
//                         {med}
//                         {index < item.medications.length - 1 ? ", " : ""}
//                       </span>
//                     ))}
//                     <br />
//                     <strong>Notes:</strong> {item.notes}
//                     <br />
//                     <button
//                       className="edit-btn-profile"
//                       onClick={() => handleEditCondition(item)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDeleteCondition(item._id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="btn-group">
//               <button
//                 className="add-btn"
//                 onClick={() => setShowUserModal(true)}
//               >
//                 Edit User Info
//               </button>
//               <button
//                 className="add-btn"
//                 onClick={() => setShowMedicalModal(true)}
//               >
//                 Add Medical History
//               </button>
//             </div>
//           </div>
//         </div>
//       </Pagewrapper>
//       {showUserModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h2>Edit User Info</h2>
//             <form onSubmit={handleUpdateProfile}>
//               <input
//                 type="text"
//                 value={editUser?.name || ""}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, name: e.target.value })
//                 }
//                 placeholder="Name"
//               />
//               <input
//                 type="email"
//                 value={editUser?.email || ""}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, email: e.target.value })
//                 }
//                 placeholder="Email"
//               />
//               <input
//                 type="number"
//                 value={editUser?.contactNumber || ""}
//                 onChange={(e) =>
//                   setEditUser({ ...editUser, contactNumber: e.target.value })
//                 }
//                 placeholder="Contact Number"
//               />
//               <label htmlFor="profileUpload" className="upload-label">
//                 Upload Profile Picture
//               </label>
//               <input
//                 id="profileUpload"
//                 type="file"
//                 accept="image/*"
//                 style={{ display: "none" }}
//                 onChange={async (e) => {
//                   const file = e.target.files[0];
//                   if (file) {
//                     dispatch(SetLoader(true));
//                     const url = await uploadImageToCloudinary(file);
//                     if (url) {
//                       setEditUser({ ...editUser, profilePicture: url });
//                       dispatch(SetLoader(false));
//                     }
//                   }
//                 }}
//               />
//               {loading && <MedicineLoader />}
//               <button className="model-btn-submit" type="submit">
//                 Save Changes
//               </button>
//               <button
//                 className="model-btn-cancel"
//                 type="button"
//                 onClick={() => setShowUserModal(false)}
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       <MedicalHistoryModal
//         isOpen={showMedicalModal}
//         onClose={resetMedicalForm}
//         onSuccess={getcurrentUser}
//         initialData={
//           isEditingMedical ? { ...newCondition, _id: editConditionId } : null
//         }
//         toast={toast}
//       />
//       <Footer />
//     </>
//   );
// };

// export default Profile;

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
import { uploadImageToCloudinary } from "../../Utills/UploadImage";
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

    try {
      // dispatch(SetLoader(true));

      // let updatedProfile = { ...editUser };

      // // Upload only when clicking "Save Changes"
      // if (selectedProfileFile) {
      //   const url = await uploadImageToCloudinary(selectedProfileFile);
      //   if (url) {
      //     updatedProfile.profilePicture = url;
      //   }
      // }

      // const response = await UpdateUserProfile(updatedProfile);

      // if (response) {
      //   toast.success("Profile updated!");
      //   getcurrentUser();
      //   setShowUserModal(false);

      //   // Reset states
      //   setSelectedProfileFile(null);
      //   setPreviewImage("");
      // }
      // ..........
      const formdata = new FormData();
      formdata.append("image", selectedProfileFile);

      await axios.put(
        `http://localhost:3000/api/users/profile-picture`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      alert("profile picture updated successfully");
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
  console.log(user?.profilePicture);
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
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
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
                    setPreviewImage(URL.createObjectURL(file)); // PREVIEW ONLY
                  }
                }}
              />

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
