import * as yup from 'yup';

export const messageTemplateValidationSchema = yup.object().shape({
  template_name: yup.string().required(),
  user_id: yup.string().nullable(),
});
