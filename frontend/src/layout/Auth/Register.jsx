import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Url, user } from "../../config";
import axios from "axios";
import { showToast } from "../../components/Toast";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
   if (user && user.userType !== "admin") {
      showToast("error", "Unauth access");
      navigate("/");
    }
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    const data = { name, password, email };
    console.log(data);
    axios
      .post(Url + "user/register", data)
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        showToast("success", "Register Successful");

        navigate("/");
      })
      .catch((e) => {
        console.log(e.message);
      });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-color-primary-dark py-6 px-8 rounded text-white w-96">
        <h1 className="text-2xl font-bold text-center mb-4">User Register</h1>
        <form onSubmit={handleRegister} method="POST" className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              className="py-2 px-3 rounded text-black"
              name="name"
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              className="py-2 px-3 rounded text-black"
              name="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="py-2 px-3 rounded text-black"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center">
            <button className="py-2 px-4 rounded bg-color-primary text-white">Register</button>
          </div>
        </form>

        <hr className="my-4 border-white" />

        <p className="text-white text-center mb-4">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-color-primary-light cursor-pointer">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
