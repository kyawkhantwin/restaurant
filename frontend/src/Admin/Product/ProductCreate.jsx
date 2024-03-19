import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Url, token, user } from "../../config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const ProductCreate = () => {
  const [formData, setFormData] = useState({
    image: null,
    name: "",
    category: "",
    price: "",
    shop: "",
    description: "",
  });
  const [shops, setShops] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user && user.userType !== "admin")) {
      showToast("error", "Unauthorized Access");
      navigate("/");
    }

    handleFetchShop();
  }, []);

  const handleFetchShop = () => {
    setLoader(true);
    axios
      .get(Url + "shop", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setShops(data.data.shop);
      })
      .catch((e) => {
        showToast("error", e.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "shop" ? e.target.value : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      await axios.post(Url + "product", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      });

      showToast("success", "Product created successfully");
      navigate("/admin/product");
    } catch (error) {
      console.log(error)
      showToast("error", error.response.data.message);
    }
  };

  return (
    <>
      <div className="w-1/2 mx-auto bg-gray-100 px-8 py-3 mt-10 rounded-md">
        <button
          className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
          onClick={() => navigate("/admin/product")}
        >
          Product
        </button>
        <h2 className="text-xl font-bold mb-4">Create Product</h2>
        {loader && <Spinner />}
        {!loader && (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-x-4 flex justify-between items-start">
            <div className="w-full sm:w-1/2">
              <div className="flex flex-col">
                <label htmlFor="image" className="text-sm font-medium text-gray-700">
                  Image
                </label>
                <input required type="file" name="image" onChange={handleFileChange} className="mt-1 p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                required
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                required
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <div className="flex flex-col">
                <label htmlFor="shop" className="text-sm font-medium text-gray-700">
                  Shop
                </label>
                <select
                required
                  name="shop"
                  value={formData.shop}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="" disabled>Select a shop</option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                required
                  name="description"
                  rows="5"
                  value={formData.description}
                  onChange={handleChange}
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
    </>
  );
};
