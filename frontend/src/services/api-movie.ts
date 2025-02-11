import axios, { CanceledError } from "axios";

const backend_api = import.meta.env.MODE === 'production'
  ? 'https://api.tectho.com/api'
  : 'http://localhost:3001/api';

export default axios.create({
  baseURL: backend_api,
  timeout: 10000,
});

export { CanceledError }