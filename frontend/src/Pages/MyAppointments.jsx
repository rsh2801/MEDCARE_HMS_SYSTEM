import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { formatSlotTo12h } from "../constants/timeSlots";
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

const MyAppointments = () => {
  const { isAuthenticated } = useContext(Context);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/appointment/myappointments",
          { withCredentials: true }
        );
        setAppointments(data.appointments);
      } catch (error) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/v1/appointment/cancel/${id}`,
        { withCredentials: true }
      );
      setAppointments((prev) => prev.filter((appt) => appt._id !== id));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const statusVariant = (status) => {
    if (status === "Accepted") return "success";
    if (status === "Rejected") return "destructive";
    return "warning";
  };

  return (
    <PageTransition>
      <section className="pt-28 pb-16 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8">
            My Appointments
          </h1>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-5 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : appointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((appt, index) => (
                <motion.div
                  key={appt._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                          {appt.department}
                        </h3>
                        <Badge variant={statusVariant(appt.status)} className="flex items-center gap-1.5">
                          {appt.status === "Pending" && (
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
                          )}
                          {appt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-dark-text-muted">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Doctor:</span>{" "}
                        {appt.doctor?.firstName} {appt.doctor?.lastName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-dark-text-muted">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Date:</span>{" "}
                        {appt.appointment_date?.substring(0, 10)}
                        {appt.timeSlot && ` at ${formatSlotTo12h(appt.timeSlot)}`}
                      </p>
                      {appt.status === "Pending" && (
                        <div className="pt-2">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this appointment? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel />
                                <AlertDialogAction onClick={() => handleCancel(appt._id)}>
                                  Cancel Appointment
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">No appointments yet</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Book an appointment to get started</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default MyAppointments;
