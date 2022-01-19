import React, { useState } from 'react';
import styles from './InputByte.module.scss';
import { mergeClassNames } from 'utils';

const BYTE_UNITS = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
const BYTE_UNITS_BASE = BYTE_UNITS.map((_, i) => Math.pow(1024, i));

export interface ByteValue {
  number: number;
  unit: number;
}

interface InputByteProps {
  value?: Partial<ByteValue>;
  placeholder?: HTMLInputElement['placeholder'];
  onChange?: (value: ByteValue | undefined) => void;
}

function InputByte(props: InputByteProps) {
  const unitDisplayName = BYTE_UNITS;
  const [number, setNumber] = useState<number | ''>('');
  const [unit, setUnit] = useState(0);

  const { value, onChange } = props;

  const triggerChange = (newValue: Partial<ByteValue>) => {
    onChange?.({ number: number || 0, unit, ...value, ...newValue });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setNumber('');
      onChange?.(undefined);
      return;
    }
    const newNumber = parseInt(e.target.value || '0', 10);
    if (value === undefined || !('number' in value)) {
      setNumber(newNumber);
    }
    triggerChange({ number: newNumber });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = parseInt(e.target.value || '0', 10);
    if (Number.isNaN(unit)) {
      return;
    }
    if (value === undefined || !('exp' in value)) {
      setUnit(newUnit);
    }
    triggerChange({ unit: newUnit });
  };

  const classNames = mergeClassNames(styles['input-byte'], 'flex flex-row');

  return (
    <div className={classNames}>
      <div className="flex-grow">
        <input
          className={styles.input}
          type="number"
          value={value?.number ?? number}
          placeholder={props.placeholder}
          onChange={handleChange}
        />
      </div>
      <select className={styles.unit} onChange={handleSelectChange} value={value?.unit ?? unit}>
        {unitDisplayName.map((name, i) => (
          <option key={name} value={i}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}

InputByte.parseByteValue = function (rawValue: number): ByteValue {
  for (let i = BYTE_UNITS_BASE.length - 1; i > 0; i--) {
    const base = BYTE_UNITS_BASE[i];
    if (rawValue % base === 0) {
      return { number: Math.floor(rawValue / base), unit: i };
    }
  }
  return { number: rawValue, unit: 0 };
};

export default InputByte;
