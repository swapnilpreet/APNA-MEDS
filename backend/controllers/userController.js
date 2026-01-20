// import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";

// used
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const foundUser = await User.findById(userId).select("-password");
    if (!foundUser) {
      return res.status(404).json({
        message: "User profile not found.",
      });
    }
    const userProfileResponse = {
      success:true,
      message: "User profile fetched successfully.",
      data: foundUser,
      // data: {
      //   name: foundUser.name,
      //   email: foundUser.email,
      //   contactNumber: foundUser.contactNumber,
      //   profilePicture: foundUser.profilePicture,
      //   isAdmin: foundUser.isAdmin,
      //   myCarts: foundUser.myCarts,
      //   medicalHistory: foundUser.medicalHistory,
      //   managePatients: foundUser.managePatients,
      //   manageAddress: foundUser.manageAddress,
      // },
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
    const { condition, diagnosisDate, medications, notes } = req.body;

    if (
      !condition ||
      !diagnosisDate ||
      !medications ||
      medications.length === 0 ||
      !notes
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide condition, diagnosis date, medications, and notes.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let prescriptionData = null;

    // ✅ If image is sent from frontend
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Apna-med-medical-history",
        resource_type: "image",
      });

      prescriptionData = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    const newMedicalEntry = {
      condition,
      diagnosisDate,
      medications,
      notes,
      prescriptionUrl: prescriptionData, // null if no image
    };

    user.medicalHistory.push(newMedicalEntry);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Medical history entry added successfully!",
      data: newMedicalEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

const deleteMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Find medical history entry
    const historyEntry = user.medicalHistory.find(
      (item) => item._id.toString() === id
    );

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: "Medical history entry not found",
      });
    }

    // 3️⃣ Delete image from Cloudinary
    if (historyEntry.prescriptionUrl?.publicId) {
      await cloudinary.uploader.destroy(
        historyEntry.prescriptionUrl.publicId
      );
    }

    // 4️⃣ Remove medical history using pull
    user.medicalHistory.pull({ _id: id });

    // 5️⃣ Save user
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Medical history entry deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editMedicalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition, diagnosisDate, medications, notes } = req.body;
    if (
      !condition ||
      !diagnosisDate ||
      !medications ||
      medications.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide condition, diagnosis date, and at least one medication.",
      });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const historyEntry = user.medicalHistory.id(id);
    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: "Medical history entry not found",
      });
    }
    // ----------------------------
    // Update text fields
    // ----------------------------
    historyEntry.condition = condition;
    historyEntry.diagnosisDate = diagnosisDate;
    historyEntry.medications = medications;
    historyEntry.notes = notes || "";

    // ----------------------------
    // 🔥 IMAGE REPLACE LOGIC
    // ----------------------------
    if (req.file) {
      // delete old image if exists
      if (historyEntry.prescriptionUrl?.publicId) {
        await cloudinary.uploader.destroy(
          historyEntry.prescriptionUrl.publicId
        );
      }

      // upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "Apna-med-medical-history",
        resource_type: "image",
      });

      historyEntry.prescriptionUrl = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Medical history entry updated successfully.",
      data: historyEntry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
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

    // delete user orders,medical history ,images what eever he uploads everything reviews deletes
  
    await User.deleteOne({ _id: user._id });

    return res
      .status(200)
      .json({ success: true, message: "User removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
    if(!userId){
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const result=await User.aggregate([
      {
        $match:{
          _id:new mongoose.Types.ObjectId(userId),
        },
      },

      // 1️⃣ Lookup medicines
      {
        $lookup:{
          from:"medicines",
          localField:"myCarts",
          foreignField:"_id",
          as:"cartItems",
        },
      },

      { $unwind: "$cartItems" },

      // 2️⃣ Discount %
      {
        $addFields: {
          "cartItems.discountPercentage": 20,
        },
      },

      // 3️⃣ Discount amount
      {
        $addFields: {
          "cartItems.discountAmount": {
            $multiply: [
              "$cartItems.price",
              { $divide: ["$cartItems.discountPercentage", 100] },
            ],
          },
        },
      },

      // 4️⃣ Discounted price
      {
        $addFields: {
          "cartItems.discountedPrice": {
            $subtract: [
              "$cartItems.price",
              "$cartItems.discountAmount",
            ],
          },
        },
      },

      // 5️⃣ Shape response
      {
        $project: {
          _id: 0,
          cartItems: {
            _id: "$cartItems._id",
            name: "$cartItems.name",
            brand: "$cartItems.brand",
            category: "$cartItems.category",
            image: "$cartItems.image",
            countInStock: "$cartItems.countInStock",
            price: "$cartItems.price",
            discountedPrice: {
              $round: ["$cartItems.discountedPrice", 0],
            },
            discountAmount: {
              $round: ["$cartItems.discountAmount", 0],
            },
            discountPercentage: "$cartItems.discountPercentage",
          },
        },
      },
    ]);

    const cartItems = result.map((item) => item.cartItems);
    res.status(200).json({
      success: true,
      message: "User cart fetched successfully",
      data: cartItems,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearUserCart = async (req, res) => {
  try {
    const userId = req.user;
    await User.findByIdAndUpdate(userId._id, {
      $set: { myCarts: [] },
    });

    res
      .status(200)
      .json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addmedicalhistory,
  toggleCartItem,
  GetmyCartItem,
  clearUserCart,
  deleteMedicalHistory,
  editMedicalHistory,
  getMedicalHistory,
};
