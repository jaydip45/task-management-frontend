import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const user = localStorage.getItem("user");
  if (user) {
    req.headers["x-user-id"] = JSON.parse(user).id;
  }
  return req;
});

export default API;
