import axios, { CanceledError } from "axios";

const backend_api = import.meta.env.MODE === 'production'
  ? 'http://167.172.67.47:3001/api'
  : 'http://localhost:3001/api';

export default axios.create({
  baseURL: backend_api,
  timeout: 10000,
});

export { CanceledError }