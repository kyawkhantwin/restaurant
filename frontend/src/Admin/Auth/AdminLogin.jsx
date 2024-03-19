import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Url, user } from "../../config";
import axios from "axios";
import { showToast } from "../../components/Toast";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  useEffect(() => {
    if (user && user.userType === "admin") {
      showToast('warning',"Alredy Login")
      navigate("/admin/");
    }else if (user && user.userType !== "admin") {
      showToast('error', "Unauthorized Access" )
      navigate("/admin/");
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = { password, email };

    axios
      .post(Url + "admin/login", data)
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        showToast("success", "Login Successful");
        window.location.reload();

        navigate("/admin/");
      })
      .catch((error) => {
        console.error(error.message);
      });
    // navigate.back()
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-color-primary-dark py-6 px-8 rounded text-white w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-3 rounded text-black"
              name="email"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              className="py-2 px-3 rounded text-black"
              required
            />
          </div>

          <div className="flex justify-center">
            <button className="py-2 px-4 rounded bg-color-primary text-white">Login</button>
          </div>
        </form>

        <hr className="my-4 border-white" />

        <p className="text-white text-center mb-4">
          Don't have an admin account?{" "}
          <span onClick={() => navigate("/admin/register")} className="text-color-primary-light cursor-pointer">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
