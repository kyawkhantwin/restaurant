import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import { showToast } from "../components/Toast";
import Spinner from "../components/Spinner";
import { Url, token } from "../config";

const Dashboard = () => {
  const [fetchData, setFetchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = () => {
    axios
      .get(Url + "dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(({ data }) => {
        setFetchData(data.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.response.data.message);
        showToast("error", error.response.data.message);
      });
  };

  const productData = () => {
    if (fetchData && fetchData.length) {
      const chartData = [["Month", "Products"]];
      fetchData.map(({ month, products }) => {
        chartData.push([month, products]);
      });
      return chartData;
    }
    return [];
  };

  const orderData = () => {
    if (fetchData && fetchData.length) {
      const chartData = [["Month", "Orders"]];
      fetchData.map(({ month, orders }) => {
        chartData.push([month, orders]);
      });
      return chartData;
    }
    return [];
  };

  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          {/* Count Section */}
          <div id="count" className="flex items-center justify-around mt-3 space-x-4">
            <div className="flex justify-center items-center bg-color-primary px-4 py-2 rounded-lg w-1/3 transition duration-300 hover:bg-color-primary-light hover:text-white">
              <i className="fa-solid fa-box mr-2 text-white text-2xl"></i>
              <div className="text-white text-left">
                <p className="text-base font-semibold">Product</p>
                <p className="text-lg">{fetchData.reduce((acc, { products }) => acc + products, 0)}</p>
              </div>
            </div>
            <div className="flex justify-center items-center bg-color-primary px-4 py-2 rounded-lg w-1/3 transition duration-300 hover:bg-color-primary-light hover:text-white">
              <i className="fa-solid fa-box mr-2 text-white text-2xl"></i>
              <div className="text-white text-left">
                <p className="text-base font-semibold">Shops</p>
                <p className="text-lg">{fetchData.reduce((acc, { shops }) => acc + shops, 0)}</p>
              </div>
            </div>
            <div className="flex justify-center items-center bg-color-primary px-4 py-2 rounded-lg w-1/3 transition duration-300 hover:bg-color-primary-light hover:text-white">
              <i className="fa-solid fa-box mr-2 text-white text-2xl"></i>
              <div className="text-white text-left">
                <p className="text-base font-semibold">Orders</p>
                <p className="text-lg">{fetchData.reduce((acc, { orders }) => acc + orders, 0)}</p>
              </div>
            </div>
          </div>

          {/* Categories and User Register Sections */}
          <div className="mt-5 flex flex-wrap">
            {/* Product Data Section */}
            <div className="m-2 w-full sm:w-auto md:w-[calc(50%-1rem)]">
              <h1 className="text-lg mt-3">Product data last 6 months</h1>
              <Chart
                chartType="LineChart"
                data={productData()}
                width="100%"
                height="400px"
                legendToggle
                className="w-full"
              />
            </div>

            {/* Order Data Section */}
            <div className="m-2 w-full sm:w-auto md:w-[calc(50%-1rem)]">
              <h1 className="text-lg mt-3">Order data last 6 months</h1>
              <Chart
                chartType="PieChart"
                data={orderData()}
                width="100%"
                height="400px"
                legendToggle
                className="w-full"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
