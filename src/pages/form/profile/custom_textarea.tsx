import type { FieldProps } from 'formik';

export const CustomTextarea: React.FC<
  FieldProps & { label?: string; rows?: number; placeholder?: string }
> = ({ field, form: { touched, errors }, label, rows = 4, placeholder }) => (
  <div className="flex flex-col gap-1 md:col-span-2">
    {label && <label className="text-sm font-medium">{label}</label>}
    <textarea
      {...field}
      rows={rows}
      placeholder={placeholder}
      className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    />
    {touched[field.name] && errors[field.name] && (
      <span className="text-sm text-red-600">
        {errors[field.name] as string}
      </span>
    )}
  </div>
);
