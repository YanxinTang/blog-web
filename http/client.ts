import axios from 'axios';

const clientConfig = {
  baseURL: process.env.NEXT_PUBLIC_CLIENT_BASE_URL,
}

export default axios.create(clientConfig);