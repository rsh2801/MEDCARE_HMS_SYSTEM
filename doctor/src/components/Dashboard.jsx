import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "../context/ThemeContext";
import PageTransition from "./PageTransition";
import AnimatedCounter from "./AnimatedCounter";
import { formatSlotTo12h } from "../constants/timeSlots";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  const { isAuthenticated, doctor } = useContext(Context);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/doctor/stats`,
          { withCredentials: true }
        );
        setStats(data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) fetchStats();
  }, [isAuthenticated]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/doctor/status/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data.message);
      // Refresh stats
      const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/doctor/stats`,
        { withCredentials: true }
      );
      setStats(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const isDark = theme === "dark";

  const chartData = useMemo(() => {
    if (!stats?.recentTrend) return [];
    return stats.recentTrend.map((item) => ({
      date: item.date.substring(5), // MM-DD
      count: item.count,
    }));
  }, [stats]);

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <div className="space-y-6">
          {/* Welcome card + Stat cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Welcome */}
            <Card className="lg:col-span-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border-0 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-2xl" />
              <CardContent className="p-6 relative z-10">
                <p className="text-slate-600 dark:text-dark-text-muted text-sm">Welcome back,</p>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Dr. {doctor && `${doctor.firstName} ${doctor.lastName}`}
                </h3>
                <p className="text-sm text-slate-500 dark:text-dark-text-muted mt-1">
                  {doctor.doctorDepartment && `${doctor.doctorDepartment} Department`}
                </p>
              </CardContent>
            </Card>

            {/* Today's Appointments */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-text-muted">Today's Appointments</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : <AnimatedCounter value={stats?.todayAppointments || 0} />}
                </h3>
              </CardContent>
            </Card>

            {/* Pending Requests */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-text-muted">Pending Requests</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : <AnimatedCounter value={stats?.pendingCount || 0} />}
                </h3>
              </CardContent>
            </Card>

            {/* Total Patients */}
            <Card className="border-l-4 border-l-emerald-500">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-text-muted">Total Patients</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : <AnimatedCounter value={stats?.totalPatients || 0} />}
                </h3>
              </CardContent>
            </Card>

            {/* Accepted Today */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-text-muted">Accepted Today</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : <AnimatedCounter value={stats?.acceptedToday || 0} />}
                </h3>
              </CardContent>
            </Card>
          </div>

          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg dark:text-slate-100">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : stats?.todaySchedule?.length > 0 ? (
                <div className="space-y-3">
                  {stats.todaySchedule.map((appt) => (
                    <div
                      key={appt._id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="font-mono text-xs min-w-[80px] justify-center">
                          {formatSlotTo12h(appt.timeSlot)}
                        </Badge>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">
                            {appt.firstName} {appt.lastName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-dark-text-muted">
                            {appt.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            appt.status === "Pending"
                              ? "warning"
                              : appt.status === "Accepted"
                              ? "success"
                              : "destructive"
                          }
                        >
                          {appt.status}
                        </Badge>
                        <div className="flex gap-1 ml-2">
                          {appt.status !== "Accepted" && (
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-2"
                              onClick={() => handleStatusUpdate(appt._id, "Accepted")}
                            >
                              Accept
                            </Button>
                          )}
                          {appt.status !== "Rejected" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="text-xs h-7 px-2"
                              onClick={() => handleStatusUpdate(appt._id, "Rejected")}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                  <p className="text-slate-500 dark:text-dark-text-muted font-medium">No appointments today</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                    Your schedule is clear for today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 7-Day Trend Chart */}
          {!loading && chartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg dark:text-slate-100">7-Day Appointment Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: isDark ? "#334155" : "#e2e8f0" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 12 }}
                      axisLine={{ stroke: isDark ? "#334155" : "#e2e8f0" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? "#1e293b" : "#fff",
                        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                        borderRadius: "8px",
                        color: isDark ? "#e2e8f0" : "#1e293b",
                      }}
                    />
                    <Bar dataKey="count" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default Dashboard;
