import mongoose from "mongoose";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import { User } from "../models/userSchema.js";
import { TIME_SLOTS } from "../constants/timeSlots.js";

export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    aadhaar,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstName,
    doctor_lastName,
    hasVisited,
    address,
    timeSlot,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !aadhaar ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstName ||
    !doctor_lastName ||
    !address ||
    !timeSlot
  ) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  if (!TIME_SLOTS.includes(timeSlot)) {
    return next(new ErrorHandler("Invalid Time Slot!", 400));
  }
  const isConflict = await User.find({
    firstName: doctor_firstName,
    lastName: doctor_lastName,
    role: "Doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  try {
    const appointment = await Appointment.create({
      firstName,
      lastName,
      email,
      phone,
      aadhaar,
      dob,
      gender,
      appointment_date,
      department,
      doctor: {
        firstName: doctor_firstName,
        lastName: doctor_lastName,
      },
      hasVisited,
      address,
      doctorId,
      patientId,
      timeSlot,
    });
    res.status(200).json({
      success: true,
      appointment,
      message: "Appointment Send!",
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        new ErrorHandler(
          "This time slot is already booked. Please choose a different slot.",
          409
        )
      );
    }
    throw error;
  }
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
export const getPatientAppointments = catchAsyncErrors(
  async (req, res, next) => {
    const appointments = await Appointment.find({ patientId: req.user._id });
    res.status(200).json({
      success: true,
      appointments,
    });
  }
);

export const cancelAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  if (appointment.patientId.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Not authorized!", 403));
  }
  if (appointment.status !== "Pending") {
    return next(new ErrorHandler("Only pending appointments can be cancelled!", 400));
  }
  await appointment.deleteOne();
  res.status(200).json({ success: true, message: "Appointment Cancelled!" });
});

export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new ErrorHandler("Appointment Not Found!", 404));
  }
  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: "Appointment Deleted!",
  });
});

export const getDoctorAppointments = catchAsyncErrors(
  async (req, res, next) => {
    const { status, date, page = 1, limit = 10 } = req.query;
    const filter = { doctorId: req.user._id };
    if (status) filter.status = status;
    if (date) filter.appointment_date = date;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Appointment.countDocuments(filter);
    const appointments = await Appointment.find(filter)
      .sort({ appointment_date: -1, timeSlot: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      appointments,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  }
);

export const getDoctorStats = catchAsyncErrors(async (req, res, next) => {
  const doctorId = req.user._id;
  const today = new Date().toISOString().substring(0, 10);

  // Today's appointments
  const todayAppointments = await Appointment.countDocuments({
    doctorId,
    appointment_date: today,
  });

  // Pending count
  const pendingCount = await Appointment.countDocuments({
    doctorId,
    status: "Pending",
  });

  // Accepted today
  const acceptedToday = await Appointment.countDocuments({
    doctorId,
    status: "Accepted",
    appointment_date: today,
  });

  // Total unique patients
  const uniquePatients = await Appointment.distinct("patientId", { doctorId });
  const totalPatients = uniquePatients.length;

  // 7-day trend
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().substring(0, 10));
  }

  const trendAgg = await Appointment.aggregate([
    {
      $match: {
        doctorId: new mongoose.Types.ObjectId(doctorId),
        appointment_date: { $in: days },
      },
    },
    {
      $group: {
        _id: "$appointment_date",
        count: { $sum: 1 },
      },
    },
  ]);

  const trendMap = {};
  trendAgg.forEach((item) => {
    trendMap[item._id] = item.count;
  });

  const recentTrend = days.map((date) => ({
    date,
    count: trendMap[date] || 0,
  }));

  // Today's schedule
  const todaySchedule = await Appointment.find({
    doctorId,
    appointment_date: today,
  }).sort({ timeSlot: 1 });

  res.status(200).json({
    success: true,
    todayAppointments,
    pendingCount,
    totalPatients,
    acceptedToday,
    recentTrend,
    todaySchedule,
  });
});

export const doctorUpdateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Accepted", "Rejected"].includes(status)) {
      return next(
        new ErrorHandler("Status must be either 'Accepted' or 'Rejected'.", 400)
      );
    }

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new ErrorHandler("Appointment not found!", 404));
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("Not authorized to update this appointment!", 403)
      );
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      message: `Appointment ${status}!`,
    });
  }
);

export const getAvailableSlots = catchAsyncErrors(async (req, res, next) => {
  const { doctorId, date } = req.query;
  if (!doctorId || !date) {
    return next(new ErrorHandler("Doctor ID and date are required!", 400));
  }
  const bookedAppointments = await Appointment.find(
    { doctorId, appointment_date: date },
    { timeSlot: 1 }
  );
  const bookedSlots = new Set(bookedAppointments.map((a) => a.timeSlot));
  const slots = TIME_SLOTS.map((time) => ({
    time,
    available: !bookedSlots.has(time),
  }));
  const bookedCount = bookedSlots.size;
  res.status(200).json({
    success: true,
    slots,
    bookedCount,
    availableCount: TIME_SLOTS.length - bookedCount,
  });
});
