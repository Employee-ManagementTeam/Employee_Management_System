import { Link } from "react-router-dom";

const features = [
  {
    title: "Employee Management",
    description:
      "Manage employee profiles, departments, designations, joining details, and employment status from one centralized system.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Smart Attendance",
    description:
      "Track employee check-in, check-out, attendance status, and daily records with QR-based attendance support.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M7 2v4M17 2v4M3 9h18" />
        <path d="M8 13h2M14 13h2M8 17h2M14 17h2" />
      </svg>
    ),
  },
  {
    title: "Leave Management",
    description:
      "Employees can submit leave requests while managers and administrators can review and manage approvals.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M6 2v4M18 2v4" />
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 15h3M13 15h3" />
      </svg>
    ),
  },
  {
    title: "Task Management",
    description:
      "Assign, monitor, update, and manage employee tasks with clear status tracking and progress visibility.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: "Performance",
    description:
      "Maintain employee performance records and give managers a clear overview of employee progress.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5" />
        <path d="M4 17l5-5 4 3 7-8" />
        <path d="M16 7h4v4" />
      </svg>
    ),
  },
  {
    title: "Reports & Insights",
    description:
      "Generate organized reports for attendance, leave, payroll, employees, and other HR operations.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 19V5" />
        <path d="M4 19h16" />
        <path d="M8 16v-5M12 16V7M16 16v-3M20 16V4" />
      </svg>
    ),
  },
];

const roles = [
  {
    number: "01",
    title: "Administrator",
    subtitle: "Complete organization control",
    description:
      "Manage employees, departments, attendance, leaves, payroll, reports, notifications, documents, and system activity.",
  },
  {
    number: "02",
    title: "Manager",
    subtitle: "Team management workspace",
    description:
      "Monitor team attendance, assign tasks, review performance, manage leave requests, and access team reports.",
  },
  {
    number: "03",
    title: "Employee",
    subtitle: "Personal self-service portal",
    description:
      "Manage attendance, tasks, leave applications, performance, documents, payroll information, and profile details.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">

      {/* ================= ANNOUNCEMENT ================= */}
      <div className="border-b border-orange-100 bg-[#fff7f2]">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-2.5 text-center">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="rounded-full bg-orange-600 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-white">
              EMS
            </span>
            <span>
              A centralized platform for modern employee management.
            </span>
          </div>
        </div>
      </div>

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 shadow-md shadow-orange-100">
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">
                Employee<span className="text-orange-600">MS</span>
              </p>

              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                People Management
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#home"
              className="text-sm font-semibold text-slate-600 transition hover:text-orange-600"
            >
              Home
            </a>

            <a
              href="#about"
              className="text-sm font-semibold text-slate-600 transition hover:text-orange-600"
            >
              About Us
            </a>

            <a
              href="#features"
              className="text-sm font-semibold text-slate-600 transition hover:text-orange-600"
            >
              Features
            </a>

            <a
              href="#roles"
              className="text-sm font-semibold text-slate-600 transition hover:text-orange-600"
            >
              Roles
            </a>

            <a
              href="#contact"
              className="text-sm font-semibold text-slate-600 transition hover:text-orange-600"
            >
              Contact
            </a>
          </nav>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700"
            >
              Get started
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* ================= HOME / HERO ================= */}
        <section
          id="home"
          className="relative overflow-hidden border-b border-slate-200 bg-white"
        >
          <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-orange-100/30 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-orange-50/40 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

            {/* Hero content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-orange-700">
                <span className="h-2 w-2 rounded-full bg-orange-600" />
                Modern HR Management Platform
              </div>

              <h1 className="max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Manage your people.
                <span className="block text-orange-600">
                  Simplify your workplace.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
                EmployeeMS brings employee management, attendance, leave,
                tasks, performance, documents, payroll, and reports together
                in one centralized HR platform.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-700"
                >
                  Enter People Portal
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
                >
                  Explore Features
                </a>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
                {[
                  "Role-based access",
                  "Attendance tracking",
                  "Centralized records",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-sm text-slate-500"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-50 text-xs font-bold text-orange-600">
                      ✓
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative">
              <div className="relative mx-auto max-w-lg">
                <div className="rounded-[2rem] border border-slate-200 bg-[#fcfcfc] p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] sm:p-8">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-600">
                        People Portal
                      </p>

                      <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
                        Your workforce,
                        <br />
                        connected.
                      </h3>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                      >
                        <circle cx="9" cy="8" r="3.5" />
                        <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
                        <circle cx="17.5" cy="9" r="2.5" />
                        <path d="M15 20a4 4 0 0 1 7 0" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative mt-8 h-52 overflow-hidden rounded-2xl bg-white">
                    <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-orange-50" />
                    <div className="absolute bottom-0 right-3 h-28 w-28 rounded-full bg-orange-100/70" />

                    <div className="absolute left-12 top-14 flex h-20 w-20 items-center justify-center rounded-full border-8 border-white bg-orange-500 shadow-lg shadow-orange-100">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-9 w-9 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="8" r="3.5" />
                        <path d="M5 21a7 7 0 0 1 14 0" />
                      </svg>
                    </div>

                    <div className="absolute left-36 top-6 flex h-16 w-16 items-center justify-center rounded-full border-8 border-white bg-slate-800 shadow-md">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="8" r="3" />
                        <path d="M6 20a6 6 0 0 1 12 0" />
                      </svg>
                    </div>

                    <div className="absolute bottom-5 left-28 flex h-14 w-14 items-center justify-center rounded-full border-8 border-white bg-orange-300 shadow-md">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <circle cx="12" cy="8" r="3" />
                        <path d="M6 20a6 6 0 0 1 12 0" />
                      </svg>
                    </div>

                    <div className="absolute left-[108px] top-[87px] h-[2px] w-[48px] bg-orange-200" />
                    <div className="absolute left-[86px] top-[116px] h-[52px] w-[2px] bg-orange-200" />
                    <div className="absolute left-[109px] bottom-[49px] h-[2px] w-[48px] bg-orange-200" />

                    <div className="absolute bottom-4 right-4 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-lg">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs font-bold text-slate-700">
                          Team connected
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-slate-400">
                        One system for HR operations
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      ["24/7", "Access"],
                      ["100%", "Centralized"],
                      ["3", "User roles"],
                    ].map(([value, label]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-slate-100 bg-white p-3"
                      >
                        <p className="text-sm font-extrabold text-orange-600">
                          {value}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="absolute -bottom-5 -left-4 rounded-2xl border border-orange-100 bg-white px-4 py-3 shadow-xl sm:-left-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        HR operations simplified
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Employees · Managers · Admins
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT US ================= */}
        <section
          id="about"
          className="border-b border-slate-200 bg-[#fffaf7]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">

              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                  About Us
                </span>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  Making employee management
                  <span className="block text-orange-600">
                    simpler and smarter.
                  </span>
                </h2>

                <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                   EmployeeMS is a web-based application that helps organizations manage employee information, departments, attendance, leave, tasks, performance, and payroll-related records through a centralized platform. It provides separate dashboards for administrators, managers, and employees to simplify daily HR and workforce management.
                </p>

                <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
                  From employee records and attendance to leave management,
                  tasks, performance, documents, payroll, notifications, and
                  reports, the system helps organizations keep their workforce
                  information organized and accessible.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-orange-100 bg-white px-5 py-3">
                    <p className="text-lg font-black text-orange-600">
                      Admin
                    </p>
                    
                  </div>

                  <div className="rounded-xl border border-orange-100 bg-white px-5 py-3">
                    <p className="text-lg font-black text-orange-600">
                      Manager
                    </p>
                    
                  </div>

                  <div className="rounded-xl border border-orange-100 bg-white px-5 py-3">
                    <p className="text-lg font-black text-orange-600">
                      Employee
                    </p>
                    
                  </div>
                </div>
              </div>

              {/* About visual */}
              <div className="rounded-3xl border border-orange-100 bg-white p-8 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-2xl bg-orange-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="12" cy="7" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    </div>

                    <h3 className="mt-5 font-extrabold text-slate-900">
                      People First
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Designed around the everyday needs of employees and HR
                      teams.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M4 19V5" />
                        <path d="M4 19h16" />
                        <path d="M8 16v-5M12 16V7M16 16v-3M20 16V4" />
                      </svg>
                    </div>

                    <h3 className="mt-5 font-extrabold text-slate-900">
                      Organized Data
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Keep important employee and operational information
                      organized in one place.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 3v18M3 12h18" />
                        <circle cx="12" cy="12" r="9" />
                      </svg>
                    </div>

                    <h3 className="mt-5 font-extrabold text-slate-900">
                      Connected Teams
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Administrators, managers, and employees work through
                      dedicated role-based experiences.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-orange-50 p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-600 text-white">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z" />
                        <path d="M9 12l2 2 4-4" />
                      </svg>
                    </div>

                    <h3 className="mt-5 font-extrabold text-slate-900">
                      Role Based Access
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      Users access the workspace and operations relevant to
                      their responsibilities.
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-4 lg:px-8">
            {[
              ["01", "Employee records", "Centralized workforce information"],
              ["02", "Attendance", "Daily check-in and check-out"],
              ["03", "Operations", "Tasks, leave and performance"],
              ["04", "Reports", "Organized HR insights"],
            ].map(([number, title, description], index) => (
              <div
                key={title}
                className={`flex gap-4 px-4 py-7 ${
                  index !== 0
                    ? "border-t border-slate-100 lg:border-l lg:border-t-0"
                    : ""
                }`}
              >
                <span className="text-xs font-black text-orange-600">
                  {number}
                </span>

                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
        >
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
              Core capabilities
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Everything your HR team needs
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Keep employee operations organized through one connected,
              professional management platform.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition group-hover:bg-orange-600 group-hover:text-white">
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-base font-extrabold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {feature.description}
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs font-bold text-orange-600">
                  Available module
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 10h12M11 5l5 5-5 5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= ROLES ================= */}
        <section id="roles" className="border-y border-slate-200 bg-[#f8f8f8]">
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">

              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                  Built for every role
                </span>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                  The right workspace
                  <br />
                  for every user.
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                  EmployeeMS separates responsibilities while keeping all
                  workforce data connected through a single platform.
                </p>

                <Link
                  to="/login"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-100 transition hover:bg-orange-700"
                >
                  Open People Portal
                  <svg
                    viewBox="0 0 20 20"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 10h12M11 5l5-5" />
                  </svg>
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {roles.map((role) => (
                  <div
                    key={role.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-600">
                      {role.number}
                    </div>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                      {role.subtitle}
                    </p>

                    <h3 className="mt-1 text-lg font-black text-slate-900">
                      {role.title}
                    </h3>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ================= PEOPLE PORTAL ================= */}
        <section
          id="portal"
          className="mx-auto max-w-7xl px-6 py-20 lg:px-8"
        >
          <div className="overflow-hidden rounded-3xl bg-[#1f1f1f]">
            <div className="grid items-center gap-10 px-7 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-14">

              <div>
                <span className="inline-flex rounded-full bg-orange-600/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-400">
                  People Portal
                </span>

                <h2 className="mt-4 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                  A single place for your everyday employee needs.
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Access attendance, tasks, leave requests, performance,
                  documents, payroll information, notifications, and profile
                  details through your personalized workspace.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-700"
                  >
                    Sign in to People Portal
                    <svg
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M4 10h12M11 5l5 5-5 5" />
                    </svg>
                  </Link>

                  <Link
                    to="/register"
                    className="inline-flex items-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-bold text-white transition hover:border-orange-500 hover:text-orange-400"
                  >
                    Create account
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex lg:h-48 lg:w-48 lg:items-center lg:justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-orange-600/20">
                  <div className="absolute h-28 w-28 rounded-full border border-orange-600/20" />

                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-600 shadow-xl shadow-orange-900/30">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-10 w-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <circle cx="12" cy="8" r="3.5" />
                      <path d="M5 21a7 7 0 0 1 14 0" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= CONTACT ================= */}
        <section
          id="contact"
          className="border-t border-slate-200 bg-[#fffaf7]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

            <div className="mx-auto max-w-2xl text-center">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                Contact Us
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                Let’s connect.
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
                Have questions about EmployeeMS or need assistance with the
                platform? Our team is here to help.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">

              <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>
                </div>

                <h3 className="mt-5 font-extrabold text-slate-900">
                  Email
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Contact the organization through its official communication
                  channel.
                </p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </div>

                <h3 className="mt-5 font-extrabold text-slate-900">
                  Organization
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  SHNOOR INTERNATIONAL LLC
                </p>
              </div>

              <div className="rounded-2xl border border-orange-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>

                <h3 className="mt-5 font-extrabold text-slate-900">
                  Support
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Assistance for employees and HR operations.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-5xl px-6 py-20 text-center">

            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
              Employee Management System
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Simplify employee management.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
              Connect your workforce, organize daily operations, and manage
              employee information from one professional platform.
            </p>

            <div className="mt-7 flex justify-center gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-700"
              >
                Sign in
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-orange-200 hover:text-orange-600"
              >
                Register
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800 bg-[#181818] text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">

          <div>
            <p className="font-bold text-white">
              Employee<span className="text-orange-600">MS</span>
            </p>

            <p className="mt-1 text-xs">
              Employee Management System
            </p>

            <p className="mt-1 text-xs text-slate-500">
              SHNOOR INTERNATIONAL LLC
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <a
              href="#home"
              className="transition hover:text-orange-400"
            >
              Home
            </a>

            <a
              href="#about"
              className="transition hover:text-orange-400"
            >
              About
            </a>

            <a
              href="#features"
              className="transition hover:text-orange-400"
            >
              Features
            </a>

            <a
              href="#contact"
              className="transition hover:text-orange-400"
            >
              Contact
            </a>

            <Link
              to="/terms"
              className="transition hover:text-orange-400"
            >
              Terms
            </Link>

            <Link
              to="/privacy-policy"
              className="transition hover:text-orange-400"
            >
              Privacy
            </Link>
          </div>

          <div className="text-xs">
            © {new Date().getFullYear()} EmployeeMS. All rights reserved.
          </div>

        </div>
      </footer>

    </div>
  );
}

export default Landing;