import React from 'react';
import { FormProvider } from 'rc-field-form';
import { Locale } from '../locale';
import defaultLocale from '../locale/default';

interface ConfigProviderProps {
  children?: React.ReactNode;
  locale?: Locale;
}

export default function ConfigProvider(props: ConfigProviderProps) {
  const validateMessages =
    props.locale?.Form?.defaultValidateMessages ?? defaultLocale?.Form?.defaultValidateMessages ?? {};
  return <FormProvider validateMessages={validateMessages}>{props.children}</FormProvider>;
}
