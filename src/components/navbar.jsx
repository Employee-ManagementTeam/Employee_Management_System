function Navbar() {
  const username =
    localStorage.getItem("username") || "Administrator";

  const role =
    localStorage.getItem("role") || "Admin";

  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-gray-200 bg-white shadow-sm">

      <div className="flex h-full items-center justify-between px-8">

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Admin Portal
          </h2>

          <p className="text-sm text-gray-500">
            Manage your organization
          </p>
        </div>

        <div className="flex items-center gap-6">

          {/* Notification */}
          <button className="relative rounded-full p-2 text-gray-500 transition hover:bg-orange-50 hover:text-orange-600">
            🔔

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-orange-500" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-gray-200 pl-6">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
              {username.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-gray-800">
                {username}
              </p>

              <p className="text-xs capitalize text-gray-500">
                {role}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;