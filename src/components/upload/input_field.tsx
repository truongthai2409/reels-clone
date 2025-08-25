import { useField } from 'formik';
import React from 'react';

interface InputFieldProps {
  label?: string;
  name: string;
  type?: string;
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  ...props
}) => {
  const [field, meta] = useField({ ...props, type });

  return (
    <div className="mb-3 flex items-center gap-2">
      <input
        className="border rounded-md p-2"
        type={type}
        {...field}
        {...props}
      />
      <label htmlFor={props.name}>{label}</label>
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm">{meta.error}</div>
      )}
    </div>
  );
};
