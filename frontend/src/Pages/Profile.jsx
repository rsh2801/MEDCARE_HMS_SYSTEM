import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const Profile = () => {
  const { isAuthenticated, user, setUser } = useContext(Context);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.put(
        "http://localhost:5000/api/v1/user/patient/update",
        { firstName, lastName, email, phone },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setUser(data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100">
            My Profile
          </h1>

          {/* Editable fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-slate-100">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Profile"}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Read-only identity fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-slate-100">
                Identity Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-slate-500 dark:text-slate-400">Aadhaar</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user?.aadhaar || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 dark:text-slate-400">Date of Birth</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user?.dob ? user.dob.substring(0, 10) : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-500 dark:text-slate-400">Gender</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {user?.gender || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Profile;
