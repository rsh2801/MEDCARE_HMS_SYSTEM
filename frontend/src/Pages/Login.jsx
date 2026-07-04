import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "sonner";
import { Context } from "../main";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import GradientBackground from "../components/GradientBackground";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios
        .post(
          "http://localhost:5000/api/v1/user/login",
          { email, password, confirmPassword, role: "Patient" },
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          toast.success(res.data.message);
          setIsAuthenticated(true);
          navigateTo("/");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <PageTransition>
      <GradientBackground variant="auth" />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <Card className="w-full max-w-md shadow-lg bg-white/95 dark:bg-dark-surface/95 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">Sign In</CardTitle>
            <CardDescription>Please login to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Forgot Password?
                </Link>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 dark:text-dark-text-muted">Not Registered?</span>
                  <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Register Now
                  </Link>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default Login;
