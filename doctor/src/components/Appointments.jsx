import React, { useContext, useEffect, useState, useMemo } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import PageTransition from "./PageTransition";
import { formatSlotTo12h } from "../constants/timeSlots";

const TABS = [
  { key: "today", label: "Today" },
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
  { key: "all", label: "All" },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;

  const { isAuthenticated } = useContext(Context);

  const today = new Date().toISOString().substring(0, 10);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", currentPage);
      params.set("limit", itemsPerPage);

      if (statusFilter) params.set("status", statusFilter);

      if (activeTab === "today") {
        params.set("date", today);
      }

      const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/doctor/all?${params.toString()}`,
        { withCredentials: true }
      );
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setCurrentPage(1);
    }
  }, [activeTab, statusFilter, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) fetchAppointments();
  }, [currentPage, activeTab, statusFilter, isAuthenticated]);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/appointment/doctor/status/${appointmentId}`,
        { status },
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchAppointments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Client-side filtering for tabs that need date comparison and search
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Tab-based date filtering (for upcoming and past, since API doesn't support gt/lt)
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (a) => a.appointment_date.substring(0, 10) >= today && a.status !== "Rejected"
      );
    } else if (activeTab === "past") {
      filtered = filtered.filter(
        (a) => a.appointment_date.substring(0, 10) < today
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [appointments, activeTab, searchQuery, today]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <CardTitle className="text-lg dark:text-slate-100">Appointments</CardTitle>
                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                        activeTab === tab.key
                          ? "bg-white dark:bg-dark-surface text-primary-600 dark:text-primary-400 shadow-sm"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search by patient name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex h-10 appearance-none rounded-lg border border-slate-200 bg-white/80 backdrop-blur-sm px-3 py-2 pr-8 text-sm transition-all duration-200 dark:border-slate-700 dark:bg-dark-surface/80 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

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
                        <TableHead>Time</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                          <TableRow key={appointment._id}>
                            <TableCell className="font-medium">
                              {`${appointment.firstName} ${appointment.lastName}`}
                            </TableCell>
                            <TableCell>
                              {appointment.appointment_date.substring(0, 10)}
                            </TableCell>
                            <TableCell>
                              {appointment.timeSlot ? formatSlotTo12h(appointment.timeSlot) : "-"}
                            </TableCell>
                            <TableCell>{appointment.department}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  appointment.status === "Pending"
                                    ? "warning"
                                    : appointment.status === "Accepted"
                                    ? "success"
                                    : "destructive"
                                }
                              >
                                {appointment.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex justify-center gap-1">
                                {appointment.status !== "Accepted" && (
                                  <Button
                                    size="sm"
                                    className="bg-green-500 hover:bg-green-600 text-white text-xs h-7 px-2"
                                    onClick={() =>
                                      handleStatusUpdate(appointment._id, "Accepted")
                                    }
                                  >
                                    Accept
                                  </Button>
                                )}
                                {appointment.status !== "Rejected" && (
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        className="text-xs h-7 px-2"
                                      >
                                        Reject
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Reject Appointment</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to reject this appointment with {appointment.firstName} {appointment.lastName}?
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel />
                                        <AlertDialogAction
                                          onClick={() =>
                                            handleStatusUpdate(appointment._id, "Rejected")
                                          }
                                        >
                                          Reject
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <svg
                              className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                              />
                            </svg>
                            <p className="text-slate-500 dark:text-dark-text-muted font-medium">
                              No appointments found
                            </p>
                            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                              {activeTab === "today"
                                ? "No appointments scheduled for today"
                                : activeTab === "upcoming"
                                ? "No upcoming appointments"
                                : activeTab === "past"
                                ? "No past appointments"
                                : "No appointments match your filters"}
                            </p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, total)} of {total}
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

export default Appointments;
