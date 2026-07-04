import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Context } from "../main";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import Breadcrumb from "./Breadcrumb";

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [doctorDepartment, setDoctorDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const departmentsArray = [
    "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
    "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT",
  ];

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoctor = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("password", password);
      formData.append("aadhaar", aadhaar);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", doctorDepartment);
      if (yearsOfExperience) formData.append("yearsOfExperience", yearsOfExperience);
      formData.append("docAvatar", docAvatar);
      await axios
        .post("http://localhost:5000/api/v1/user/doctor/addnew", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPhone("");
          setAadhaar("");
          setDob("");
          setGender("");
          setPassword("");
        });
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error("AddDoctor error:", msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <Breadcrumb />
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <img src="/logo.png" alt="MedCare" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Register a New Doctor</h1>
          </div>
          <Card>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleAddNewDoctor}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Avatar upload */}
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden bg-white dark:bg-dark-surface hover:border-primary-400 dark:hover:border-primary-500 transition-colors">
                      <img
                        src={docAvatarPreview ? docAvatarPreview : "/docHolder.jpg"}
                        alt="Doctor Avatar"
                        className="w-full h-64 lg:h-80 object-cover"
                      />
                    </div>
                    <Input type="file" onChange={handleAvatar} className="cursor-pointer" />
                  </div>

                  {/* Form fields */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      <Input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <Input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input type="number" placeholder="Mobile Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      <Input type="number" placeholder="Aadhaar Number" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} />
                    </div>
                    <Input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </Select>
                      <Select value={doctorDepartment} onChange={(e) => setDoctorDepartment(e.target.value)}>
                        <option value="">Select Department</option>
                        {departmentsArray.map((depart, index) => (
                          <option value={depart} key={index}>{depart}</option>
                        ))}
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <Input type="number" placeholder="Years of Experience" min="0" value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value)} />
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button type="submit" size="lg" disabled={loading}>
                        {loading ? "Registering..." : "Register New Doctor"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
};

export default AddNewDoctor;
