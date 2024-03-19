import axios from "axios";
import React, { useEffect, useState } from "react";
import { Url, user, token } from "../../config";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const Table = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (!token || (user && user.userType !== "admin")) {
      showToast("error", "Unauthorized Access");
      navigate("/");
    }

    fetchTable();
  }, []);

  const fetchTable = () => {
    setLoader(true);
    axios
      .get(Url + "table", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setTables(data.data.table);
      })
      .catch((err) => {
        showToast("error", err.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      setLoader(true);
      await axios
        .delete(Url + "table/" + id, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then(({ data }) => {
          setTables(data.data.table);
          showToast("error", data.message);
        })
        .catch((e) => console.log(e.message));
      navigate("/admin/table");
    } catch (error) {
      // Handle errors
      showToast("error", err.response.data.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 rounded mt-5 ">
      <button
        className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
        onClick={() => navigate("/admin/table/create")}
      >
        Create Table
      </button>
      <h2 className="text-xl font-bold mb-4 my-3"> Table</h2>

      {loader ? (
        <Spinner />
      ) : (
        <div className="overflow-x-auto  mt-4 rounded">
          <table className="min-w-full border text-center border-gray-300 rounded">
            <thead className="text-white bg-color-primary">
              <tr>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Table Number</th>
                <th className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">Capacity</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Shop</th>
                <th className="py-2 px-4 border-b text-sm md:text-base lg:text-lg">Options</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((table, index) => {
                return (
                  <tr
                    key={table._id}
                    className={`${
                      index % 2 === 0
                        ? "bg-gray-100 hover:bg-gray-300 text-black" // Light gray background for even-indexed rows
                        : "bg-blue-200 hover:bg-blue-400 text-black" // Light blue background for odd-indexed rows
                    }  duration-75 ease-in  rounded`}
                  >
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">{table.number}</td>
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">{table.capacity}</td>
                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg">{table.shop?.name}</td>

                    <td className="py-2 px-4 border-b border-r text-sm md:text-base lg:text-lg space-x-3">
                      <button
                        className="px-3 py-2 bg-green-400 hover:bg-green-500 my-2  ease-in duration-75 rounded text-white"
                        onClick={() => {
                          navigate("/admin/table/" + table._id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-2 bg-red-400 hover:bg-red-500 my-2  ease-in duration-75 rounded text-white"
                        onClick={() => handleDelete(table._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
