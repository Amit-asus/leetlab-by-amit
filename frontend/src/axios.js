import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8081/api/v1"
      : "https://your-production-api-url.com",
  withCredentials: true,
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${localStorage.getItem("token")}`,
  //   },
});
