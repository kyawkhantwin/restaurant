import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Url ,user,token} from "../../config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast"


export const ShopCreate = () => {
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    userName: '',
    adminId : user._id,
    password: "",
  });
  const navigate = useNavigate();

  useEffect(()=>{
    if (!token || (user && user.userType !== 'admin')) {
      showToast('error', "Unauthorized Access" )
      navigate("/");
    }

   

  },[])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
    
  
    axios
      .post(Url + "shop" , formData, {
        headers: {
          authorization: `Bearer ${token}`,
          
        },
      })
      .then(({data}) => {
        console.log(data)
        showToast("success", data.message);
        navigate("/admin/shop");
      })
      .catch((error) => {
        showToast("error", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };
  
  return (
    <>
      <div className="w-1/2 mx-auto bg-gray-100 px-8 py-3 mt-10 rounded-md">
        <button
          className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
          onClick={() => navigate("/admin/shop")}
        >
          Shop
        </button>
        <h2 className="text-xl font-bold mb-4">Create Shop</h2>
        {loader && <Spinner />}
        {!loader && (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-x-4 flex flex-col text-black"
          >
            <div className="w-full">
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                 Shop Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex flex-col">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone
                </label>
                <input
                  type="number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="userName"
                  className="text-sm font-medium text-gray-700"
                >
                 User Name for login
                </label>
                
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  password
                </label>
                <input
                  type="text"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div> 
            <div className="flex justify-end mt-4 w-full me-4">
              <button
                type="submit"
                className="px-2 py-3 bg-color-primary text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};
