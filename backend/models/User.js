import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const patientSchema = mongoose.Schema(
  {
    name: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
  },
  { _id: true }
);

const addressSchema = mongoose.Schema(
  {
    address: { type: String },
    city: { type: String },
    postalcode: { type: String },
    country: { type: String },
  },
  { _id: true }
);

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: Number,
    },
    profilePicture: {
      url: { type: String },
      publicId: { type: String },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    verificationToken: { type: String },
    isVerified: { type: Boolean, default: false },
    medicalHistory: [
      {
        condition: { type: String },
        diagnosisDate: { type: Date },
        medications: [{ type: String }],
        notes: { type: String },
        prescriptionUrl: { url: { type: String }, publicId: { type: String } },
      },
    ],
    myCarts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
      },
    ],
    managePatients: [patientSchema],
    manageAddress: [addressSchema],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
