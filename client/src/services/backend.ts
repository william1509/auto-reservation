import axios from "axios";
import { Payload } from "./payload";

const client = axios.create({
    baseURL: "http://192.168.2.18:5000/",
    headers: {"Content-type": "application/json"}

  });

const send = (payload: Payload) => {
    return client.put<Payload>("add", JSON.stringify(payload));
};

const Backend = {
    send
};

export default Backend;