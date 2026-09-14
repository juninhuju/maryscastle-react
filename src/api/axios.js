import axios from "axios";

const appId = import.meta.env.VITE_PARSE_APP_ID;
const javascriptKey = import.meta.env.VITE_PARSE_JS_KEY;

const parseApi = axios.create({
  baseURL: "https://parseapi.back4app.com",
  headers: {
    "Content-Type": "application/json",
    ...(appId && { "X-Parse-Application-Id": appId }),
    ...(javascriptKey && { "X-Parse-JavaScript-Key": javascriptKey }),
  },
});

export default parseApi;
