import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Url, token, user } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const ProductEdit = () => {
  const { id } = useParams();
  const [shops, setShops] = useState([]);
  const [product, setProduct] = useState([]);
  const [loader, setLoader] = useState(false);
  const [defaultShop, setDefaultShop] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user && user.userType !== "admin")) {
      showToast("error", "Unauthorized Access");
      navigate("/");
    }

    handleFetchShop();
    handleFetchProduct();
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

  const handleFetchProduct = () => {
    setLoader(true);
    axios
      .get(Url + "product/" + id)
      .then(({ data }) => {
        setProduct({ ...data.data.product, shop: data.data.product.shop._id });
        setDefaultShop(data.data.product.shop);
      })
      .catch((e) => {
        showToast("error", e.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoader(true);

    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("shop", product.shop);
    formData.append("description", product.description);

    if (product.image instanceof File) {
      formData.append("image", product.image);
    }

    axios
      .put(Url + "product/" + id, formData, {
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(({ data }) => {
        showToast("success", data.message);
        navigate("/admin/product");
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
          className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white me-3"
          onClick={() => navigate("/admin/product/create")}
        >
          Create Product
        </button>
        <button
          className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
          onClick={() => navigate("/admin/product")}
        >
          Product
        </button>
        <h2 className="text-xl font-bold my-4">Edit Product</h2>

        {loader && <Spinner />}
        {!loader && (
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-x-4 flex justify-between items-start"
          >
            <div className="w-full sm:w-1/2">
              <div className="flex flex-col space-y-3">
                <label htmlFor="image" className="text-sm font-medium text-gray-700">
                  Image
                </label>
                {product.image && (
                  <img
                    src={typeof product.image === "string" ? product.image : URL.createObjectURL(product.image)}
                    width={80}
                    alt={product.name}
                  />
                )}
                <input
                  type="file"
                  name="image"
                  onChange={(e) => {
                    setProduct({ ...product, image: e.target.files[0] });
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={(e) => {
                    setProduct({ ...product, name: e.target.value });
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <div className="flex flex-col">
                <label htmlFor="shop" className="text-sm font-medium text-gray-700">
                  <br />
                  Default Shop : {defaultShop.name}
                </label>
                <select
                  name="shop"
                  defaultValue={defaultShop._id}
                  value={product.shop?._id}
                  onChange={(e) => setProduct({ ...product, shop: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value={defaultShop._id} disabled>
                    Default: {defaultShop.name}
                  </option>
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
                  name="description"
                  value={product.description}
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                  rows="5"
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
