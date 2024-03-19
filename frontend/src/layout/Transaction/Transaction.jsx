 import axios from "axios";
import React, { useEffect, useState } from "react";
import { Shop, Url, token, user } from "../../config";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const Transaction = function () {
  const [transactions, setTransactions] = useState([]);
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
      .get(Url + "transaction", {
        headers: { authorization: `Bearer ${token}` },
        params: { shop: Shop },
      })
      .then(({ data }) => {
        console.log(data);
        setTransactions(data.data.transactions);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e.message);
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto p-4">
      {loading ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-center border-gray-300 rounded">
            <thead className="text-white bg-color-primary">
              <tr>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Table No</th>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Product</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Time</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {notUser ? (
                <tr>
                  <td colSpan={4} className="text-center text-xl font-bold h-40 md:h-72">
                    Login Required
                  </td>
                </tr>
              ) : (
                transactions.map((tran, index) => {
                  const startTime = new Date(tran.transaction.order.time);
                  const endTime = new Date(tran.transaction.endTime);
                  const timeDifference = endTime - startTime;
                  const minutes = Math.floor(timeDifference / (1000 * 60));

                  return (
                    <tr
                      key={tran.transaction._id}
                      className={`${
                        index % 2 === 0
                          ? "bg-gray-100 hover:bg-gray-300 text-black" // Light gray background for even-indexed rows
                          : "bg-blue-200 hover:bg-blue-400 text-black" // Light blue background for odd-indexed rows
                      }  duration-75 ease-in  rounded`}
                      onClick={() => {
                        navigate("/transaction/" + tran.transaction._id);
                      }}
                    >
                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                        {tran.transaction.table.number}
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
                              {tran.productOrders.map((order) => (
                                <tr key={order.product?._id}>
                                  <td className="py-1 px-2 border-r border-black border-b text-sm md:text-base lg:text-lg">
                                    {order.product?.name}
                                  </td>
                                  <td className="py-1 px-2 border-r border-black border-b text-sm md:text-base lg:text-lg">
                                    {order.product?.price}
                                  </td>
                                  <td className="py-1 px-2  border-black border-b text-sm md:text-base lg:text-lg">
                                    {order.quantity}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <br />
                      </td>
                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">{minutes} minutes</td>
                      <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">
                        {tran.transaction.totalAmount ?? "N/A"}
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
