import { MessageInterface } from 'interfaces/message';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MessageTemplateInterface {
  id?: string;
  template_name: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  message?: MessageInterface[];
  user?: UserInterface;
  _count?: {
    message?: number;
  };
}

export interface MessageTemplateGetQueryInterface extends GetQueryInterface {
  id?: string;
  template_name?: string;
  user_id?: string;
}
