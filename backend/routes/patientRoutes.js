import express from "express";
// import { protect } from "../middlewares/authMiddleware";
import { addAddress, addPatient, deleteAddress, deletePatient, getAddresses, getPatients, updateAddresses, updatePatient } from "../controllers/PatientController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();


// Patient routes
router.post("/", protect, addPatient);
router.get("/", protect, getPatients);
// Address routes
router.post("/address", protect, addAddress);
router.get("/address", protect, getAddresses);

router.put("/:id", protect, updatePatient);
router.delete("/:id", protect, deletePatient);

router.put("/address/:id", protect, updateAddresses);
router.delete("/address/:id", protect, deleteAddress);


export default router;
