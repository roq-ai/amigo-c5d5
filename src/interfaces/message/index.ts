import { UserInterface } from 'interfaces/user';
import { MessageTemplateInterface } from 'interfaces/message-template';
import { GetQueryInterface } from 'interfaces';

export interface MessageInterface {
  id?: string;
  content: string;
  schedule_time?: any;
  user_id?: string;
  template_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  message_template?: MessageTemplateInterface;
  _count?: {};
}

export interface MessageGetQueryInterface extends GetQueryInterface {
  id?: string;
  content?: string;
  user_id?: string;
  template_id?: string;
}
