import axios from "axios"
import React, { useEffect, useState } from "react"
import { Url,token,user } from "../../config"
import Spinner from "../../components/Spinner"
import { useNavigate } from "react-router-dom"
import { showToast } from "../../components/Toast"


export const Shop = () => {
  const [shops, setShops] = useState([])
  const navigate = useNavigate()
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    if (!token || (user && user.userType !== 'admin')) {
      showToast('error', "Unauthorized Access" )
      navigate("/");
    }

    fetchProduct()
  }, [])

  const fetchProduct = () => {
    setLoader(true)
    axios
      .get(Url + "shop")
      .then(({ data }) => {
        setShops(data.data.shop)
      })
      .catch((error) => {
        showToast("error", error.response.data.message);

      })
      .finally(() => {
        console.log(shops)
        setLoader(false)
      })
  }

  const handleDeleteProduct = async (id) => {
    try {
      setLoader(true)
      await axios
        .delete(Url + "shop/" + id, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          
          setShops(data.data.shop)
          showToast("error", data.message);
        })
        .catch((e) => {
        showToast("error", error.response.data.message);
          
        })
      navigate("/admin/shop")
    } catch (error) {
      // Handle errors
      showToast("error", error.response.data.message);

    } finally {
      setLoader(false)
    }
  }
 

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded mt-5 ">
      <button
        className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
        onClick={() => navigate("/admin/shop/create")}
      >
        Create Shop
      </button>
      <h2 className="text-xl font-bold mb-4 my-3"> Shop</h2>

      {loader ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto  mt-4 rounded">
          <table className="min-w-full border text-center border-gray-300 rounded">
            <thead className="text-white bg-color-primary">
              <tr>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                  Name
                </th>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                  Phone
                </th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">
                  Location
                </th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop, index) => {
                return (
                  <tr
                    key={shop._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-100 hover:bg-gray-300 text-black" // Light gray background for even-indexed rows
                        : "bg-blue-200 hover:bg-blue-400 text-black" // Light blue background for odd-indexed rows
                    }  duration-75 ease-in  rounded`}
                  >
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                      {shop.name}
                    </td>
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                      {shop.phone}
                    </td>
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                      {shop.location}
                    </td>

                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg space-x-3">
                      <button
                        className="px-3 py-2 bg-green-400 hover:bg-green-500 my-2  ease-in duration-75 rounded text-white"
                        onClick={() => {
                          navigate("/admin/shop/" + shop._id)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-2 bg-red-400 hover:bg-red-500 my-2  ease-in duration-75 rounded text-white"
                        onClick={() => handleDeleteProduct(shop._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
