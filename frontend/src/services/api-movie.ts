import axios, { CanceledError }from "axios";

// Make a request for a user with a given ID
export default axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 1000,
});

export { CanceledError }