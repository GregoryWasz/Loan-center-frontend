import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  headers: { "x-access-token": localStorage.getItem("token") },
});

export default instance;
