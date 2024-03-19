import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Url, user, token } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { showToast } from "../../components/Toast";

export const TableEdit = () => {
  const { id } = useParams();
  const [shops, setShops] = useState([]);
  const [table, setTable] = useState({
    number: "",
    capacity: "",
    shop: null,
  });

  const [defaultShop, setDefalutShop] = useState();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || (user && user.userType !== "admin")) {
      showToast("error", "Unauthorized Access");
      navigate("/");
    }

    handleFetchShop();
    handleFetchTable();
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
      .catch((error) => {
        showToast("error", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleFetchTable = () => {
    setLoader(true);
    axios
      .get(Url + "table/" + id, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        const tableData =data.data.table
        setTable({...tableData,shop: tableData.shop._id});
        setDefalutShop(data.data.table.shop);
        console.log(data)
      })
      .catch((e) => {
        showToast("error", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    axios
      .put(
        Url + "table/" + id,
        {
          number: table.number,
          capacity: table.capacity,
          shop: table.shop,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      )
      .then(({ data }) => {
        setTable(data.data.table);
        showToast("success", data.message);
        navigate("/admin/table");
      })
      .catch((e) => {
        showToast("error", e.response.data.message);
      })
      .finally(() => setLoader(false));
  };

  return (
    <>
      <div className="w-1/2 mx-auto bg-gray-100 px-8 py-3 mt-10 rounded-md">
        <button
          className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white me-3"
          onClick={() => navigate("/admin/table/create")}
        >
          Create Table
        </button>
        <button
          className="px-3 py-2 bg-color-primary mb-3 hover:bg-blue-500 my-2 rounded font-bold text-white"
          onClick={() => navigate("/admin/table")}
        >
          Table
        </button>
        <h2 className="text-xl font-bold my-4">Edit Table</h2>

        {loader && <Spinner />}
        {!loader && (
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-x-4">
            <div className="w-full">
              <div className="flex flex-col">
                <label htmlFor="number" className="text-sm font-medium text-gray-700">
                  Number
                </label>
                <input
                  type="text"
                  name="number"
                  value={table.number}
                  onChange={(e) => {
                    setTable({ ...table, number: e.target.value });
                  }}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="capacity" className="text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="text"
                  name="capacity"
                  value={table.capacity}
                  onChange={(e) => setTable({ ...table, capacity: e.target.value })}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="shop" className="text-sm font-medium text-gray-700">
                  Shop
                </label>
                <select
                  name="shop"
                  onChange={(e) => setTable({ ...table, shop: e.target.value })}
                  value={table.shop}
                  className="mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value={defaultShop?._id} disabled >
                    Default: {defaultShop?.name}
                  </option>
                  {shops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="">
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
