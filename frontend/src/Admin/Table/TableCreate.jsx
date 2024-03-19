import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Url,user ,token} from "../../config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast"


export const TableCreate = () => {
  const [loader, setLoader] = useState(false);
  const [shops, setShops] = useState([]);
  const [formData, setFormData] = useState({
    number: "",
    capacity: "",
    shop: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user && user.userType !== 'admin')) {
      showToast('error', "Unauthorized Access" )
      navigate("/");
    }

    handleShop();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShop = () => {
    axios
      .get(Url + "shop", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setShops(data.data.shop);
      })
      .catch((error) => {
        showToast('error', error.response.data.message )
       
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);
  
    axios.post(`${Url}table`, formData, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then(({data}) => {
        showToast('success', data.message);
        navigate("/admin/table");
      })
      .catch((error) => {
        showToast('error', error.response.data.message);
        console.error("Error creating table:", error);
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
          onClick={() => navigate("/admin/table")}
        >
          Table
        </button>
        <h2 className="text-xl font-bold mb-4">Create Table</h2>
        {loader && <Spinner />}
        {!loader && (
          <form onSubmit={handleSubmit} className="space-x-4 flex flex-col">
            <div className="w-full">
              <div className="flex flex-col">
                <label
                  htmlFor="number"
                  className="text-sm font-medium text-gray-700"
                >
                  Number
                </label>
                <input
                  type="number"
                  name="number"
                  value={formData.number}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="capacity"
                  className="text-sm font-medium text-gray-700"
                >
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="shop"
                  className="text-sm font-medium text-gray-700"
                >
                  Shop
                </label>
                <select
                required
                  name="shop"
                  value={formData.shop}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="#" disabled selected>
                    Choose a shop
                  </option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
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
