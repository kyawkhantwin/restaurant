import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url, token, user } from "../../config";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const Product = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  console.log(token)

  useEffect(() => {
    if (!token || (user && user.userType !== "admin")) {
      showToast("error", "Unauthorized Access");
      navigate('/');
    }

    fetchProduct();
  }, []);

  const fetchProduct = () => {
    setLoader(true);
    axios
      .get(Url + "product", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setProducts(data.data.products);
      })
      .catch((err) => {
        showToast("error", err.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleDeleteProduct = async (id) => {
    try {
      setLoader(true);

      await axios
        .delete(Url + "product/" + id, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          setProducts(data.data.product);
          showToast("error", data.message);
        })
        .catch((e) => {
          showToast("error", e.response.data.message);
        });
      navigate("/admin/product");
    } catch (error) {
    
      showToast("error", error.message);

    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded mt-5 ">
      <button
        className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
        onClick={() => navigate("/admin/product/create")}
      >
        Create Product
      </button>

      {loader ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto  mt-4 rounded">
          <table className="min-w-full border text-center border-gray-300 rounded">
            <thead className="text-white bg-color-primary">
              <tr>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Image</th>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Product</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Price</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Shop</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Options</th>
              </tr>
            </thead>
            <tbody>
              {!products ? (
                <tr>
                  <td colSpan={6} className="text-center text-xl font-bold h-40 md:h-72">
                    No Product Found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => {
                  return (
                    <tr
                      key={product._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-100 hover:bg-gray-300 text-black" // Light gray background for even-indexed rows
                          : "bg-blue-200 hover:bg-blue-400 text-black" // Light blue background for odd-indexed rows
                      }  duration-75 ease-in  rounded`}
                    >
                      <td className="py-2 mx-auto border-b border-r text-sm md:text-base lg:text-lg">
                        <img src={product.image} alt={product.name} width={100} />
                      </td>

                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">{product.name}</td>
                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">{product.price}</td>
                     
                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                        {product.shop.name}
                      </td>
                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg space-x-3">
                        <button
                          className="px-3 py-2 bg-green-400 hover:bg-green-500 my-2 rounded text-white"
                          onClick={() => {
                            navigate("/admin/product/" + product._id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-2 bg-red-400 hover:bg-red-500 my-2 rounded text-white"
                          onClick={() => handleDeleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
