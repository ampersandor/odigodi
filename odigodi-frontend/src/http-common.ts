import axios from "axios";

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-type": "application/json; charset=utf-8",
    'Access-Control-Allow-Credentials': "true",
    "Access-Control-Allow-Origin": "https://web-odigodi-frontend-ac2nlkqcdiye.sel4.cloudtype.app/"
  }
});
