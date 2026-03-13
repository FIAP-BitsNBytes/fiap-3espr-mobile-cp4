import axios from "axios";

// Funciona apenas no navegador ou simulador iOS
export const api = axios.create({
  baseURL: "http://localhost:8081"
  // baseURL: "http://10.0.2.2:8081" // para celular
});