function Navbar({ user }) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">

      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-right">
          <p className="font-semibold text-gray-800">
            {user?.username || "User"}
          </p>

          <p className="text-sm text-gray-500">
            {user?.role || "Employee"}
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </div>

      </div>

    </header>
  );
}

export default Navbar;