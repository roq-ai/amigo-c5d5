import axios from 'axios';
import queryString from 'query-string';
import { ContactInterface, ContactGetQueryInterface } from 'interfaces/contact';
import { GetQueryInterface } from '../../interfaces';

export const getContacts = async (query?: ContactGetQueryInterface) => {
  const response = await axios.get(`/api/contacts${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createContact = async (contact: ContactInterface) => {
  const response = await axios.post('/api/contacts', contact);
  return response.data;
};

export const updateContactById = async (id: string, contact: ContactInterface) => {
  const response = await axios.put(`/api/contacts/${id}`, contact);
  return response.data;
};

export const getContactById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/contacts/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteContactById = async (id: string) => {
  const response = await axios.delete(`/api/contacts/${id}`);
  return response.data;
};
