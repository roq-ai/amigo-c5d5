import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMessage } from 'apiSdk/messages';
import { Error } from 'components/error';
import { messageValidationSchema } from 'validationSchema/messages';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { MessageTemplateInterface } from 'interfaces/message-template';
import { getUsers } from 'apiSdk/users';
import { getMessageTemplates } from 'apiSdk/message-templates';
import { MessageInterface } from 'interfaces/message';

function MessageCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MessageInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMessage(values);
      resetForm();
      router.push('/messages');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MessageInterface>({
    initialValues: {
      content: '',
      schedule_time: new Date(new Date().toDateString()),
      user_id: (router.query.user_id as string) ?? null,
      template_id: (router.query.template_id as string) ?? null,
    },
    validationSchema: messageValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Message
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="content" mb="4" isInvalid={!!formik.errors?.content}>
            <FormLabel>Content</FormLabel>
            <Input type="text" name="content" value={formik.values?.content} onChange={formik.handleChange} />
            {formik.errors.content && <FormErrorMessage>{formik.errors?.content}</FormErrorMessage>}
          </FormControl>
          <FormControl id="schedule_time" mb="4">
            <FormLabel>Schedule Time</FormLabel>
            <Box display="flex" maxWidth="100px" alignItems="center">
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.schedule_time ? new Date(formik.values?.schedule_time) : null}
                onChange={(value: Date) => formik.setFieldValue('schedule_time', value)}
              />
              <Box zIndex={2}>
                <FiEdit3 />
              </Box>
            </Box>
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <AsyncSelect<MessageTemplateInterface>
            formik={formik}
            name={'template_id'}
            label={'Select Message Template'}
            placeholder={'Select Message Template'}
            fetcher={getMessageTemplates}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.template_name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'message',
    operation: AccessOperationEnum.CREATE,
  }),
)(MessageCreatePage);
