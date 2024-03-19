import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Shop, token, Url } from "../../config";
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Product } from "../../components/Product";
import { showToast } from "../../components/Toast";

export const Order = () => {
  const { tableId } = useParams();
  const [products, setProducts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [selectMenu, setSelectMenu] = useState([]);
  const [qty, setQty] = useState([]);
  const [table, setTable] = useState({});
  const [productOrder, setProductOrder] = useState([]);
  const [order, setOrder] = useState([]);
  const [toggle, setToggle] = useState("menu");
  const [orderId, setOrderId] = useState(() => "ORD" + Math.floor(Math.random() * 1000000));
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [orderedLoading, setOrderedLoading] = useState(false);

  const currentDateTime = new Date();
  const formatedDate = format(currentDateTime, "dd,MMMM,yyyy");
  const formatedTime = format(currentDateTime, "h:mm:ss a");

  useEffect(() => {
    fetch();
  }, []);

  const handleQty = (method, index, selected = false) => {
    setQty((prevQuantities) => {
      const newQuantities = [...prevQuantities];

      if (method === "add") {
        newQuantities[index] += 1;
      }

      if (method === "remove" && newQuantities[index] > 0) {
        newQuantities[index] -= 1;
      }

      return newQuantities;
    });

    if (selected) {
      setSelectMenu((prevItems) =>
        prevItems.map((item, i) => {
          return i === index
            ? {
                ...item,
                quantity: method === "add" ? item.quantity + 1 : item.quantity > 1 ? item.quantity - 1 : 0,
                index: i,
              }
            : item;
        }),
      );
    }
  };

  const handleSelectMenu = (index, product) => {
    const q = qty[index];

    setSelectMenu((prevSelectMenu) => {
      const isProductAlreadySelected = prevSelectMenu.some((select) => select._id === product._id);
      if (isProductAlreadySelected) {
        return prevSelectMenu.map((item) => ({ ...item }));
      } else {
        const updatedSelectMenu = [...prevSelectMenu, { ...product, quantity: q, index }];

        return updatedSelectMenu;
      }
    });

    showToast("success", "Selected");

    qty[index] = 0;
  };

  const handleRemoveMenu = (index, selected) => {
    setSelectMenu(selectMenu.filter((menu) => menu._id !== selected._id));
    showToast("error", "Removed");
  };

  const handleOrder = async () => {
    if (selectMenu.length === 0) {
      showToast("Error", "Please select at least one product");
      return;
    }

    setSelectedLoading(true);

    const orderDetails = selectMenu.map((product) => ({
      product: product._id,
      quantity: product.quantity,
      totalAmount: product.price * product.quantity,
    }));
    const total = orderDetails.reduce((acc, order) => acc + order.totalAmount, 0);

    const orderData = {
      shop: Shop,
      table: tableId,
      orderDetails,
      totalAmount: total,
      _orderId : orderId
    };

    try {
      const { data } = await axios.post(Url + "order", orderData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setProductOrder([...productOrder, ...data.data.productOrder]);
      setTable(data.data.table);
      setOrder(data.data.order);
      showToast("success", "Order Success");
      setToggle("menu");
      setSelectMenu([]);
    } catch (error) {
      showToast("error", error.response.data.message);
    } finally {
      setSelectedLoading(false);
    }
  };

  const handleTransaction = async () => {
    try {
      setOrderedLoading(true);

      const data = {
        orders: Array.isArray(order)
          ? order.map(o => ({
              order: o._id,
              shop: o.shop,
              table: o.table,
              startTime: o.time,
          }))
          : [
              {
                  order: order._id,
                  shop: order.shop,
                  table: order.table,
                  startTime: order.time,
              },
          ],
        totalAmount: Array.isArray(order)
          ? order.reduce((total, o) => total + o.totalAmount, 0)
          : order.totalAmount,
      };

      const { data: responseData } = await axios.post(Url + "transaction", data, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setToggle('menu');
      setTable(responseData.data.table[0]);
      setOrderId(() => "ORD" + Math.floor(Math.random() * 1000000) + "fada");
      setOrder([]);
      setProductOrder([]);
      showToast("success", "Finished");
    } catch (error) {
      showToast("error", error.response.data.message);
    } finally {
      setOrderedLoading(false);
    }
  };

  const fetch = () => {
    setLoader(true);
    axios
      .get(Url + "product")
      .then(({ data }) => {
        setProducts(data.data.products);
        setQty(Array(data.data.products.length).fill(0));
        return axios.get(Url + "table");
      })
      .then(({ data }) => {
        const tables = data.data.table;
        tables.forEach((table) => {
          if (table._id === tableId) {
            setTable(table);
          }
        });
        return axios.get(Url + "order/table/" + tableId, {
          headers: { authorization: `Bearer ${token}` },
          params: { status: "active", shop: Shop },
        });
      })
      .then(({ data }) => {
        setProductOrder(data.data.productOrder);
        setOrder(data.data.order);
      })
      .catch((error) => {
        showToast("error", error.response.data.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between shadow-sm">
      <div
        className={`${
          table.status === "active"
            ? "bg-color-red "
            : table.status === "reserved"
            ? "bg-color-primary"
            : "bg-color-green"
        } h-[10vh] w-full text-center flex-center text-white`}
      >
        Table {table.number}
      </div>
      <div className="md:container mx-auto flex-grow">
        <div className="flex justify-between items-center">
          <p className="font-bold text-xl md:text-2xl py-2  capitalize">{toggle}</p>
          <div className="space-x-3">
            <button
              onClick={() => setToggle("menu")}
              disabled={toggle === "menu"}
              className="bg-blue-500 disabled:bg-gray-500 hover:bg-blue-700  active:scale-75 transition-all duration-300 ease-in-out text-white px-3 md:px-4 py-2 rounded focus:outline-none focus:shadow-outline text-sm md:text-base"
            >
              Menu
            </button>
            <button
              onClick={() => setToggle("selected")}
              disabled={toggle === "selected"}
              className="bg-blue-500 disabled:bg-gray-500 hover:bg-blue-700  active:scale-75 transition-all duration-300 ease-in-out text-white px-3 md:px-4 py-2 rounded focus:outline-none focus:shadow-outline text-sm md:text-base"
            >
              Selected
            </button>
            <button
              onClick={() =>{ setToggle("ordered") 
              console.log(productOrder)
              console.log(order)}}
              disabled={toggle === "ordered"}
              className="bg-blue-500 disabled:bg-gray-500 hover:bg-blue-700  active:scale-75 transition-all duration-300 ease-in-out text-white px-3 md:px-4 py-2 rounded focus:outline-none focus:shadow-outline text-sm md:text-base"
            >
              Ordered
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start md:justify-between p-3">
          <p className="mt-2 md:mt-4 text-xs md:text-sm text-gray-700">Date: {formatedDate}</p>
          <p className="mt-2 md:mt-4 text-xs md:text-sm text-gray-700">Time: {formatedTime}</p>
        </div>
        {loader && <Spinner />}
        {toggle === "menu" && !loader && (
          <Product
            qty={qty}
            loopItems={products}
            handleQty={handleQty}
            productBtnFunction={handleSelectMenu}
            type={"menu"}
          />
        )}
        {toggle === "selected" && (
          <Product
            qty={qty}
            loopItems={selectMenu}
            handleQty={handleQty}
            productBtnFunction={handleRemoveMenu}
            type={"selected"}
            btn={"Confirm Order"}
            handleFunction={handleOrder}
            loading={selectedLoading}
          />
        )}
        {toggle === "ordered" && (
          <Product loopItems={productOrder} type={"ordered"} btn={"Finished"} loading={orderedLoading} handleFunction={handleTransaction} />
        )}
      </div>
    </div>
  );
};
