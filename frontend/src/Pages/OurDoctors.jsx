import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const OurDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const departments = [
    "All",
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors);
      } catch (error) {
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((doc) => {
    const matchesDept = selectedDept === "All" || doc.doctorDepartment === selectedDept;
    const matchesSearch =
      !search ||
      `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <PageTransition>
      <section className="pt-28 pb-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6">
            Our Doctors
          </h1>

          <div className="mb-6 space-y-4">
            <Input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all cursor-pointer ${
                    selectedDept === dept
                      ? "bg-primary-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
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
                    <Skeleton className="h-4 w-3/4 mt-1" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((doc, index) => (
                <motion.div
                  key={doc._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white dark:ring-dark-surface shadow-sm mb-4 bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                        {doc.docAvatar?.url ? (
                          <img
                            src={doc.docAvatar.url}
                            alt={`${doc.firstName} ${doc.lastName}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                            {doc.firstName?.[0]}{doc.lastName?.[0]}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">
                        {doc.firstName} {doc.lastName}
                      </h4>
                      <Badge className="mb-3">{doc.doctorDepartment}</Badge>
                      {doc.yearsOfExperience != null && (
                        <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2">
                          {doc.yearsOfExperience} YOE
                        </p>
                      )}
                      <div className="w-full space-y-1 text-left">
                        <p className="text-sm text-slate-500 dark:text-dark-text-muted">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span> {doc.email}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-dark-text-muted">
                          <span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span> {doc.phone}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400">No doctors found</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};

export default OurDoctors;
