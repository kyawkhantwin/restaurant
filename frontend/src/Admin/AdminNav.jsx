import React from "react";
import restaurants from "../image/restauant.png";
import { token } from "../config.jsx";
import { useNavigate } from "react-router-dom";

const AdminNav = () => {
  const navigate = useNavigate();
  return (
    <>
      <nav className="bg-color-primary py-1 sticky top-0 left-0 z-50">
        <div className="container flex flex-col lg:flex-row items-center justify-between text-color-white">
          <img src={restaurants} className="h-[70px] mb-4 lg:mb-0" alt="" />
          {token ? ( // If token exists, render logout button
            <button
              className="text-white bg-red-500 px-3 py-3 rounded-lg hover:text-gray-500 active:text-gray-800 cursor-pointer"
              onClick={() => {
                localStorage.clear(); 
                navigate('/admin/login')
                window.location.reload();
                showToast('error',"Log Out")
              }}
            >
              Logout
            </button>
          ) : (
            <button
              className="text-white bg-green-500 px-3 py-3 rounded-lg hover:text-gray-500 active:text-gray-800 cursor-pointer"
              onClick={() => {
                navigate("/admin/login");
                window.location.reload();

              }}
            >
              Login
            </button>
          )}

          <ul className="flex-center space-x-3 lg:space-x-4">
            <li>
              <a href="/admin/" className="hover:text-gray-500 active:text-gray-800">
                Home
              </a>
            </li>
            <li>
              <a href="/admin/product" className="hover:text-gray-500 active:text-gray-800">
                Product
              </a>
            </li>
            <li>
              <a href="/admin/table" className="hover:text-gray-500 active:text-gray-800">
                table
              </a>
            </li>
            <li>
              <a href="/admin/shop" className="hover:text-gray-500 active:text-gray-800">
                shop
              </a>
            </li>
            <li>
              <a href="/admin/shop/create" className="hover:text-gray-500 active:text-gray-800">
                Create Shop
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default AdminNav;
