import Form, { useForm, List } from 'rc-field-form';
import Field from './Field';

Form.Field = Field;

type RcFormType = typeof Form;

export interface FormInterface extends RcFormType {
  Field: typeof Field;
}

const formDefaultExport = Form as FormInterface;
formDefaultExport.Field = Field;

export default formDefaultExport;
export { Field, List, useForm };
