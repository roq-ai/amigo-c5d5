import * as yup from 'yup';

export const messageValidationSchema = yup.object().shape({
  content: yup.string().required(),
  schedule_time: yup.date(),
  user_id: yup.string().nullable(),
  template_id: yup.string().nullable(),
});
