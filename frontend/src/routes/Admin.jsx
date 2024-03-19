import React, { useEffect } from "react"
import { Routes,Route } from "react-router-dom"


import '../style.css'
import { ProductCreate } from "../Admin/Product/ProductCreate"
import { Product } from "../Admin/Product/Product"
import { ProductEdit } from "../Admin/Product/ProductEdit"
import { ShopCreate } from "../Admin/Shop/ShopCreate"
import { Shop } from "../Admin/Shop/Shop"
import { ShopEdit } from "../Admin/Shop/ShopEdit"
import { TableCreate } from "../Admin/Table/TableCreate"
import { Table } from "../Admin/Table/Table"
import { TableEdit } from "../Admin/Table/TableEdit"

import AdminLogin from "../Admin/Auth/AdminLogin"
import AdminRegister from "../Admin/Auth/AdminRegister"
import { token } from "../config"
import Dashboard from "../Admin/Dashboard"

const AuthMiddleware = ({ children }) => {
  useEffect(() => {
    if(token.userType === 'user'){
      navigate('/',{state : {message : "Unauthorized"}})
    }
    
  }, []);

  return children;
};




function Admin() {
 return(
 
  <Routes >
    <Route path="/"  element={<Dashboard/>}/>


    <Route path="/product/create"  element={<ProductCreate/>}/>
    <Route path="/product"  element={<Product/>}/>
    <Route path="/product/:id"  element={<ProductEdit/>}/>

    <Route path="/shop/create"  element={<ShopCreate/>}/>
    <Route path="/shop"  element={<Shop/>}/>
    <Route path="/shop/:id"  element={<ShopEdit/>}/>

    <Route path="/table/create"  element={<TableCreate/>}/>
    <Route path="/table"  element={<Table/>}/>
    <Route path="/table/:id"  element={<TableEdit/>} />

    <Route path="/login" element={<AdminLogin />} />
    <Route path="/register" element={<AdminRegister />} />
  
</Routes>

 )
}

export default Admin
