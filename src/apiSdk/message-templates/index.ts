import axios from 'axios';
import queryString from 'query-string';
import { MessageTemplateInterface, MessageTemplateGetQueryInterface } from 'interfaces/message-template';
import { GetQueryInterface } from '../../interfaces';

export const getMessageTemplates = async (query?: MessageTemplateGetQueryInterface) => {
  const response = await axios.get(`/api/message-templates${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createMessageTemplate = async (messageTemplate: MessageTemplateInterface) => {
  const response = await axios.post('/api/message-templates', messageTemplate);
  return response.data;
};

export const updateMessageTemplateById = async (id: string, messageTemplate: MessageTemplateInterface) => {
  const response = await axios.put(`/api/message-templates/${id}`, messageTemplate);
  return response.data;
};

export const getMessageTemplateById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/message-templates/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteMessageTemplateById = async (id: string) => {
  const response = await axios.delete(`/api/message-templates/${id}`);
  return response.data;
};
