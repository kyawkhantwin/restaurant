import React from "react";
import Spinner from "./Spinner";
import SmallSpinner from "./SmallSpinner";

export const Product = ({ loopItems,loading, btn, type, handleFunction = null, handleQty, productBtnFunction, qty }) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap items-start justify-start overflow-hidden">
        {loopItems.length === 0 ? (
          <p className="mt-28 text-3xl mx-auto"> No {type} items yet!</p>
        ) : (
          loopItems.map((item, index) => {
            return (
              <div
                className={`w-48 md:w-48 my-3 mx-2 bg-gray-100 ${
                  item.isFocused ? "focus-effect" : ""
                } transition-all duration-300 ease-in-out`}
                key={index}
              >
                <img
                  className="overflow-hidden rounded-t w-full h-40 object-cover transition-all duration-300 ease-in-out"
                  src={type === "ordered" ? item.product.image : item.image}
                  alt=""
                />

                <div className="border w-full overflow-hidden border-t-0 rounded-b px-2 mt-2 space-y-2 pb-2">
                <p className="text-lg font-bold capitalize truncate w-40">
  {type === "ordered" ? item.product.name : item.name }
</p>
                  <p>Price: {type === "ordered" ? item.product.price : item.price}</p>

                  {type === "menu" || type === "selected" ? (
                    <div className="div">
                      <div className="flex justify-start items-center space-x-1">
                        <p className="hidden md:inline-block">Quantity:</p>
                        <div className="">
                          <button
                            disabled={type === "menu" ? qty[index] === 0 : item.quantity === 1}
                            className="border border-color-primary hover:text-white disabled:border-color-grey active:scale-95
                            disabled:text-gray-500 font-bold py-1 px-2 rounded-l hover:bg-color-primary  transition-all duration-300 ease-in-out"
                            onClick={() =>
                              type === "menu" ? handleQty("remove", index, false) : handleQty("remove", index, true)
                            }
                          >
                            -
                          </button>
                          <span className="text-xs text-black font-bold py-1 px-2 transition-all duration-300 ease-in-out">
                            {type === "menu" ? qty[index] : item.quantity}
                          </span>
                          <button
                            className="border hover:text-white border-color-primary disabled:border-color-grey 
                            disabled:text-gray-500 font-bold py-1 px-2 rounded-r hover:bg-color-primary active:scale-95 transition-all duration-300 ease-in-out"
                            onClick={() =>
                              type === "menu" ? handleQty("add", index, false) : handleQty("add", index, true)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        disabled={type === "menu" ? qty[index] === 0 : false}
                        className="bg-blue-500 disabled:bg-gray-500 active:scale-95 hover:bg-blue-700 text-white font-bold py-2 w-full rounded mt-3 transition-all duration-300 ease-in-out"
                        onClick={() => productBtnFunction(index, item)}
                      >
                        {type === "menu" ? "Select" : "Remove"}
                      </button>
                    </div>
                  ) : (
                    <p>Quantity: {item.quantity}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {loopItems.length > 0 && type !== "menu" && (
        <div className="flex justify-center mb-20">
          <button
            onClick={() => handleFunction()}
            className=" flex justify-center space-x-3 items-center bg-blue-500 hover:bg-blue-700 active:scale-95 transition-all duration-300 ease-in-out px-4 py-2 text-white rounded"
          >
            {loading && <SmallSpinner/>}
            {btn}
          </button>
        </div>
      )}
    </div>
  );
};
