import { useEffect, useRef, useState } from "react";
import EmployeeSidebar from "../../components/EmployeeSidebar";
import Navbar from "../../components/navbar";
import { getEmployees, getEmployee } from "../../api/api";

const API_BASE_URL = "http://127.0.0.1:5000";

function Profile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [imageError, setImageError] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      const response = await getEmployees();

      const employees = Array.isArray(response)
        ? response
        : response.employees ||
          response.data ||
          [];

      const current = employees.find(
        (item) =>
          String(item.user_id) === String(userId) ||
          String(item.userId) === String(userId)
      );

      if (!current) {
        throw new Error(
          "Employee profile was not found."
        );
      }

      const employeeId =
        current.id ||
        current.employee_id ||
        current._id;

      const detailed = await getEmployee(employeeId);

      const employeeData =
        detailed.employee ||
        detailed.data ||
        detailed;

      setEmployee(employeeData);

      // Look for an image already supplied by the backend.
      const backendImage =
        employeeData.profile_image ||
        employeeData.profile_picture ||
        employeeData.photo ||
        employeeData.image ||
        employeeData.avatar ||
        "";

      if (backendImage) {
        setProfilePicture(buildImageUrl(backendImage));
      } else {
        // Fallback to a browser-stored photo for this employee.
        const savedImage = localStorage.getItem(
          `employeeProfilePicture_${employeeId}`
        );

        if (savedImage) {
          setProfilePicture(savedImage);
        }
      }
    } catch (err) {
      setError(
        err.message || "Failed to load profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const buildImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${API_BASE_URL}${image}`;
    }

    return `${API_BASE_URL}/${image}`;
  };

  const getInitials = () => {
    if (!employee) {
      return "E";
    }

    const firstName =
      employee.first_name ||
      employee.firstName ||
      "";

    const lastName =
      employee.last_name ||
      employee.lastName ||
      "";

    const username =
      employee.username ||
      "";

    const initials = `${firstName.charAt(
      0
    )}${lastName.charAt(0)}`.trim();

    if (initials) {
      return initials.toUpperCase();
    }

    return (
      username.charAt(0) ||
      "E"
    ).toUpperCase();
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      setProfilePicture(imageData);
      setImageError(false);
      setError("");

      const employeeId =
        employee?.id ||
        employee?.employee_id ||
        employee?._id;

      if (employeeId) {
        localStorage.setItem(
          `employeeProfilePicture_${employeeId}`,
          imageData
        );
      }
    };

    reader.onerror = () => {
      setError("Unable to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    const employeeId =
      employee?.id ||
      employee?.employee_id ||
      employee?._id;

    if (employeeId) {
      localStorage.removeItem(
        `employeeProfilePicture_${employeeId}`
      );
    }

    setProfilePicture("");
    setImageError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const fullName = [
    employee?.first_name,
    employee?.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const displayName =
    fullName ||
    employee?.username ||
    "Employee";

  const employeeCode =
    employee?.employee_code ||
    employee?.employeeCode ||
    employee?.code ||
    "Not provided";

  const phone =
    employee?.phone ||
    employee?.mobile ||
    employee?.phone_number ||
    "Not provided";

  const department =
    employee?.department ||
    employee?.department_name ||
    "Not provided";

  const designation =
    employee?.designation ||
    employee?.job_title ||
    "Not provided";

  const joiningDate =
    employee?.joining_date ||
    employee?.joiningDate ||
    "Not provided";

  const employmentStatus =
    employee?.employment_status ||
    employee?.status ||
    "Not provided";

  const address =
    employee?.address ||
    "Not provided";

  const email =
    employee?.email ||
    "Not provided";

  const getStatusStyle = (status) => {
    const normalized = String(
      status || ""
    ).toLowerCase();

    if (
      normalized === "active" ||
      normalized === "approved"
    ) {
      return "border-green-100 bg-green-50 text-green-700";
    }

    if (
      normalized === "inactive" ||
      normalized === "terminated"
    ) {
      return "border-red-100 bg-red-50 text-red-700";
    }

    return "border-orange-100 bg-orange-50 text-orange-700";
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <EmployeeSidebar />
      <Navbar />

      <main className="ml-64 pt-20">
        <div className="mx-auto max-w-7xl p-6 lg:p-8">

          {/* ======================================================
              PAGE HEADER
          ====================================================== */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-orange-600" />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-600">
                Employee Portal
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View your employee information, contact details,
              employment information, and profile photo.
            </p>
          </div>

          {/* ======================================================
              ERROR
          ====================================================== */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                !
              </span>

              <div>
                <p className="text-sm font-bold">
                  Profile message
                </p>

                <p className="mt-1 text-xs leading-5 text-red-600">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* ======================================================
              LOADING
          ====================================================== */}
          {loading ? (
            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
                <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
              </div>
            </div>
          ) : employee ? (
            <>
              {/* ==================================================
                  PROFILE HEADER CARD
              ================================================== */}
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="h-2 bg-orange-600" />

                <div className="p-6 lg:p-8">
                  <div className="flex flex-col gap-7 md:flex-row md:items-center">

                    {/* Profile photo */}
                    <div className="relative flex w-fit shrink-0 flex-col items-center">
                      <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-orange-50 text-3xl font-black text-orange-600 shadow-lg ring-1 ring-slate-200">
                        {profilePicture && !imageError ? (
                          <img
                            src={profilePicture}
                            alt={displayName}
                            className="h-full w-full object-cover"
                            onError={() =>
                              setImageError(true)
                            }
                          />
                        ) : (
                          getInitials()
                        )}
                      </div>

                      {/* Camera button */}
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                        className="absolute bottom-0 right-1 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-orange-600 text-white shadow-md transition hover:bg-orange-700"
                        title="Change profile photo"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M4 7h3l2-2h6l2 2h3v11H4z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />

                      {/* Photo actions */}
                      <div className="mt-4 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            fileInputRef.current?.click()
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                        >
                          Change Photo
                        </button>

                        {profilePicture && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <p className="mt-2 text-center text-[10px] text-slate-400">
                        JPG, PNG or WEBP · Max 5 MB
                      </p>
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                          {displayName}
                        </h2>

                        <span
                          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(
                            employmentStatus
                          )}`}
                        >
                          {employmentStatus}
                        </span>
                      </div>

                      <p className="mt-2 text-base font-semibold text-orange-600">
                        {designation}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {department}
                      </p>

                      <div className="mt-6 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Employee Code
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {employeeCode}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Joining Date
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-800">
                            {joiningDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Profile status */}
                    <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-5 md:min-w-[190px]">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M12 3l8 4v5c0 4.5-3.1 7.8-8 9-4.9-1.2-8-4.5-8-9V7l8-4z" />
                          <path d="M9 12l2 2 4-4" />
                        </svg>
                      </div>

                      <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-orange-700">
                        Account Status
                      </p>

                      <p className="mt-1 text-sm font-extrabold text-slate-800">
                        {employmentStatus}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        Employee information is managed through the central HR system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  INFORMATION CARDS
              ================================================== */}
              <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Personal Information */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Personal Information
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Your basic employee information
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        First Name
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {employee.first_name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Last Name
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {employee.last_name || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Phone
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employment Information */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <rect x="3" y="6" width="18" height="14" rx="2" />
                        <path d="M8 6V4h8v2" />
                        <path d="M3 11h18" />
                      </svg>
                    </div>

                    <div>
                      <h2 className="text-lg font-extrabold text-slate-900">
                        Employment Information
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Your role and organization details
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 p-6 sm:grid-cols-2">

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Employee Code
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {employeeCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Department
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {department}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Designation
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {designation}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Joining Date
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-800">
                        {joiningDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  CONTACT / ADDRESS
              ================================================== */}
              <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-slate-900">
                      Contact & Address
                    </h2>

                    <p className="mt-1 text-xs text-slate-400">
                      Employee contact information
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Phone
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-800">
                      {phone}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Email
                    </p>

                    <p className="mt-2 break-all text-sm font-semibold text-slate-800">
                      {email}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 md:col-span-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Address
                    </p>

                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                      {address}
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}
              <div className="mt-8 border-t border-slate-200 pt-5">
                <p className="text-xs text-slate-400">
                  EmployeeMS · Employee Profile
                </p>
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default Profile;