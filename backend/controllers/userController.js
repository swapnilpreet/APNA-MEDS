// import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import generateToken from "../utills/generateToken.js";

// used
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }
    const userProfileResponse = {
      message: "User profile fetched successfully.",
      data: {
        name: foundUser.name,
        email: foundUser.email,
        contactNumber: foundUser.contactNumber,
        profilePicture: foundUser.profilePicture,
        isAdmin: foundUser.isAdmin,
        myCarts: foundUser.myCarts,
        medicalHistory: foundUser.medicalHistory,
        managePatients: foundUser.managePatients,
        manageAddress: foundUser.manageAddress,
      },
    };
    res.status(200).json(userProfileResponse);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      message: "An error occurred while fetching the user profile.",
      error: error.message,
    });
  }
};

// used
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    // -------- TEXT FIELDS --------
    user.name = req.body.name || user.name;
    // user.email = req.body.email || user.email;
    user.contactNumber = req.body.contactNumber || user.contactNumber;

    // if (req.body.medicalHistory) {
    //   user.medicalHistory = req.body.medicalHistory;
    // }

    // if (req.body.managePatients) {
    //   user.managePatients = req.body.managePatients;
    // }

    // if (req.body.manageAddress) {
    //   user.manageAddress = req.body.manageAddress;
    // }

    // -------- IMAGE UPLOAD --------
    if (req.file) {
      // delete old image
      if (user.profilePicture?.publicId) {
        await cloudinary.uploader.destroy(user.profilePicture.publicId);
      }

      // upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Apna-med-User-profile-pic",
        resource_type: "image",
      });

      user.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMedicalHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: true, message: "User not found." });
    }
    res.status(200).json({
      success: true,
      message: "Medical history fetched successfully.",
      data: user.medicalHistory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const addmedicalhistory = async (req, res) => {
  try {
    const { condition, diagnosisDate, medications, notes, prescriptionUrl } =
      req.body;
    if (
      !condition ||
      !diagnosisDate ||
      !medications ||
      medications.length === 0 ||
      !notes ||
      !prescriptionUrl
    ) {
      return res.status(400).json({
        message:
          "Please provide condition, diagnosis date, medications, and prescription URL.",
      });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: "User not Found" });
    }
    const newMedicalEntry = {
      condition,
      diagnosisDate,
      medications,
      notes: notes || "",
      prescriptionUrl: prescriptionUrl || "",
    };

    user.medicalHistory.push(newMedicalEntry);

    // const updatedUser = await user.save();
    await user.save();
    res.status(201).json({
      success: true,
      message: "Medical history entry added successfully!",
      // data: updatedUser.medicalHistory[updatedUser.medicalHistory.length - 1],
    });
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

const deleteMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { medicalHistory: { _id: id } },
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isDeleted = !user.medicalHistory.some(
      (entry) => entry._id.toString() === id
    );

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Medical history entry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medical history entry deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, diagnosisDate, medications, notes, prescriptionUrl } =
      req.body;

    if (
      !condition ||
      !diagnosisDate ||
      !medications ||
      medications.length === 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Please provide condition, diagnosis date, and at least one medication.",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    const historyEntry = user.medicalHistory.id(id);
    if (!historyEntry) {
      res
        .status(404)
        .json({ success: false, message: "Medical history entry not found" });
    }
    historyEntry.condition = condition;
    historyEntry.diagnosisDate = diagnosisDate;
    historyEntry.medications = medications;
    historyEntry.notes = notes || "";
    historyEntry.prescriptionUrl = prescriptionUrl || "";
    await user.save();
    res.status(200).json({
      success: true,
      message: "Medical history entry updated successfully.",
      data: historyEntry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

// admin checks working
const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }

    res.status(200).json({
      success: true,
      data: users,
      message: "Users fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.deleteOne({ _id: user._id });

    return res
      .status(200)
      .json({ success: true, message: "User removed successfully" });

  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    res.status(500).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ data: false, message: "User not Found" });
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin =
      req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin;

    const updatedUser = await user.save();

    res.status(201).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

// const AddOrUpdateImage=async(req,res)=>{
//   try{
//      const userId=req.user?._id;
//      if(!req.file){
//       return res.status(400).json({message:"No Image uploaded"})
//      }
     
//      const user= await User.findById(userId);

//      if(!user){
//       return res.status(404).json({message:"User not found"})
//      }

//      if(user.profilePicture?.publicId){
//       await cloudinary.uploader.destroy(user.profilePicture.publicId);
//      }

//      const result =await cloudinary.uploader.upload(req.file.path,{
//       folder:"Apna-med-User-profile-pic",
//       resource_type:"image",
//      })

//      user.profilePicture={
//       url:result.secure_url,
//       publicId:result.public_id,
//      }

//      await user.save();

//      res.status(200).json({
//       success:true,
//       message:"Profile image Uploaded Successfully",
//       profilePicture:user.profilePicture.url,
//      })
//   } catch (error) {
//     res.status(500).json({
//       success:false,
//       message:error.message,
//     })
//   }
// }

const toggleCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { medicineId } = req.body;
    if (!medicineId) {
      return res.status(400).json({ message: "Medicine ID is required" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!Array.isArray(user.myCarts)) {
      user.myCarts = [];
    }
    const index = user.myCarts.findIndex((id) => id?.toString() === medicineId);
    if (index > -1) {
      user.myCarts.splice(index, 1);
      await user.save();
      return res.status(200).json({
        message: "Medicine removed from cart",
        myCarts: user.myCarts,
      });
    } else {
      user.myCarts.push(medicineId);
      await user.save();
      res.status(200).json({
        message: "Medicine added to cart",
        myCarts: user.myCarts,
      });
    }
  } catch (error) {
    console.error("toggleCartItem error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const GetmyCartItem = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Not authorized, no user ID found in request." });
    }
    const user = await User.findById(userId).populate("myCarts");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      message: "User cart fetched successfully.",
      data: user.myCarts,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const clearUserCart = async (req, res) => {
  try {
    // not used yet
    const userId = req.user;
    await User.findByIdAndUpdate(userId._id, {
      $set: { myCarts: [] },
    });

    res
      .status(200)
      .json({ success: false, message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ success: true, message: error });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  // AddOrUpdateImage,
  addmedicalhistory,
  toggleCartItem,
  GetmyCartItem,
  clearUserCart,
  deleteMedicalHistory,
  editMedicalHistory,
  getMedicalHistory,
};
