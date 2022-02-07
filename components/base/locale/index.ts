import { ValidateMessages } from 'rc-field-form/es/interface';

export interface Locale {
  Form?: {
    optional?: string;
    defaultValidateMessages: ValidateMessages;
  };
}
