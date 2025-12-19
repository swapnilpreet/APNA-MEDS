import mongoose from 'mongoose';

const prescriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Rejected'],
      default: 'Pending',
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;