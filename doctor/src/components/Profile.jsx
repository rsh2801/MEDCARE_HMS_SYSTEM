import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageTransition from "./PageTransition";

const Profile = () => {
  const { isAuthenticated, doctor, setDoctor } = useContext(Context);
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(doctor.phone || "");
  const [yearsOfExperience, setYearsOfExperience] = useState(
    doctor.yearsOfExperience || ""
  );
  const [saving, setSaving] = useState(false);

  // Sync state when doctor data changes
  React.useEffect(() => {
    setPhone(doctor.phone || "");
    setYearsOfExperience(doctor.yearsOfExperience || "");
  }, [doctor]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctor/profile`,
        { phone, yearsOfExperience },
        { withCredentials: true }
      );
      toast.success(data.message);
      setDoctor(data.user);
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setPhone(doctor.phone || "");
    setYearsOfExperience(doctor.yearsOfExperience || "");
    setEditing(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const initials = `${doctor.firstName?.[0] || ""}${doctor.lastName?.[0] || ""}`;

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 text-2xl">
                  {doctor.docAvatar?.url ? (
                    <AvatarImage src={doctor.docAvatar.url} alt={`${doctor.firstName} ${doctor.lastName}`} />
                  ) : (
                    <AvatarFallback className="text-2xl font-bold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                  <p className="text-slate-500 dark:text-dark-text-muted">
                    {doctor.doctorDepartment}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500">
                    {doctor.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg dark:text-slate-100">
                  Profile Details
                </CardTitle>
                {!editing ? (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Read-only fields */}
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">First Name</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.firstName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Last Name</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.lastName}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Email</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.email}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Department</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.doctorDepartment}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Aadhaar</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.aadhaar}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Date of Birth</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.dob?.substring(0, 10)}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Gender</Label>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    {doctor.gender}
                  </p>
                </div>

                {/* Editable fields */}
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Phone</Label>
                  {editing ? (
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {doctor.phone}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-slate-500 dark:text-slate-400">Years of Experience</Label>
                  {editing ? (
                    <Input
                      type="number"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      placeholder="Enter years of experience"
                      min="0"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                      {doctor.yearsOfExperience != null
                        ? `${doctor.yearsOfExperience} years`
                        : "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
};

export default Profile;
