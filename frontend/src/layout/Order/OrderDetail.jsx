import axios from "axios";
import React, { useEffect, useState } from "react";
import { Shop, Url, token, user } from "../../config";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const OrderDetail = function () {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notUser, setnotUser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userType === "admin") {
      setnotUser(true);
      showToast("error", "Admin Can't Access");
      navigate("/");
    } else if (!token || (user && user.userType !== "user")) {
      setnotUser(true);
      showToast("error", "User Login Required");
      navigate("/");
    }
    fetch();
  }, []);

  const fetch = () => {
    axios
      .get(Url + "order/shop/" + Shop, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setOrders(data.data.orders);

        setLoading(false);
      })
      .catch((e) => {
        showToast(error,e.response.data.message);
        setLoading(false);
      });
  };

  return (
    <div className="md:container mt-4">
      <p className=" text-2xl font-bold mb-3">Orders</p>

      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-center border-gray-300 rounded">
            <thead className="text-white bg-color-primary">
              <tr>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Table No</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Time</th>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Product</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Status</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {notUser ? (
                <tr>
                  <td colSpan={5} className="text-center text-xl font-bold h-40 md:h-72">
                    Login Required
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order.order._id}
                    className={`${
                      order.order.status === "finished"
                        ? "bg-green-400 hover:bg-green-600 text-black" // Light gray background for even-indexed rows
                        : order.order.status === "reserved"
                        ? "bg-blue-400 hover:bg-blue-600 text-white"
                        : "bg-red-400 hover:bg-red-600 text-white" // Light blue background for odd-indexed rows
                    }  duration-75 ease-in  rounded`}
                  >
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                      {order.order.table.number}
                    </td>
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                      Date : {new Date(order.order.time).toLocaleDateString()} <br />
                      Time : {new Date(order.order.time).toLocaleTimeString()}
                    </td>
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                      <div className="border-b text-center  text-sm md:text-base lg:text-lg">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="py-1 px-2 border-r border-black border-b text-sm md:text-base lg:text-lg">
                                Name
                              </th>
                              <th className="py-1 px-2 border-r border-black border-b text-sm md:text-base lg:text-lg">
                                Price
                              </th>
                              <th className="py-1 px-2  border-black border-b text-sm md:text-base lg:text-lg">
                                Quantity
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.productOrders.map((product) => (
                              <tr key={product._id}>
                                <td className="py-1 px-2 border-r border-black border-b text-sm md:text-base lg:text-lg">
                                  {product.product?.name}
                                </td>
                                <td className="py-1 px-2 border-r border-black border-b text-sm md:text-base lg:text-lg">
                                  {product.product?.price}
                                </td>
                                <td className="py-1 px-2  border-black border-b text-sm md:text-base lg:text-lg">
                                  {product.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <br />
                    </td>

                    <td className={`py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg capitalize`}>
                      {order.order.status}
                    </td>

                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg ">
                      {order.order.totalAmount ?? "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
