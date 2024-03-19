// toastHelper.js

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showToast = (type, message, options = {}) => {
    if (type && toast[type]) {
      toast[type](message,  {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
     
        });
    } else {
      console.error(`Invalid toast type: ${type}`);
    }
  };

export const ToastProvider = () => {
  return <ToastContainer />;
};
