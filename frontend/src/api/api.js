import axios from "axios";

const api = axios.create({
    baseURL: "https://myraid-internship-assignment.onrender.com/api",
    withCredentials: true
});

export default api;