import asyncHandler from 'express-async-handler';
// import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import MedicineModel from '../models/Medicine.js';

 
const getPersonalizedRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const userOrders = await Order.find({ user: userId }).select('orderItems.product');
  const purchasedProductIds = userOrders.flatMap(order => order.orderItems.map(item => item.product));

  const recommendedProducts = [];
  if (purchasedProductIds.length > 0) {
    const purchasedProducts = await MedicineModel.find({ _id: { $in: purchasedProductIds } });
    const categories = [...new Set(purchasedProducts.map(p => p.category))];
    const brands = [...new Set(purchasedProducts.map(p => p.brand))];
    const similarProducts = await MedicineModel.find({
      $or: [{ category: { $in: categories } }, { brand: { $in: brands } }],
      _id: { $nin: purchasedProductIds },
    }).limit(5);
    recommendedProducts.push(...similarProducts);
  }

  if (recommendedProducts.length < 5) {
    const popularProducts = await MedicineModel.find({}).sort({ numReviews: -1 }).limit(5 - recommendedProducts.length);
    recommendedProducts.push(...popularProducts);
  }

  const uniqueRecommendations = Array.from(new Set(recommendedProducts.map(p => p._id.toString())))
    .map(id => recommendedProducts.find(p => p._id.toString() === id));


  res.json(uniqueRecommendations);
});


const getSymptomRecommendations = asyncHandler(async (req, res) => {
    const { symptoms } = req.query; // symptoms could be a comma-separated string like "fever,cough"

    if (!symptoms) {
        return res.json([]);
    }

    const symptomArray = symptoms.split(',').map(s => s.trim().toLowerCase());

    const productKeywords = [];
    if (symptomArray.includes('fever')) productKeywords.push('pain relief', 'fever reducer');
    if (symptomArray.includes('cough')) productKeywords.push('cough syrup', 'cold & flu');
    if (symptomArray.includes('headache')) productKeywords.push('pain relief');
    if (symptomArray.includes('allergies')) productKeywords.push('allergy relief');

    const recommendedProducts = await MedicineModel.find({
        $or: [
            { name: { $in: productKeywords.map(kw => new RegExp(kw, 'i')) } },
            { description: { $in: productKeywords.map(kw => new RegExp(kw, 'i')) } },
            { category: { $in: productKeywords.map(kw => new RegExp(kw, 'i')) } },
        ]
    }).limit(5);

    res.json(recommendedProducts);
});


export { getPersonalizedRecommendations, getSymptomRecommendations };