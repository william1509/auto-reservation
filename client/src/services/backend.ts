import axios from "axios";

const client = axios.create({
    baseURL: "http://192.168.2.18:5000/",
    headers: {"Content-type": "application/json"}
  });

const send = () => {
    return client.post("test", JSON.stringify({ client: 'ClientName' }));
};

const Backend = {
    send
};

export default Backend;