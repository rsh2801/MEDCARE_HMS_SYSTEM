import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { getSlotsByPeriod, formatSlotTo12h, PERIODS } from "../constants/timeSlots";

const STEPS = ["Doctor", "Date", "Details", "Confirm"];

const departmentsArray = [
  "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
  "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT",
];

const AppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);

  // Time slot state
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [slotsData, setSlotsData] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch {
        setDoctors([]);
      }
    };
    fetchDoctors();
  }, []);

  // Pre-fill department from URL query param (e.g., from chatbot)
  useEffect(() => {
    const deptParam = searchParams.get("department");
    if (deptParam && departmentsArray.includes(deptParam)) {
      setDepartment(deptParam);
    }
  }, [searchParams]);

  // Fetch available slots when doctor + date are both selected
  useEffect(() => {
    if (!selectedDoctorId || !appointmentDate) {
      setSlotsData(null);
      return;
    }
    const fetchSlots = async () => {
      setSlotsLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/v1/appointment/available-slots?doctorId=${selectedDoctorId}&date=${appointmentDate}`,
          { withCredentials: true }
        );
        setSlotsData(data);
      } catch {
        setSlotsData(null);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDoctorId, appointmentDate]);

  const filteredDoctors = doctors.filter((d) => d.doctorDepartment === department);
  const today = new Date().toISOString().split("T")[0];

  const canProceed = () => {
    if (step === 0) return department && doctorFirstName && doctorLastName;
    if (step === 1) return appointmentDate && selectedSlot;
    if (step === 2) return firstName && lastName && email && phone && aadhaar && dob && gender;
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/appointment/post",
        {
          firstName, lastName, email, phone, aadhaar, dob, gender,
          appointment_date: appointmentDate, department,
          doctor_firstName: doctorFirstName, doctor_lastName: doctorLastName,
          hasVisited: Boolean(hasVisited), address,
          timeSlot: selectedSlot,
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message);
      setStep(0);
      setFirstName(""); setLastName(""); setEmail(""); setPhone("");
      setAadhaar(""); setDob(""); setGender(""); setAppointmentDate("");
      setDepartment(""); setDoctorFirstName(""); setDoctorLastName("");
      setHasVisited(false); setAddress("");
      setSelectedSlot(""); setSlotsData(null); setSelectedDoctorId("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    }) : "";

  // Check if a slot's time has already passed (for today only)
  const isSlotPast = (slotTime) => {
    if (appointmentDate !== today) return false;
    const now = new Date();
    const [h, m] = slotTime.split(":").map(Number);
    const slotDate = new Date();
    slotDate.setHours(h, m, 0, 0);
    return slotDate <= now;
  };

  const slotsByPeriod = getSlotsByPeriod();

  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/60 dark:bg-dark-surface/60 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50">
          <h2 className="text-2xl lg:text-3xl font-bold text-slate-700 dark:text-slate-200 mb-1">
            Appointment
          </h2>
          <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
            Step {step + 1} of {STEPS.length}
          </p>

          {/* Step tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-8 gap-1 overflow-x-auto">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => i < step && setStep(i)}
                className={`relative px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                  i === step
                    ? "text-primary-600 dark:text-primary-400"
                    : i < step
                    ? "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                    : "text-slate-300 dark:text-slate-600 cursor-default"
                }`}
              >
                {label}
                {i === step && (
                  <motion.div
                    layoutId="step-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500 rounded-full"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="min-h-[340px]"
            >
              {/* Step 0: Department & Doctor */}
              {step === 0 && (
                <div className="space-y-7">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">
                      Choose a department
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {departmentsArray.map((dept) => (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => {
                            setDepartment(dept);
                            setDoctorFirstName("");
                            setDoctorLastName("");
                            setSelectedDoctorId("");
                            setSelectedSlot("");
                            setSlotsData(null);
                          }}
                          className={`px-3.5 py-2 text-sm rounded-lg font-medium transition-all cursor-pointer ${
                            department === dept
                              ? "bg-primary-600 text-white shadow-sm"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {department && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                    >
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">
                        Pick a doctor in {department}
                      </Label>
                      {filteredDoctors.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {filteredDoctors.map((doc) => {
                            const picked = doc.firstName === doctorFirstName && doc.lastName === doctorLastName;
                            return (
                              <button
                                key={doc._id}
                                type="button"
                                onClick={() => {
                                  setDoctorFirstName(doc.firstName);
                                  setDoctorLastName(doc.lastName);
                                  setSelectedDoctorId(doc._id);
                                  setSelectedSlot("");
                                  setSlotsData(null);
                                }}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all ${
                                  picked
                                    ? "bg-primary-50 ring-2 ring-primary-500 dark:bg-primary-900/20 dark:ring-primary-400"
                                    : "bg-white ring-1 ring-slate-200 hover:ring-slate-300 dark:bg-dark-surface dark:ring-slate-700 dark:hover:ring-slate-600"
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                                  picked
                                    ? "bg-primary-600 text-white"
                                    : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                                }`}>
                                  {doc.firstName?.[0]}{doc.lastName?.[0]}
                                </div>
                                <div className="min-w-0">
                                  <p className={`text-sm font-medium truncate ${
                                    picked ? "text-primary-700 dark:text-primary-300" : "text-slate-700 dark:text-slate-200"
                                  }`}>
                                    Dr. {doc.firstName} {doc.lastName}
                                  </p>
                                  <p className="text-xs text-slate-400 dark:text-slate-500">
                                    {doc.doctorDepartment}
                                    {doc.yearsOfExperience != null && ` · ${doc.yearsOfExperience} YOE`}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/40">
                          <p className="text-sm text-slate-400 dark:text-slate-500">
                            No doctors available in {department}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 1: Date & Slot */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-semibold text-primary-700 dark:text-primary-300 shrink-0">
                      {doctorFirstName?.[0]}{doctorLastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                        Dr. {doctorFirstName} {doctorLastName}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{department}</p>
                    </div>
                  </div>

                  <div className="max-w-xs">
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5 block">
                      Appointment Date
                    </Label>
                    <Input
                      type="date"
                      value={appointmentDate}
                      min={today}
                      onChange={(e) => {
                        setAppointmentDate(e.target.value);
                        setSelectedSlot("");
                      }}
                    />
                    {appointmentDate && (
                      <p className="mt-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {formatDate(appointmentDate)}
                      </p>
                    )}
                  </div>

                  {/* Time Slot Grid */}
                  {appointmentDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.25 }}
                    >
                      <Label className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-3 block">
                        Pick a time slot
                      </Label>

                      {slotsLoading ? (
                        <div className="space-y-4">
                          {["Morning", "Afternoon", "Evening"].map((period) => (
                            <div key={period}>
                              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                {period}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {Array.from({ length: period === "Afternoon" ? 12 : 9 }, (_, i) => (
                                  <div key={i} className="h-9 w-[5.5rem] rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse" />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : slotsData ? (
                        <>
                          {slotsData.availableCount === 0 && (
                            <div className="mb-4 px-4 py-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                                No slots available on this date. Please choose a different date.
                              </p>
                            </div>
                          )}

                          <div className="space-y-4">
                            {Object.entries(slotsByPeriod).map(([period, periodSlots]) => (
                              <div key={period}>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                  {PERIODS[period].label}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {periodSlots.map((slotTime) => {
                                    const slotInfo = slotsData.slots.find((s) => s.time === slotTime);
                                    const isAvailable = slotInfo?.available && !isSlotPast(slotTime);
                                    const isSelected = selectedSlot === slotTime;
                                    const isPast = isSlotPast(slotTime);

                                    return (
                                      <button
                                        key={slotTime}
                                        type="button"
                                        disabled={!isAvailable}
                                        onClick={() => setSelectedSlot(slotTime)}
                                        className={`px-3 py-2 text-sm rounded-lg font-medium transition-all ${
                                          isSelected
                                            ? "bg-primary-600 text-white shadow-sm"
                                            : isAvailable
                                            ? "bg-white ring-1 ring-slate-200 text-slate-700 hover:ring-primary-300 hover:bg-primary-50 dark:bg-dark-surface dark:ring-slate-700 dark:text-slate-300 dark:hover:ring-primary-500 dark:hover:bg-primary-900/20 cursor-pointer"
                                            : "bg-slate-100 text-slate-400 line-through cursor-not-allowed dark:bg-slate-800/60 dark:text-slate-600"
                                        }`}
                                        title={
                                          isPast
                                            ? "This time has passed"
                                            : !slotInfo?.available
                                            ? "Already booked"
                                            : formatSlotTo12h(slotTime)
                                        }
                                      >
                                        {formatSlotTo12h(slotTime)}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : null}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 2: Patient details */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Input type="number" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input type="number" placeholder="Aadhaar Number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
                    <div>
                      <Label className="text-xs text-slate-400 dark:text-slate-500 mb-1 block">Date of Birth</Label>
                      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                    </div>
                  </div>
                  <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                  <Textarea rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address (optional)" />
                  <div className="flex items-center justify-end gap-3">
                    <Label htmlFor="hasVisited" className="text-sm text-slate-600 dark:text-dark-text-muted">
                      Have you visited before?
                    </Label>
                    <Checkbox id="hasVisited" checked={hasVisited} onChange={(e) => setHasVisited(e.target.checked)} />
                  </div>
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Appointment info */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                      Appointment
                    </h4>
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-semibold text-primary-700 dark:text-primary-300 shrink-0">
                          {doctorFirstName?.[0]}{doctorLastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Dr. {doctorFirstName} {doctorLastName}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{department}</p>
                        </div>
                      </div>
                      <div className="pl-[52px] text-sm text-slate-600 dark:text-slate-300">
                        {formatDate(appointmentDate)}{selectedSlot && ` at ${formatSlotTo12h(selectedSlot)}`}
                      </div>
                    </div>
                  </div>

                  {/* Patient info */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                      Patient
                    </h4>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800">
                      <Row label="Name" value={`${firstName} ${lastName}`} />
                      <Row label="Email" value={email} />
                      <Row label="Phone" value={phone} />
                      <Row label="Aadhaar" value={aadhaar} />
                      <Row label="DOB" value={formatDate(dob)} />
                      <Row label="Gender" value={gender} />
                      {address && <Row label="Address" value={address} />}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200/60 dark:border-slate-700/40">
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} type="button">
                Back
              </Button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()} type="button">
                Continue
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} type="button">
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-2.5">
      <span className="text-sm text-slate-400 dark:text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-right">{value}</span>
    </div>
  );
}

export default AppointmentForm;
