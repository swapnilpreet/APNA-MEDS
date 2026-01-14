import express from 'express';
import { getPersonalizedRecommendations, getSymptomRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getPersonalizedRecommendations); // Get personalized recommendations for logged-in users

router.route('/symptoms')
  .get(getSymptomRecommendations); // Get recommendations based on symptoms (can be public or private based on need)

export default router;