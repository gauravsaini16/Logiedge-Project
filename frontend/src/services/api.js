import axios from 'axios';

const BASE = 'http://localhost:5000/api';

export const getCustomers = () => axios.get(`${BASE}/customers`);
export const createCustomer = (data) => axios.post(`${BASE}/customers`, data);

export const getItems = () => axios.get(`${BASE}/items`);
export const createItem = (data) => axios.post(`${BASE}/items`, data);

export const getInvoices = () => axios.get(`${BASE}/invoices`);
export const createInvoice = (data) => axios.post(`${BASE}/invoices`, data);
export const getInvoiceById = (id) => axios.get(`${BASE}/invoices/${id}`);
export const getInvoicesByCustomer = (id) => axios.get(`${BASE}/invoices/customer/${id}`);