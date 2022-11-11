import axios from "axios";

const axiosCall = axios.create({
  headers: {
    Authorization: sessionStorage.getItem("userToken"),
  },
});

export default axiosCall;
