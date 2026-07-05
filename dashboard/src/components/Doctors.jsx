import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import Breadcrumb from "./Breadcrumb";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const { isAuthenticated } = useContext(Context);

  const departments = [
    "All", "Pediatrics", "Orthopedics", "Cardiology", "Neurology",
    "Oncology", "Radiology", "Physical Therapy", "Dermatology", "ENT",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        toast.error(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleDeleteDoctor = async (doctorId) => {
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/doctor/${doctorId}`,
        { withCredentials: true }
      );
      setDoctors((prev) => prev.filter((doc) => doc._id !== doctorId));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const filtered = doctors.filter((doc) => {
    const matchesDept = selectedDept === "All" || doc.doctorDepartment === selectedDept;
    const matchesSearch =
      !search ||
      `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <Breadcrumb />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Doctors</h1>
          <Input
            type="text"
            placeholder="Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all cursor-pointer ${
                selectedDept === dept
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-4" />
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24 mb-3" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.length > 0 ? (
              filtered.map((element, index) => (
                <motion.div
                  key={element._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className="relative shadow-sm hover:shadow-md transition-shadow border-t-4 border-t-primary-500">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="absolute top-3 right-3 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors cursor-pointer" title="Delete doctor">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete Dr. {element.firstName} {element.lastName}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel />
                          <AlertDialogAction onClick={() => handleDeleteDoctor(element._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="w-24 h-24 mb-4">
                        <AvatarImage
                          src={element.docAvatar && element.docAvatar.url}
                          alt="doctor avatar"
                        />
                        <AvatarFallback className="text-lg">
                          {element.firstName?.[0]}{element.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        {`${element.firstName} ${element.lastName}`}
                      </h4>
                      <Badge className="mb-3">{element.doctorDepartment}</Badge>
                      {element.yearsOfExperience != null && (
                        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">
                          {element.yearsOfExperience} YOE
                        </p>
                      )}
                      <div className="w-full space-y-1.5 text-left">
                        <p className="text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span>{" "}
                          <span className="text-slate-500 dark:text-dark-text-muted">{element.email}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span>{" "}
                          <span className="text-slate-500 dark:text-dark-text-muted">{element.phone}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">DOB:</span>{" "}
                          <span className="text-slate-500 dark:text-dark-text-muted">{element.dob.substring(0, 10)}</span>
                        </p>
                        <p className="text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Gender:</span>{" "}
                          <span className="text-slate-500 dark:text-dark-text-muted">{element.gender}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <svg className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                <p className="text-slate-500 dark:text-dark-text-muted font-medium">No doctors found</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  {search || selectedDept !== "All" ? "Try adjusting your filters" : "Register doctors to see them here"}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default Doctors;
