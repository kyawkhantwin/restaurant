import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Url, user, token } from "../../config";
import axios from "axios";
import { showToast } from "../../components/Toast";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userType === "user") {
      showToast("warning", "Alredy Login");
      navigate("/");
    } else if (user && user.userType === "admin") {
      showToast("error", "Admin can't access");
      navigate("/");
     
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const data = { userName, password };
    axios
      .post(Url + "user/login", data)
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("shop", data.shop);
        showToast("success", "Login Successful");
        navigate("/")
        window.location.reload();
      })
      .catch((e) => {
        showToast("error", e.response.data.message);

      });
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="bg-color-primary-dark py-6 px-8 rounded text-white w-96">
        <h1 className="text-2xl font-bold text-center mb-4">user Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="userName">User Name</label>
            <input
              type="userName"
              className="py-2 px-3 rounded text-black"
              name="userName"
              required
              onChange={(e) => setUserName(e.target.value) }
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
            <button className="py-2 px-4 rounded bg-color-primary text-white">Login</button>
          </div>
        </form>

        <hr className="my-4 border-white" />

        <p className="text-white text-center mb-4">
          !Only Admin Can Created Account
        </p>
      </div>
    </div>
  );
};

export default Login;
