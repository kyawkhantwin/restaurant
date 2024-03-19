import React from 'react';
import restaurants from '../image/restauant.png';
import { useNavigate } from 'react-router-dom';
import { token } from '../config';
import { showToast } from './Toast';

export const Nav = () => {
  const navigate = useNavigate()
  return (
    <>
    <nav className="bg-color-primary py-1 sticky top-0 left-0 z-50">
      <div className="container flex  flex-row items-center justify-between text-color-white">
        <img src={restaurants} className="h-[70px] mb-4 lg:mb-0" alt="" />
        {token ? ( 
            <button
              className="text-white bg-red-500 px-3 py-3 rounded-lg hover:text-gray-500 active:text-gray-800 cursor-pointer"
              onClick={() => {
                localStorage.clear(); 
                navigate('/login')
                showToast('error',"Log Out")
                window.location.reload();
              }}
            >
              Logout
            </button>
          ) : ( <button
            className="text-white bg-green-500 px-3 py-3 rounded-lg hover:text-gray-500 active:text-gray-800 cursor-pointer"
            onClick={() => { 
              navigate('/login')
            }}
          >
            Login
          </button>)} 
        <ul className="flex-center space-x-3 lg:space-x-4">
          <li><a href="/" className="hover:text-gray-500 active:text-gray-800">Home</a></li>
          <li><a href="/order" className="hover:text-gray-500 active:text-gray-800">Order</a></li>
          <li><a href="/transaction" className="hover:text-gray-500 active:text-gray-800">Transaction</a></li>
        </ul>
      </div>
    </nav>
  </>
  
  );
};
