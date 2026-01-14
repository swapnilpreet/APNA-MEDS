import asyncHandler from "express-async-handler";
import MedicineModel from "../models/Medicine.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import mongoose from "mongoose";

const getMedicine = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  // 🔍 Filters
  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice
    ? Number(req.query.maxPrice)
    : Number.MAX_SAFE_INTEGER;

  const matchStage = {
    ...keyword,
    ...category,
    ...brand,
    price: { $gte: minPrice, $lte: maxPrice },
  };

  // ==============================
  // 🔥 MEDICINES (FILTER + PAGINATION)
  // ==============================
  const result = await MedicineModel.aggregate([
    { $match: matchStage },

    // 🔥 Discount %
    {
      $addFields: {
        discountPercentage: 20,
      },
    },

    // 🔥 Discount Amount
    {
      $addFields: {
        discountAmount: {
          $multiply: ["$price", { $divide: ["$discountPercentage", 100] }],
        },
      },
    },

    // 🔥 Final Price
    {
      $addFields: {
        discountedPrice: {
          $subtract: ["$price", "$discountAmount"],
        },
      },
    },

    {
      $facet: {
        paginatedData: [
          { $sort: { createdAt: -1 } },
          { $skip: pageSize * (page - 1) },
          { $limit: pageSize },
          {
            $project: {
              name: 1,
              brand: 1,
              category: 1,
              description: 1,
              image: 1,
              rating: 1,
              numReviews: 1,
              countInStock: 1,
              price: 1,
              createdAt: 1,
              discountedPrice: { $round: ["$discountedPrice", 0] },
              discountAmount: { $round: ["$discountAmount", 0] },
              discountPercentage: 1,
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  // ==============================
  // 🔥 ALL BRANDS (INDEPENDENT)
  // ==============================
  const brands = await MedicineModel.distinct("brand");

  // ==============================
  // 🔥 RESPONSE
  // ==============================
  const Medicines = result[0].paginatedData;
  const count = result[0].totalCount[0]?.count || 0;

  res.status(200).json({
    success:true,
    Medicines,
    page,
    pages: Math.ceil(count / pageSize),
    count,
    brandList: brands,
  });
});

export default getMedicine;

const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await MedicineModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
      },
    },

    // Populate review users
    {
      $lookup: {
        from: "users", // collection name in MongoDB
        localField: "reviews.user",
        foreignField: "_id",
        as: "reviewUsers",
      },
    },

    // Attach user to each review
    {
      $addFields: {
        reviews: {
          $map: {
            input: "$reviews",
            as: "review",
            in: {
              $mergeObjects: [
                "$$review",
                {
                  user: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$reviewUsers",
                          as: "u",
                          cond: {
                            $eq: ["$$u._id", "$$review.user"],
                          },
                        },
                      },
                      0,
                    ],
                  },
                },
              ],
            },
          },
        },
      },
    },

    // Discount calculation
    {
      $addFields: {
        discountPercentage: 20,
        discountAmount: { $multiply: ["$price", 0.2] },
        discountedPrice: {
          $subtract: ["$price", { $multiply: ["$price", 0.2] }],
        },
      },
    },

    // Clean response
    {
      $project: {
        name: 1,
        brand: 1,
        category: 1,
        description: 1,
        image: 1,
        rating: 1,
        numReviews: 1,
        countInStock: 1,
        price: 1,

        reviews: {
          _id: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            _id: 1,
            name: 1,
            email: 1,
            profilePicture: 1,
          },
        },

        discountedPrice: { $round: ["$discountedPrice", 0] },
        discountAmount: { $round: ["$discountAmount", 0] },
        discountPercentage: 1,
      },
    },
  ]);

  if (!medicine.length) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  res.status(200).json({
    success: true,
    medicine: medicine, // 👈 important
  });
});

//admin
const createMedicine = asyncHandler(async (req, res) => {
  try {
    let { name, brand, category, description, price, countInStock } = req.body;
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
    res.status(201).json({
      success: true,
      data: createdMedicine,
      message: "Medicine Add Successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

//admin
const updateMedicine = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock } = req.body;

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

  if (medicine.image?.publicId) {
    await cloudinary.uploader.destroy(medicine.image.publicId);
  }

  // ✅ Safe to delete
  await MedicineModel.deleteOne({ _id: medicine._id });
  res.json({ success: true, message: "Medicine removed successfully" });
});

//user
const createMedicineReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const Medicine = await MedicineModel.findById(req.params.id);

  if (!Medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  const review = {
    rating: Number(rating),
    comment,
    user: req.user,
  };

  Medicine.reviews.push(review);
  Medicine.numReviews = Medicine.reviews.length;
  Medicine.rating =
    Medicine.reviews.reduce((acc, item) => acc + item.rating, 0) /
    Medicine.reviews.length;

  await Medicine.save();

  // 🔥 REAL-TIME EMIT
  // io.emit("medicine-review-added", {
  //   medicineId: Medicine._id.toString(),
  //   review,
  // });

  res.status(201).json({ message: "Review added" });
});

const getMedicineReviews = asyncHandler(async (req, res) => {
  const medicine = await MedicineModel.findById(req.params.id).populate(
    "reviews.user",
    "name email profilePicture"
  );

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  res.status(200).json({
    success: true,
    numReviews: medicine.numReviews,
    averageRating: medicine.rating,
    reviews: medicine.reviews,
  });
});

const editMedicineReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const medicine = await MedicineModel.findById(req.params.id).populate(
    "reviews.user",
    "name email profilePicture"
  );

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  // Find review
  const review = medicine.reviews.find(
    (r) => r._id.toString() === req.params.reviewId
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Ownership check
  if (review.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to edit this review");
  }

  // Update fields
  review.rating = Number(rating);
  review.comment = comment;

  // Recalculate average rating
  medicine.rating =
    medicine.reviews.reduce((acc, item) => acc + item.rating, 0) /
    medicine.reviews.length;

  await medicine.save();

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
  });
});

const deleteMedicineReview = asyncHandler(async (req, res) => {
  const medicine = await MedicineModel.findById(req.params.id).populate(
    "reviews.user",
    "name email profilePicture"
  );

  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  // Find review
  const review = medicine.reviews.find(
    (r) => r._id.toString() === req.params.reviewId
  );

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  // Ownership check
  if (review.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  // Remove review
  medicine.reviews = medicine.reviews.filter(
    (r) => r._id.toString() !== req.params.reviewId
  );

  // Recalculate average rating
  const avgRating =
    medicine.reviews.length === 0
      ? 0
      : medicine.reviews.reduce((acc, item) => acc + item.rating, 0) /
        medicine.reviews.length;

  medicine.rating = avgRating;
  medicine.numReviews = medicine.reviews.length;

  await medicine.save();

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

export {
  getMedicine,
  getMedicineById,
  createMedicine,
  updateMedicine,
  deleteMedicine,
  createMedicineReview,
  getMedicineReviews,
  editMedicineReview,
  deleteMedicineReview,
};
