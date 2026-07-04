import express from "express";
import {
  cancelAppointment,
  deleteAppointment,
  doctorUpdateAppointmentStatus,
  getAllAppointments,
  getAvailableSlots,
  getDoctorAppointments,
  getDoctorStats,
  getPatientAppointments,
  postAppointment,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isDoctorAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/available-slots", isPatientAuthenticated, getAvailableSlots);
router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/myappointments", isPatientAuthenticated, getPatientAppointments);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);
router.delete("/cancel/:id", isPatientAuthenticated, cancelAppointment);

// Doctor routes
router.get("/doctor/all", isDoctorAuthenticated, getDoctorAppointments);
router.get("/doctor/stats", isDoctorAuthenticated, getDoctorStats);
router.put("/doctor/status/:id", isDoctorAuthenticated, doctorUpdateAppointmentStatus);

export default router;
