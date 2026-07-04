import express from "express";
import {
  addNewAdmin,
  addNewDoctor,
  deleteDoctor,
  getAllDoctors,
  getUserDetails,
  login,
  logoutAdmin,
  logoutDoctor,
  logoutPatient,
  patientRegister,
  updatePatientProfile,
  updateDoctorProfile,
  resetPassword,
} from "../controller/userController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addnew", isAdminAuthenticated, addNewAdmin);
router.post("/doctor/addnew", isAdminAuthenticated, addNewDoctor);
router.get("/doctors", getAllDoctors);
router.delete("/doctor/:id", isAdminAuthenticated, deleteDoctor);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.put("/patient/update", isPatientAuthenticated, updatePatientProfile);
router.post("/password/reset", resetPassword);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);

// Doctor routes
router.get("/doctor/me", isDoctorAuthenticated, getUserDetails);
router.get("/doctor/logout", isDoctorAuthenticated, logoutDoctor);
router.put("/doctor/profile", isDoctorAuthenticated, updateDoctorProfile);

export default router;
