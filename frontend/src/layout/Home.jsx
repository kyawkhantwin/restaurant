import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { Shop, Url, token } from "../config";
import Spinner from "../components/Spinner";




export const Home = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [table, setTable] = useState([]);

  const fetchTable = () => {
    setLoader(true);
    axios
      .get(Url + "table/shop", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        params:{
          shop : Shop
        },
      })
      .then(({ data }) => {
       
        setTable(data.data.table);
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => {
        setLoader(false);
      });
  };



  useEffect(() => {
    fetchTable();
  }, [ localStorage.key('token')]);

  console.log("shop",Shop)

  const handleActiveTables = (number) => {
    navigate(`/table/${number}`);
  };

 
  return (
    <>
     {Shop ?  <div className="container my-5">
        {loader ? (
          <Spinner />
        ) : (
          <div className="flex flex-wrap text-white gap-2">
            {table.map((t, index) => (
              <div
                key={index}
                onClick={() => {
                  handleActiveTables(t._id);
                }}
                className={`
                 hover:opacity-75 rounded-sm  active:scale-75 transition-all duration-300 ease-in-out
                ${
                  t.status === "active"
                    ? "bg-color-red "
                    : table.status === "reserved"
                    ? "bg-color-primary"
                    : "bg-color-green"
                } w-20 h-20 text-center flex-center cursor-pointer`}
              >
                {t.number}
              </div>
            ))}
          </div>
        )}
      </div>: <div className="flex items-center justify-center h-80 text-2xl font-bold "> <a href="login">Login please</a> </div>}
    </>
  );
};
