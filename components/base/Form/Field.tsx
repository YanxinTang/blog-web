import React from 'react';
import { Field as RcField } from 'rc-field-form';
import { FieldProps as RcFieldProps } from 'rc-field-form/lib/Field';
import { Meta } from 'rc-field-form/lib/interface';

interface FieldProps extends RcFieldProps {
  label?: string;
}

const MetaView = (props: Meta) => {
  if (props.errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 text-red-400">
      {props.errors.map((error, i) => {
        return (
          <p key={i} className="h-4 mb-0 text-sm">
            {error}
          </p>
        );
      })}
    </div>
  );
};

function genEmptyMeta(): Meta {
  return {
    errors: [],
    warnings: [],
    touched: false,
    validating: false,
    name: [],
  };
}

export default function Field(props: FieldProps) {
  const [meta, setMeta] = React.useState<Meta>(() => genEmptyMeta());
  const { name, label, messageVariables } = props;

  let variables: Record<string, string> = {};
  if (typeof label === 'string') {
    variables.label = label;
  } else if (name) {
    variables.label = String(name);
  }
  if (messageVariables) {
    variables = { ...variables, ...messageVariables };
  }

  const handleMetaChange = (meta: Meta) => {
    setMeta(meta);
  };

  return (
    <div className={meta.errors.length ? '' : 'mb-4'}>
      <RcField {...props} messageVariables={variables} onMetaChange={handleMetaChange}></RcField>
      <MetaView {...meta}></MetaView>
    </div>
  );
}
