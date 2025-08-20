import type { FieldProps } from "formik";
import React from "react";

export const CustomInput: React.FC<FieldProps & { placeholder?: string }> = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors },
  placeholder,
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        {...field}
        {...props}
        placeholder={placeholder}
        className="px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {touched[field.name] && errors[field.name] && (
        <span className="text-sm text-red-600">{errors[field.name] as string}</span>
      )}
    </div>
  );
};
