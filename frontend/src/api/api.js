import axios from "axios";

const api = axios.create({
    baseURL: "https://myraid-internship-assignment.onrender.com",
    withCredentials: true
});

export default api;