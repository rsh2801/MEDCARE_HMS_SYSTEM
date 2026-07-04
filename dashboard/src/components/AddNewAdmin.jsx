import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import Breadcrumb from "./Breadcrumb";

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(
          "http://localhost:5000/api/v1/user/admin/addnew",
          { firstName, lastName, email, phone, aadhaar, dob, gender, password },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
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
      toast.error(error.response?.data?.message || error.message);
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <img src="/logo.png" alt="MedCare" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add New Admin</h1>
          </div>
          <Card>
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleAddNewAdmin} className="space-y-4">
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
                  <Input type="date" placeholder="Date of Birth" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </Select>
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? "Adding..." : "Add New Admin"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
};

export default AddNewAdmin;
