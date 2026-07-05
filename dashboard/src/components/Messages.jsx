import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import PageTransition from "./PageTransition";
import Breadcrumb from "./Breadcrumb";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/message/getall`,
          { withCredentials: true }
        );
        setMessages(data.messages);
      } catch (error) {
        console.log(error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const filtered = messages.filter((msg) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      msg.firstName?.toLowerCase().includes(q) ||
      msg.lastName?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    );
  });

  return (
    <PageTransition>
      <section className="xl:ml-20 min-h-screen bg-slate-100 dark:bg-dark-bg p-6 lg:p-10 transition-colors">
        <Breadcrumb />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Messages</h1>
          <Input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((element, index) => (
                <motion.div
                  key={element._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 space-y-2">
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">First Name:</span>{" "}
                        <span className="text-slate-500 dark:text-dark-text-muted">{element.firstName}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Last Name:</span>{" "}
                        <span className="text-slate-500 dark:text-dark-text-muted">{element.lastName}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Email:</span>{" "}
                        <span className="text-slate-500 dark:text-dark-text-muted">{element.email}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Phone:</span>{" "}
                        <span className="text-slate-500 dark:text-dark-text-muted">{element.phone}</span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Message:</span>{" "}
                        <span className="text-slate-500 dark:text-dark-text-muted">{element.message}</span>
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16">
                <svg className="mx-auto h-14 w-14 text-slate-300 dark:text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <p className="text-slate-500 dark:text-dark-text-muted font-medium">No messages found</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  {search ? "Try adjusting your search" : "Messages will appear here"}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </PageTransition>
  );
};

export default Messages;
