import User from "../models/User.js";

const addPatient = async (req, res) => {
  try {
    const { name, age, gender } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newPatient = { name, age, gender };
    user.managePatients.push(newPatient);
    await user.save();
    const updatedUser = await User.findById(req.user._id).select(
      "managePatients"
    );
    res.status(201).json({ success: true, data: updatedUser.managePatients });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getPatients = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: user.managePatients,
      message: "Patient fetch successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { name, age, gender, medicalDetails } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const patient = user.managePatients.id(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.name = name || patient.name;
    patient.age = age ?? patient.age;
    patient.gender = gender || patient.gender;
    patient.medicalDetails = medicalDetails || patient.medicalDetails;
    await user.save();
    res.status(200).json({ success: true, message: "Patient Updated successfully!" });
  } catch (error) {
    res.status(500).json(error);
  }
};

const deletePatient = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const patient = user.managePatients.id(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    patient.deleteOne();
    await user.save();
    res.status(200).json({
       success: true,
      message: "Patient removed successfully",
    });
  } catch (error) {
    console.error("Delete patient error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addAddress = async (req, res) => {
  try {
    const { address, city, postalcode, country } = req.body;
    // console.log(req.body);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.manageAddress.push({ address, city, postalcode, country });
    await user.save();
    res.status(201).json({
      success: true,
      data: user.manageAddress,
      message: "Address Added succussfully",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.status(200).json({
      success: true,
      data: user.manageAddress,
      message: "Address fetch successfully!",
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateAddresses = async (req, res) => {
   try {
    const { address, postalcode, state, city, country } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const addressDoc = user.manageAddress.id(req.params.id);
    if (!addressDoc) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (address !== undefined) addressDoc.address = address;
    if (postalcode !== undefined) addressDoc.postalcode = postalcode;
    if (state !== undefined) addressDoc.state = state;
    if (city !== undefined) addressDoc.city = city;
    if (country !== undefined) addressDoc.country = country;

    await user.save();

    res.status(200).json({
      success: true,
      data: addressDoc,
      message: "Address updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const existingAddress = user.manageAddress.find(
      (p) => p._id.toString() === req.params.id
    );
    if (!existingAddress) {
      return res.status(404).json({ ingAddrmessage: "Address not found" });
    }
    existingAddress.deleteOne();
    await user.save();
    res.status(200).json({success: true, message: "Address removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export {
  addPatient,
  getPatients,
  updatePatient,
  deletePatient,
  addAddress,
  getAddresses,
  updateAddresses,
  deleteAddress,
};
