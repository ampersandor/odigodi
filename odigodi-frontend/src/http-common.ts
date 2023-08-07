import axios from "axios";

export default axios.create({
  baseURL: "https://port-0-odigodi-backend-ac2nlkqcdiye.sel4.cloudtype.app/api/",
  headers: {
    "Content-type": "application/json; charset=utf-8",
    'Access-Control-Allow-Credentials':"true",
    "Access-Control-Allow-Origin": "https://web-odigodi-frontend-ac2nlkqcdiye.sel4.cloudtype.app/"
  }
});