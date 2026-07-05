import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
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
import Breadcrumb from "./Breadcrumb";
import AnimatedCounter from "./AnimatedCounter";
import { formatSlotTo12h } from "../constants/timeSlots";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      const [apptRes, docRes] = await Promise.allSettled([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/getall`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctors`, { withCredentials: true }),
      ]);
      setAppointments(apptRes.status === "fulfilled" ? apptRes.value.data.appointments : []);
      setDoctors(docRes.status === "fulfilled" ? docRes.value.data.doctors : []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt._id === appointmentId ? { ...appt, status } : appt
        )
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/delete/${appointmentId}`,
        { withCredentials: true }
      );
      setAppointments((prev) => {
        const updated = prev.filter((appt) => appt._id !== appointmentId);
        const newTotalPages = Math.ceil(updated.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return updated;
      });
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const { isAuthenticated, admin } = useContext(Context);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const pendingCount = appointments.filter((a) => a.status === "Pending").length;

  // Pagination
  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  // Chart data — group appointments by date (last 14 days)
  const chartData = useMemo(() => {
    const days = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().substring(0, 10));
    }
    const counts = {};
    days.forEach((d) => (counts[d] = 0));
    appointments.forEach((appt) => {
      const date = appt.appointment_date?.substring(0, 10);
      if (date && counts[date] !== undefined) {
        counts[date]++;
      }
    });
    return days.map((d) => ({
      date: d.substring(5), // MM-DD
      count: counts[d],
    }));
  }, [appointments]);

  const isDark = theme === "dark";

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <Breadcrumb />
        <div className="space-y-6">
          {/* Stat cards row */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-2 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border-0 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-200/30 dark:bg-primary-500/10 rounded-full blur-2xl" />
              <CardContent className="p-6 flex items-center gap-6 relative z-10">
                <img src="/doc.png" alt="doctor" className="h-32 w-auto hidden sm:block" />
                <div>
                  <p className="text-slate-600 dark:text-dark-text-muted text-sm">Hello,</p>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    {admin && `${admin.firstName} ${admin.lastName}`}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-dark-text-muted mt-2">
                    Welcome back to your admin dashboard. Manage appointments, doctors and more.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-primary-500">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-text-muted">Total Appointments</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : <AnimatedCounter value={appointments.length} />}
                </h3>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-accent-500">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent-600 dark:text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-dark-text-muted">Registered Doctors</p>
                <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                  {loading ? <Skeleton className="h-8 w-16" /> : <AnimatedCounter value={doctors.length} />}
                </h3>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Trend Chart */}
          {!loading && appointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg dark:text-slate-100">Appointments Trend</CardTitle>
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

          {/* Appointments table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg dark:text-slate-100">Appointments</CardTitle>
                {pendingCount > 0 && (
                  <Badge variant="warning">{pendingCount} pending</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Patient</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Visited</TableHead>
                        <TableHead className="text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAppointments.length > 0
                        ? paginatedAppointments.map((appointment) => (
                            <TableRow key={appointment._id}>
                              <TableCell className="font-medium">
                                {`${appointment.firstName} ${appointment.lastName}`}
                              </TableCell>
                              <TableCell>
                                {appointment.appointment_date.substring(0, 10)}
                                {appointment.timeSlot && (
                                  <span className="block text-xs text-slate-400">{formatSlotTo12h(appointment.timeSlot)}</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {`${appointment.doctor.firstName} ${appointment.doctor.lastName}`}
                              </TableCell>
                              <TableCell>{appointment.department}</TableCell>
                              <TableCell>
                                <select
                                  value={appointment.status}
                                  onChange={(e) =>
                                    handleUpdateStatus(appointment._id, e.target.value)
                                  }
                                  className="text-sm border-0 bg-transparent font-medium focus:outline-none cursor-pointer dark:text-slate-300"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Accepted">Accepted</option>
                                  <option value="Rejected">Rejected</option>
                                </select>
                                <Badge
                                  variant={
                                    appointment.status === "Pending"
                                      ? "warning"
                                      : appointment.status === "Accepted"
                                      ? "success"
                                      : "destructive"
                                  }
                                  className="ml-2"
                                >
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                {appointment.hasVisited === true ? (
                                  <GoCheckCircleFill className="text-green-500 text-lg mx-auto" />
                                ) : (
                                  <AiFillCloseCircle className="text-red-500 text-lg mx-auto" />
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                      </svg>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this appointment? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel />
                                      <AlertDialogAction onClick={() => handleDelete(appointment._id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          ))
                        : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-12">
                              <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                              </svg>
                              <p className="text-slate-500 dark:text-dark-text-muted font-medium">No appointments found</p>
                              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Appointments will appear here once patients book them</p>
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, appointments.length)} of {appointments.length}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[2rem]"
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  );
};

export default Dashboard;
