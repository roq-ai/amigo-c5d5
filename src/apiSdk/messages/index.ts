import axios from 'axios';
import queryString from 'query-string';
import { MessageInterface, MessageGetQueryInterface } from 'interfaces/message';
import { GetQueryInterface } from '../../interfaces';

export const getMessages = async (query?: MessageGetQueryInterface) => {
  const response = await axios.get(`/api/messages${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMessage = async (message: MessageInterface) => {
  const response = await axios.post('/api/messages', message);
  return response.data;
};

export const updateMessageById = async (id: string, message: MessageInterface) => {
  const response = await axios.put(`/api/messages/${id}`, message);
  return response.data;
};

export const getMessageById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/messages/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMessageById = async (id: string) => {
  const response = await axios.delete(`/api/messages/${id}`);
  return response.data;
};
