import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Url, user, token } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const ShopEdit = () => {
  const { id } = useParams();
  const [shop, setShop] = useState({
    name: "",
    phone: "",
    location: "",
  });
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user && user.userType !== "admin")) {
      showToast("error", "Unauthorized Access");
      navigate("/");
    }

    handleFetchShop();
  }, []);

  const handleFetchShop = async () => {
    setLoader(true);
    try {
      const { data } = await axios.get(Url + "shop/" + id, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(data.data.shop);
      setShop(data.data.shop);
    } catch (error) {
      showToast("error", error.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);

    axios
      .put(Url + "shop/" + id, shop, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        showToast("success", data.message);

        setShop(data.data.shop);
        navigate('/admin/shop')
      })
      .catch((error) => {
        showToast("error", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div className="w-1/2 mx-auto bg-gray-100 px-8 py-3 mt-10 rounded-md">
      <button
        className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2  ease-in duration-75 rounded font-bold text-white me-3"
        onClick={() => navigate("/admin/shop/create")}
      >
        Create Shop
      </button>
      <button
        className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 ease-in duration-75 my-2 rounded font-bold text-white"
        onClick={() => navigate("/admin/shop")}
      >
        Shop
      </button>
      <h2 className="text-xl font-bold my-4">Edit Shop</h2>

      {loader && <Spinner />}
      {!loader && (
        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="space-x-4 flex justify-between items-start"
        >
          <div className="w-full ">
            <div className="flex flex-col space-y-3">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={shop.name}
                onChange={(e) => setShop({ ...shop, name: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="number"
                name="phone"
                value={shop.phone}
                onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={shop.location}
                onChange={(e) => setShop({ ...shop, location: e.target.value })}
                className="mt-1 p-2 border border-gray-300 rounded-md"
              />
            </div>
            <button type="submit" className="px-3 py-2 rounded bg-blue-500 text-white mt-5 float-end">
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
