import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Users,
  CalendarCheck,
  ClipboardList,
  BarChart3,
  ShieldCheck,
  Clock3,
  FileText,
  WalletCards,
  Bell,
  CheckCircle2,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Sparkles,
  Building2,
  UserCheck,
  TrendingUp,
  BriefcaseBusiness,
  Settings,
  Search,
  Award,
} from "lucide-react";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const ORANGE = "#F97316";
  const DARK_ORANGE = "#EA580C";

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description:
        "Manage employee profiles, departments, designations and professional information from one centralized platform.",
    },
    {
      icon: CalendarCheck,
      title: "Attendance Tracking",
      description:
        "Track employee check-ins, check-outs, attendance and working hours with ease.",
    },
    {
      icon: ClipboardList,
      title: "Leave Management",
      description:
        "Employees can submit leave requests while managers can review and approve them efficiently.",
    },
    {
      icon: BriefcaseBusiness,
      title: "Task Management",
      description:
        "Assign tasks, monitor progress and keep teams aligned with clear responsibilities.",
    },
    {
      icon: BarChart3,
      title: "Performance Management",
      description:
        "Track employee performance and maintain structured performance records.",
    },
    {
      icon: WalletCards,
      title: "Payroll Management",
      description:
        "Organize employee salary information and simplify payroll-related operations.",
    },
    {
      icon: FileText,
      title: "Document Management",
      description:
        "Keep important employee documents organized and accessible in one place.",
    },
    {
      icon: Bell,
      title: "Notifications",
      description:
        "Keep employees and managers informed about important updates and activities.",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Register Employees",
      description:
        "Create employee profiles and maintain essential professional information.",
    },
    {
      number: "02",
      title: "Manage Daily Work",
      description:
        "Track attendance, tasks, leave requests and everyday employee activities.",
    },
    {
      number: "03",
      title: "Monitor Performance",
      description:
        "Review employee performance and organizational progress.",
    },
    {
      number: "04",
      title: "Make Better Decisions",
      description:
        "Use organized information and reports to improve workforce management.",
    },
  ];

  const faqs = [
    {
      question: "What is the Employee Management System?",
      answer:
        "It is a centralized web-based platform designed to manage employee information, attendance, leave, tasks, performance, payroll and other HR-related activities.",
    },
    {
      question: "Who can use the system?",
      answer:
        "The system supports different roles such as Admin, Manager and Employee. Each role receives access to the features relevant to their responsibilities.",
    },
    {
      question: "Does the system support role-based access?",
      answer:
        "Yes. Role-based authentication ensures that Admins, Managers and Employees see the appropriate dashboards and functionality.",
    },
    {
      question: "Can employees manage their own information?",
      answer:
        "Yes. Employees can access their dashboard, view their information, manage applicable requests and track tasks and attendance.",
    },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="fixed top-0 left-0 right-0 z-50">

        <div className="absolute inset-0 bg-white/85 backdrop-blur-xl border-b border-slate-200/70" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

          <div className="h-20 flex items-center justify-between">

            {/* LOGO */}

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-3 group"
            >

              <div className="relative">

                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: ORANGE }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>

                <div className="absolute -right-1 -bottom-1 w-4 h-4 rounded-full bg-orange-300 border-2 border-white" />

              </div>

              <div className="text-left">

                <div className="font-bold text-[15px] tracking-tight text-slate-950">
                  SHNOOR
                </div>

                <div className="text-[9px] uppercase tracking-[0.18em] text-orange-600 font-bold">
                  INTERNATIONAL LLC
                </div>

              </div>

            </motion.button>

            {/* DESKTOP NAVIGATION */}

            <nav className="hidden md:flex items-center gap-8">

              <button
                onClick={() => scrollToSection("home")}
                className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
              >
                Home
              </button>

              <button
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
              >
                Features
              </button>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
              >
                How It Works
              </button>

              <button
                onClick={() => scrollToSection("about")}
                className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
              >
                About
              </button>

              <button
                onClick={() => scrollToSection("contact")}
                className="text-sm font-medium text-slate-700 hover:text-orange-600 transition-colors"
              >
                Contact
              </button>

            </nav>

            {/* DESKTOP BUTTONS */}

            <div className="hidden md:flex items-center gap-3">

              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-orange-50 transition-all"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all"
                style={{ backgroundColor: ORANGE }}
              >
                Get Started
              </Link>

            </div>

            {/* MOBILE MENU */}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-orange-600" />
              ) : (
                <Menu className="w-5 h-5 text-orange-600" />
              )}
            </button>

          </div>

          {/* MOBILE NAVIGATION */}

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="md:hidden py-5 border-t border-slate-200"
            >

              <div className="flex flex-col gap-2">

                <button
                  onClick={() => scrollToSection("home")}
                  className="text-left px-4 py-3 rounded-xl hover:bg-orange-50"
                >
                  Home
                </button>

                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left px-4 py-3 rounded-xl hover:bg-orange-50"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left px-4 py-3 rounded-xl hover:bg-orange-50"
                >
                  How It Works
                </button>

                <button
                  onClick={() => scrollToSection("about")}
                  className="text-left px-4 py-3 rounded-xl hover:bg-orange-50"
                >
                  About
                </button>

                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-left px-4 py-3 rounded-xl hover:bg-orange-50"
                >
                  Contact
                </button>

                <div className="grid grid-cols-2 gap-3 mt-3">

                  <Link
                    to="/login"
                    className="text-center px-4 py-3 rounded-xl bg-slate-100 font-semibold"
                  >
                    Sign In
                  </Link>

                  <Link
                    to="/register"
                    className="text-center px-4 py-3 rounded-xl text-white font-semibold"
                    style={{ backgroundColor: ORANGE }}
                  >
                    Get Started
                  </Link>

                </div>

              </div>

            </motion.div>
          )}

        </div>

      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <main id="home">

        <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">

          {/* Background */}

          <div className="absolute inset-0 pointer-events-none">

            <div className="absolute top-[-180px] right-[-100px] w-[550px] h-[550px] rounded-full bg-orange-100/60 blur-3xl" />

            <div className="absolute bottom-[-200px] left-[-100px] w-[500px] h-[500px] rounded-full bg-amber-100/50 blur-3xl" />

            <div
              className="absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
                backgroundSize: "45px 45px",
              }}
            />

          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* HERO TEXT */}

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-100 shadow-sm mb-7"
                >

                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: ORANGE }}
                  />

                  <span className="text-sm font-semibold text-slate-700">
                    SHNOOR INTERNATIONAL LLC
                  </span>

                </motion.div>

                <h1 className="text-5xl sm:text-6xl lg:text-[70px] leading-[1.03] font-bold tracking-[-0.04em] text-slate-950">

                  Manage your

                  <span className="block">
                    workforce
                    <span style={{ color: ORANGE }}> smarter.</span>
                  </span>

                </h1>

                <p className="mt-7 text-lg leading-8 text-slate-600 max-w-xl">

                  A modern employee management platform designed to
                  simplify HR operations, connect teams and give your
                  organization complete visibility.

                </p>

                <div className="mt-9 flex flex-col sm:flex-row gap-4">

                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl text-white font-semibold shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all"
                    style={{ backgroundColor: ORANGE }}
                  >

                    Get Started

                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />

                  </Link>

                  <button
                    onClick={() => scrollToSection("features")}
                    className="inline-flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-semibold hover:border-orange-200 hover:bg-orange-50 transition-all"
                  >

                    <Play
                      className="w-4 h-4"
                      style={{ color: ORANGE }}
                    />

                    Explore Features

                  </button>

                </div>

                <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">

                  <div className="flex items-center gap-2 text-sm text-slate-600">

                    <CheckCircle2 className="w-4 h-4 text-green-600" />

                    Role-based access

                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">

                    <CheckCircle2 className="w-4 h-4 text-green-600" />

                    Centralized data

                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600">

                    <CheckCircle2 className="w-4 h-4 text-green-600" />

                    Easy to use

                  </div>

                </div>

              </motion.div>

              {/* HERO DASHBOARD */}

              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                className="relative"
              >

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >

                  <div className="rounded-[28px] bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 p-4 sm:p-5">

                    {/* Browser */}

                    <div className="flex items-center justify-between mb-5 px-2">

                      <div className="flex gap-1.5">

                        <span className="w-2.5 h-2.5 rounded-full bg-orange-300" />
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-200" />
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />

                      </div>

                      <div className="w-32 h-2 rounded-full bg-slate-100" />

                      <div className="w-8 h-8 rounded-full bg-orange-50" />

                    </div>

                    <div className="grid grid-cols-[75px_1fr] gap-4">

                      {/* SIDEBAR */}

                      <div className="rounded-2xl bg-[#17120F] p-3 flex flex-col items-center gap-4 min-h-[390px]">

                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: ORANGE }}
                        >
                          <Users className="w-5 h-5 text-white" />
                        </div>

                        {[BarChart3, Users, CalendarCheck, ClipboardList, Settings].map(
                          (Icon, index) => (
                            <div
                              key={index}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                index === 0
                                  ? "bg-orange-500/20"
                                  : "hover:bg-white/10"
                              }`}
                            >

                              <Icon
                                className="w-4 h-4"
                                style={{
                                  color:
                                    index === 0
                                      ? "#FB923C"
                                      : "rgba(255,255,255,0.55)",
                                }}
                              />

                            </div>
                          )
                        )}

                      </div>

                      {/* CONTENT */}

                      <div>

                        <div className="flex items-center justify-between mb-5">

                          <div>

                            <div className="text-[10px] text-slate-400 mb-1">
                              SHNOOR INTERNATIONAL LLC
                            </div>

                            <div className="text-xl font-bold">
                              Dashboard
                            </div>

                          </div>

                          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center">

                            <Bell
                              className="w-4 h-4"
                              style={{ color: ORANGE }}
                            />

                          </div>

                        </div>

                        {/* Cards */}

                        <div className="grid grid-cols-3 gap-2.5 mb-4">

                          {[
                            ["248", "Employees"],
                            ["221", "Present"],
                            ["27", "On Leave"],
                          ].map(([number, label], index) => (

                            <div
                              key={index}
                              className="rounded-xl bg-orange-50/50 border border-orange-100 p-3"
                            >

                              <div className="text-lg font-bold">
                                {number}
                              </div>

                              <div className="text-[9px] text-slate-400 mt-1">
                                {label}
                              </div>

                            </div>

                          ))}

                        </div>

                        {/* Chart */}

                        <div className="rounded-xl border border-slate-100 p-4 mb-4">

                          <div className="flex justify-between mb-5">

                            <div>

                              <div className="text-sm font-semibold">
                                Workforce Overview
                              </div>

                              <div className="text-[9px] text-slate-400">
                                Monthly activity
                              </div>

                            </div>

                            <div
                              className="text-xs font-semibold"
                              style={{ color: ORANGE }}
                            >
                              +18.4%
                            </div>

                          </div>

                          <div className="h-28 flex items-end gap-2">

                            {[45, 60, 50, 75, 65, 90, 78, 100, 85, 92, 76, 96].map(
                              (height, index) => (

                                <motion.div
                                  key={index}
                                  initial={{ height: 0 }}
                                  animate={{ height: `${height}%` }}
                                  transition={{
                                    duration: 0.7,
                                    delay: 0.5 + index * 0.05,
                                  }}
                                  className="flex-1 rounded-t-md"
                                  style={{
                                    backgroundColor:
                                      index % 2 === 0
                                        ? ORANGE
                                        : "#FB923C",
                                  }}
                                />

                              )
                            )}

                          </div>

                        </div>

                        {/* Employees */}

                        <div className="rounded-xl border border-slate-100 p-4">

                          <div className="flex items-center justify-between mb-3">

                            <div className="text-sm font-semibold">
                              Recent Employees
                            </div>

                            <div
                              className="text-[10px] font-semibold"
                              style={{ color: ORANGE }}
                            >
                              View all
                            </div>

                          </div>

                          {[
                            ["AS", "Ananya Sharma", "Engineering"],
                            ["RK", "Rahul Kumar", "Marketing"],
                            ["PS", "Priya Singh", "Design"],
                          ].map(([initials, name, department], index) => (

                            <div
                              key={index}
                              className="flex items-center gap-3 py-2 border-t border-slate-50"
                            >

                              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[9px] font-bold text-orange-700">
                                {initials}
                              </div>

                              <div className="flex-1">

                                <div className="text-[10px] font-semibold">
                                  {name}
                                </div>

                                <div className="text-[8px] text-slate-400">
                                  {department}
                                </div>

                              </div>

                              <div className="w-2 h-2 rounded-full bg-green-500" />

                            </div>

                          ))}

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* FLOATING ATTENDANCE */}

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -left-8 bottom-16 hidden sm:block bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-48"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">

                        <UserCheck
                          className="w-5 h-5"
                          style={{ color: ORANGE }}
                        />

                      </div>

                      <div>

                        <div className="text-xs text-slate-400">
                          Attendance
                        </div>

                        <div className="font-bold text-lg">
                          94.8%
                        </div>

                      </div>

                    </div>

                  </motion.div>

                  {/* FLOATING TASK */}

                  <motion.div
                    animate={{ y: [0, -7, 0] }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -right-8 top-20 hidden sm:block bg-white border border-slate-200 rounded-2xl shadow-xl p-4 w-48"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">

                        <ClipboardList
                          className="w-5 h-5"
                          style={{ color: ORANGE }}
                        />

                      </div>

                      <div>

                        <div className="text-xs text-slate-400">
                          Tasks Completed
                        </div>

                        <div className="font-bold text-lg">
                          86%
                        </div>

                      </div>

                    </div>

                  </motion.div>

                </motion.div>

              </motion.div>

            </div>

          </div>

        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}

        <section
          id="features"
          className="py-28 bg-[#F8FAFC] scroll-mt-20"
        >

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-14"
            >

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 mb-4">

                <span className="w-8 h-px bg-orange-500" />

                POWERFUL FEATURES

              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">

                Everything your team needs to manage work better.

              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">

                Bring employee information, daily operations and workforce
                management into one simple and organized platform.

              </p>

            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

              {features.map((feature, index) => {

                const Icon = feature.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.07 }}
                    whileHover={{ y: -6 }}
                    className="group bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-orange-500/5 transition-all"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-orange-50 group-hover:bg-orange-500 flex items-center justify-center transition-colors">

                      <Icon className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" />

                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {feature.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">

                      Learn more

                      <ArrowRight className="w-3.5 h-3.5" />

                    </div>

                  </motion.div>
                );

              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}

        <section
          id="about"
          className="py-28 bg-white scroll-mt-20"
        >

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

            <div className="grid lg:grid-cols-2 gap-16 items-center">

              {/* ANALYTICS CARD */}

              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >

                <div className="rounded-[32px] bg-[#17120F] p-7 sm:p-9 overflow-hidden">

                  <div className="relative">

                    <div className="flex items-center justify-between mb-8">

                      <div>

                        <div className="text-xs text-slate-400 uppercase tracking-wider">
                          Workforce Analytics
                        </div>

                        <div className="text-2xl font-bold text-white mt-2">
                          Team Performance
                        </div>

                      </div>

                      <div className="w-11 h-11 rounded-xl bg-orange-500/20 flex items-center justify-center">

                        <BarChart3
                          className="w-5 h-5"
                          style={{ color: "#FB923C" }}
                        />

                      </div>

                    </div>

                    <div className="flex items-end gap-3 h-56">

                      {[45, 55, 48, 70, 65, 82, 75, 92, 85, 96].map(
                        (height, index) => (

                          <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${height}%` }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.8,
                              delay: index * 0.06,
                            }}
                            className="flex-1 rounded-t-lg"
                            style={{
                              backgroundColor:
                                index % 2 === 0
                                  ? ORANGE
                                  : "#FB923C",
                            }}
                          />

                        )
                      )}

                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-7">

                      <div className="rounded-2xl bg-white/5 p-4">

                        <div className="text-xs text-slate-400">
                          Productivity
                        </div>

                        <div className="text-xl text-white font-bold mt-1">
                          92%
                        </div>

                      </div>

                      <div className="rounded-2xl bg-white/5 p-4">

                        <div className="text-xs text-slate-400">
                          Attendance
                        </div>

                        <div className="text-xl text-white font-bold mt-1">
                          95%
                        </div>

                      </div>

                      <div className="rounded-2xl bg-white/5 p-4">

                        <div className="text-xs text-slate-400">
                          Tasks
                        </div>

                        <div className="text-xl text-white font-bold mt-1">
                          86%
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                <div className="absolute -bottom-7 -right-5 hidden sm:block bg-white rounded-2xl border border-slate-200 shadow-xl p-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">

                      <Award
                        className="w-5 h-5"
                        style={{ color: ORANGE }}
                      />

                    </div>

                    <div>

                      <div className="text-xs text-slate-400">
                        Performance
                      </div>

                      <div className="font-bold">
                        Improving
                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>

              {/* TEXT */}

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 mb-5">

                  <span className="w-8 h-px bg-orange-500" />

                  WHY SHNOOR INTERNATIONAL LLC

                </div>

                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">

                  One platform.

                  <span className="block text-orange-600">
                    Complete visibility.
                  </span>

                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">

                  Managing employees across multiple systems can be
                  complicated. Our Employee Management System brings
                  important workforce operations together in one organized
                  platform.

                </p>

                <div className="mt-8 space-y-5">

                  {[
                    {
                      icon: ShieldCheck,
                      title: "Secure role-based access",
                      text: "Give Admins, Managers and Employees access to the tools they need.",
                    },
                    {
                      icon: Search,
                      title: "Centralized information",
                      text: "Find employee records, attendance, tasks and requests without switching systems.",
                    },
                    {
                      icon: TrendingUp,
                      title: "Better decisions",
                      text: "Use structured information and reports to understand workforce performance.",
                    },
                  ].map((item, index) => {

                    const Icon = item.icon;

                    return (
                      <div
                        key={index}
                        className="flex gap-4"
                      >

                        <div className="w-11 h-11 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center">

                          <Icon
                            className="w-5 h-5"
                            style={{ color: ORANGE }}
                          />

                        </div>

                        <div>

                          <h3 className="font-bold">
                            {item.title}
                          </h3>

                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {item.text}
                          </p>

                        </div>

                      </div>
                    );

                  })}

                </div>

              </motion.div>

            </div>

          </div>

        </section>

        {/* =====================================================
            HOW IT WORKS
        ====================================================== */}

        <section
          id="how-it-works"
          className="py-28 bg-[#17120F] text-white scroll-mt-20"
        >

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mb-16"
            >

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 mb-4">

                <span className="w-8 h-px bg-orange-400" />

                SIMPLE WORKFLOW

              </div>

              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">

                From employee data to better management.

              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-400">

                A straightforward workflow that keeps your organization
                organized from onboarding to performance management.

              </p>

            </motion.div>

            <div className="grid md:grid-cols-4 gap-6">

              {steps.map((step, index) => (

                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >

                  {index !== steps.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-[calc(100%-5px)] w-full h-px bg-white/10" />
                  )}

                  <div
                    className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg shadow-orange-900/20"
                    style={{ backgroundColor: ORANGE }}
                  >
                    {step.number}
                  </div>

                  <h3 className="mt-7 text-xl font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {step.description}
                  </p>

                </motion.div>

              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            FAQ
        ====================================================== */}

        <section className="py-28 bg-[#F8FAFC]">

          <div className="max-w-4xl mx-auto px-5 sm:px-8">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >

              <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 mb-4">

                <span className="w-8 h-px bg-orange-500" />

                FAQ

                <span className="w-8 h-px bg-orange-500" />

              </div>

              <h2 className="text-4xl font-bold">
                Frequently asked questions
              </h2>

              <p className="mt-4 text-slate-500">
                Everything you need to know about the platform.
              </p>

            </motion.div>

            <div className="space-y-3">

              {faqs.map((faq, index) => {

                const isOpen = activeFaq === index;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                  >

                    <button
                      onClick={() =>
                        setActiveFaq(isOpen ? null : index)
                      }
                      className="w-full px-6 py-5 flex items-center justify-between text-left"
                    >

                      <span className="font-semibold">
                        {faq.question}
                      </span>

                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${
                          isOpen ? "rotate-180 text-orange-500" : ""
                        }`}
                      />

                    </button>

                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                          opacity: 1,
                          height: "auto",
                        }}
                        className="px-6 pb-6"
                      >

                        <p className="text-sm leading-7 text-slate-500">
                          {faq.answer}
                        </p>

                      </motion.div>
                    )}

                  </motion.div>
                );

              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            CTA
        ====================================================== */}

        <section className="py-20 bg-white">

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-[32px] px-7 py-14 sm:px-12 text-center"
              style={{ backgroundColor: ORANGE }}
            >

              <div className="absolute top-[-100px] left-[-100px] w-64 h-64 rounded-full bg-white/10 blur-2xl" />

              <div className="absolute bottom-[-100px] right-[-50px] w-72 h-72 rounded-full bg-white/10 blur-2xl" />

              <div className="relative">

                <Sparkles className="w-7 h-7 text-white/80 mx-auto mb-5" />

                <h2 className="text-3xl sm:text-5xl font-bold text-white">

                  Ready to manage your workforce better?

                </h2>

                <p className="mt-5 text-orange-100 max-w-2xl mx-auto leading-7">

                  Bring your employees, tasks, attendance and performance
                  together with a modern employee management platform.

                </p>

                <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white font-bold hover:bg-orange-50 transition-all"
                    style={{ color: DARK_ORANGE }}
                  >

                    Create Account

                    <ArrowRight className="w-5 h-5" />

                  </Link>

                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-orange-700 text-white font-semibold hover:bg-orange-800 transition-all"
                  >
                    Sign In
                  </Link>

                </div>

              </div>

            </motion.div>

          </div>

        </section>

        {/* =====================================================
            CONTACT
        ====================================================== */}

        <section
          id="contact"
          className="py-28 bg-[#F8FAFC] scroll-mt-20"
        >

          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

            <div className="grid lg:grid-cols-2 gap-16">

              {/* CONTACT INFO */}

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >

                <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 mb-5">

                  <span className="w-8 h-px bg-orange-500" />

                  GET IN TOUCH

                </div>

                <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">

                  Let's build a better workplace.

                </h2>

                <p className="mt-5 text-lg leading-8 text-slate-600 max-w-xl">

                  Have questions about our Employee Management System?
                  Get in touch with the SHNOOR INTERNATIONAL LLC team.

                </p>

                <div className="mt-10 space-y-6">

                  {/* EMAIL */}

                  <a
                    href="mailto:shnoor@gmail.com"
                    className="flex items-center gap-4 group"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-orange-500 transition-colors">

                      <Mail className="w-5 h-5 text-slate-700 group-hover:text-white" />

                    </div>

                    <div>

                      <div className="text-xs text-slate-400 uppercase tracking-wider">
                        Email
                      </div>

                      <div className="font-semibold text-slate-800">
                        shnoor@gmail.com
                      </div>

                    </div>

                  </a>

                  {/* PHONE */}

                  <a
                    href="tel:180034342826"
                    className="flex items-center gap-4 group"
                  >

                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center group-hover:bg-orange-500 transition-colors">

                      <Phone className="w-5 h-5 text-slate-700 group-hover:text-white" />

                    </div>

                    <div>

                      <div className="text-xs text-slate-400 uppercase tracking-wider">
                        Phone
                      </div>

                      <div className="font-semibold text-slate-800">
                        1800-3434-2826
                      </div>

                    </div>

                  </a>

                  {/* LOCATION */}

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">

                      <MapPin className="w-5 h-5 text-orange-600" />

                    </div>

                    <div>

                      <div className="text-xs text-slate-400 uppercase tracking-wider">
                        Location
                      </div>

                      <div className="font-semibold text-slate-800">
                        Hyderabad, India
                      </div>

                    </div>

                  </div>

                </div>

              </motion.div>

              {/* CONTACT FORM */}

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[28px] border border-slate-200 shadow-xl shadow-slate-900/5 p-7 sm:p-9"
              >

                <div className="flex items-center gap-3 mb-7">

                  <div className="w-11 h-11 rounded-xl bg-orange-50 flex items-center justify-center">

                    <Mail
                      className="w-5 h-5"
                      style={{ color: ORANGE }}
                    />

                  </div>

                  <div>

                    <h3 className="font-bold text-lg">
                      Contact our team
                    </h3>

                    <p className="text-sm text-slate-400">
                      We'll get back to you soon.
                    </p>

                  </div>

                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    window.location.href =
                      "mailto:shnoor@gmail.com?subject=Employee Management System Inquiry";
                  }}
                  className="space-y-5"
                >

                  <div className="grid sm:grid-cols-2 gap-4">

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Your Name
                      </label>

                      <input
                        type="text"
                        placeholder="Enter your name"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />

                    </div>

                    <div>

                      <label className="block text-sm font-semibold mb-2">
                        Email
                      </label>

                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                      />

                    </div>

                  </div>

                  <div>

                    <label className="block text-sm font-semibold mb-2">
                      Subject
                    </label>

                    <input
                      type="text"
                      placeholder="How can we help?"
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all"
                    />

                  </div>

                  <div>

                    <label className="block text-sm font-semibold mb-2">
                      Message
                    </label>

                    <textarea
                      rows="5"
                      placeholder="Write your message..."
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all resize-none"
                    />

                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                    style={{ backgroundColor: ORANGE }}
                  >

                    Send Message

                    <ArrowRight className="w-4 h-4" />

                  </button>

                </form>

              </motion.div>

            </div>

          </div>

        </section>

      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="bg-[#17120F] text-white">

        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">

            {/* BRAND */}

            <div className="lg:col-span-2">

              <div className="flex items-center gap-3">

                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: ORANGE }}
                >
                  <Users className="w-5 h-5 text-white" />
                </div>

                <div>

                  <div className="font-bold text-lg">
                    SHNOOR
                  </div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-orange-400">
                    INTERNATIONAL LLC
                  </div>

                </div>

              </div>

              <p className="mt-6 text-sm leading-7 text-slate-400 max-w-md">

                A modern employee management platform designed to
                simplify workforce operations and help organizations
                work smarter.

              </p>

              <div className="mt-6 flex items-center gap-3">

                <a
                  href="mailto:shnoor@gmail.com"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                </a>

                <a
                  href="tel:180034342826"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-orange-500 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>

              </div>

            </div>

            {/* PLATFORM */}

            <div>

              <h3 className="font-semibold mb-5">
                Platform
              </h3>

              <div className="space-y-3 text-sm text-slate-400">

                <button
                  onClick={() => scrollToSection("features")}
                  className="block hover:text-orange-400 transition-colors"
                >
                  Features
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block hover:text-orange-400 transition-colors"
                >
                  How It Works
                </button>

                <Link
                  to="/login"
                  className="block hover:text-orange-400 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="block hover:text-orange-400 transition-colors"
                >
                  Create Account
                </Link>

              </div>

            </div>

            {/* CONTACT */}

            <div>

              <h3 className="font-semibold mb-5">
                Contact
              </h3>

              <div className="space-y-4 text-sm text-slate-400">

                <a
                  href="mailto:shnoor@gmail.com"
                  className="flex gap-3 hover:text-orange-400 transition-colors"
                >

                  <Mail className="w-4 h-4 mt-0.5 shrink-0" />

                  <span>
                    shnoor@gmail.com
                  </span>

                </a>

                <a
                  href="tel:180034342826"
                  className="flex gap-3 hover:text-orange-400 transition-colors"
                >

                  <Phone className="w-4 h-4 mt-0.5 shrink-0" />

                  <span>
                    1800-3434-2826
                  </span>

                </a>

                <div className="flex gap-3">

                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-orange-400" />

                  <span>
                    Hyderabad, India
                  </span>

                </div>

              </div>

            </div>

          </div>

          <div className="border-t border-white/10 mt-14 pt-7 flex flex-col sm:flex-row items-center justify-between gap-4">

            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} SHNOOR INTERNATIONAL LLC. All rights reserved.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500">

              <span>
                Employee Management System
              </span>

              <span>•</span>

              <span className="text-orange-400">
                SHNOOR INTERNATIONAL LLC
              </span>

            </div>

          </div>

        </div>

      </footer>

    </div>
  );
};

export default Landing;