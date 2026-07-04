import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import GradientBackground from "../components/GradientBackground";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/password/reset",
        { email, aadhaar, newPassword },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <GradientBackground variant="auth" />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md shadow-lg bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Reset Password
            </CardTitle>
            <CardDescription>
              Enter your email and Aadhaar number to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Aadhaar Number"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <div className="flex items-center justify-end gap-2 text-sm">
                <span className="text-slate-500 dark:text-dark-text-muted">Remember your password?</span>
                <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Login
                </Link>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default ForgotPassword;
