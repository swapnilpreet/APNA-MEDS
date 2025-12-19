import asyncHandler from "express-async-handler";
import MedicineModel from "../models/Medicine.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
//user
const getMedicine = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const category = req.query.category
    ? {
        category: req.query.category,
      }
    : {};

  const brand = req.query.brand
    ? {
        brand: req.query.brand,
      }
    : {};

  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;

  const filters = {
    ...keyword,
    ...category,
    ...brand,
    price: { $gte: minPrice, $lte: maxPrice },
  };

  const count = await MedicineModel.countDocuments(filters);

  const Medicines = await MedicineModel.find(filters)
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const allMedicines = await MedicineModel.find({}, "brand");
  const brandSet = new Set(allMedicines.map((med) => med.brand));
  const brandList = Array.from(brandSet);

  res.json({
    Medicines,
    page,
    pages: Math.ceil(count / pageSize),
    count,
    brandList,
  });
});

const getMedicineById = asyncHandler(async (req, res) => {
  const Medicine = await MedicineModel.findById(req.params.id);
  if (Medicine) {
    res.json(Medicine);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//admin
const createMedicine = asyncHandler(async (req, res) => {
  try {
    let { name, brand, category, description, price, countInStock } =
      req.body;
    let userId = req.user._id;
    let imageData = {};

    if (req.file) {
      let response = await cloudinary.uploader.upload(req.file.path, {
       folder: "medicines",
        resource_type: "image",
      });

      imageData = {
        url: response.secure_url,
        publicId: response.public_id,
      };
    }

    let Medicine = new MedicineModel({
      name: name,
      price: price,
      user: userId,
      image: imageData,
      brand: brand,
      category: category,
      countInStock: countInStock,
      description: description,
    });
    let createdMedicine = await Medicine.save();
    res.status(201).json({ data: createdMedicine, message: "success" });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
});

//admin
const updateMedicine = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } =
    req.body;

  const Medicine = await MedicineModel.findById(req.params.id);

  if (Medicine) {
    Medicine.name = name || Medicine.name;
    Medicine.price = price || Medicine.price;
    Medicine.description = description || Medicine.description;
    // Medicine.image = image || Medicine.image;
    Medicine.brand = brand || Medicine.brand;
    Medicine.category = category || Medicine.category;
    Medicine.countInStock =
      countInStock !== undefined ? countInStock : Medicine.countInStock;

    if (req.file) {
      if (Medicine.image?.publicId) {
        await cloudinary.uploader.destroy(Medicine.image.publicId);
      }
      const response = await cloudinary.uploader.upload(req.file.path, {
        folder: "medicines",
        resource_type: "image",
      });

      Medicine.image = {
        url: response.secure_url,
        publicId: response.public_id,
      };
    }
    const updatedMedicine = await Medicine.save();
    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: updatedMedicine,
    });
  } else {
    res.status(404);
    throw new Error("Medicine not found");
  }
});

//admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await MedicineModel.findById(req.params.id);

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  // 🔹 Check if medicine exists in any user's cart
  const inCart = await User.findOne({ myCarts: medicine._id });
  if (inCart) {
    return res.status(400).json({
      message: "Cannot delete medicine. It is present in some user's cart.",
    });
  }

  // 🔹 Check if medicine exists in any order
  const inOrder = await Order.findOne({ "orderItems.Medicine": medicine._id });
  if (inOrder) {
    return res.status(400).json({
      message: "Cannot delete medicine. It is part of an order.",
    });
  }

  
  if(medicine.image?.publicId){
    await cloudinary.uploader.destroy(medicine.image.publicId);
  }

  // ✅ Safe to delete
  await MedicineModel.deleteOne({ _id: medicine._id });
  res.json({ message: "Medicine removed successfully" });
});

//user
const createMedicineReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const Medicine = await MedicineModel.findById(req.params.id);

  if (Medicine) {
    const alreadyReviewed = Medicine.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Medicine already reviewed");
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    Medicine.reviews.push(review);
    Medicine.numReviews = Medicine.reviews.length;
    Medicine.rating =
      Medicine.reviews.reduce((acc, item) => item.rating + acc, 0) /
      Medicine.reviews.length;

    await Medicine.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json({ message: "Medicine not found" });
    throw new Error("Medicine not found");
  }
});

export {
  getMedicine,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  createMedicineReview,
};
