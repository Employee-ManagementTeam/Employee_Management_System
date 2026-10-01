import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const data = JSON.parse(savedUser);
      setUser(data.user);
    }
  }, []);

  if (!user) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No user information available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          My Profile
        </h1>

        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="mb-5">
            <p className="text-sm text-gray-500">Username</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.username}
            </p>
          </div>

          <div className="mb-5">
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-semibold text-gray-800">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-semibold text-gray-800 capitalize">
              {user.role}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;