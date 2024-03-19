import { jwtDecode } from "jwt-decode";

export const Url = "http://localhost:3333/";
export const Shop = localStorage.getItem("shop");
export const token = localStorage.getItem("token");
export const user = token ? jwtDecode(token) : null;
