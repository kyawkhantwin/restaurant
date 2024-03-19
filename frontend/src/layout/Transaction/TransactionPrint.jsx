import React, { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Url, Shop, token,user } from "../../config"
import { useParams } from "react-router-dom"
import Spinner from "../../components/Spinner"
import { useReactToPrint } from "react-to-print"

export const TransactionPrint = () => {
  const { id } = useParams()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

 
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
      fetchTransactions()
    }, [])
    
 

  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })

  const fetchTransactions = () => {
    axios
      .get(`${Url}transaction/${id}`, {
        headers: { authorization: `Bearer ${token}` },
        params: { shop: Shop },
      })
      .then(({ data }) => {
        console.log(data)
        setTransactions(data.data.transactions)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error.message)
        setLoading(false)
      })
  }

 

  return (
    <div className="w-full mt-3 mb-5">
      {loading ? (
        <div className="text-center">
          <Spinner />
          <p>Loading...</p>
        </div>
      ) : (
        <div className="">
          <div className="w-1/3 mx-auto mt-5" ref={componentRef}>
            <img
              src="/src/image/restauant.png"
              className="h-[70px] mb-4 lg:mb-0 mx-auto"
              alt=""
            ></img>
            <div className="flex justify-between items-center my-2">
              <p>
                Shop: {transactions[0].transaction.shop.name} <br />
                Table: {transactions[0].transaction.table.number}
              </p>
              <p>
                Date:{" "}
                {new Date(
                  transactions[0].transaction?.endTime,
                ).toLocaleDateString()}{" "}
                <br />
                Time:{" "}
                {new Date(
                  transactions[0].transaction?.endTime,
                ).toLocaleTimeString()}
              </p>
            </div>

            <table className="min-w-full border-rounded text-center">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-sm md:text-base lg:text-lg">
                    Name
                  </th>
                  <th className="py-2 px-4 text-sm md:text-base lg:text-lg">
                    Unit Price
                  </th>
                  <th className="py-2 px-4 text-sm md:text-base lg:text-lg">
                    Qty
                  </th>
                  <th className="py-2 px-4 text-sm md:text-base lg:text-lg">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) =>
                  transaction.productOrders.map((order) => (
                    <tr key={order.product._id} className="mb-4">
                      <td className="py-1 px-2 text-sm md:text-base lg:text-lg mb-4">
                        {order.product.name}
                      </td>
                      <td className="py-1 px-2 text-sm md:text-base lg:text-lg mb-4">
                        {order.product.price}
                      </td>
                      <td className="py-1 px-2 text-sm md:text-base lg:text-lg mb-4">
                        {order.quantity}
                      </td>
                      <td className="py-1 px-2 text-sm md:text-base lg:text-lg mb-4">
                        {order.totalAmount}
                      </td>
                    </tr>
                  )),
                )}

                {transactions[0]?.productOrders &&
                  transactions[0].productOrders.length > 0 && (
                    <tr className="pt-5 mt-5">
                      <td colSpan={3} className="border-t text-end pt-5 mt-5">
                        Total Amount:
                      </td>
                      <td className="border-t pt-5 mt-5">
                        {transactions[0].transaction.totalAmount}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>

            <p className="text-xs mt-5 text-center">
              Thank you for choosing us! We appreciate your dining with us. For
              inquiries or feedback, please contact us at 09457597837. We look
              forward to serving you again soon!
            </p>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handlePrint}
          className="bg-blue-500 mx-auto text-white py-2 px-4 mt-4"
        >
          Print
        </button>
      </div>
    </div>
  )
}
