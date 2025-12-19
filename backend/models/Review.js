import mongoose from 'mongoose';
 
const reviewSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // If this was a standalone collection, you would typically add a product field:
    // product: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: 'Product', // Reference to the Product model
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Create the Review model from the schema
const Review = mongoose.model('Review', reviewSchema);

export default Review;
