import { useField } from 'formik';

type Option = { value: string; label: string };

type RadioGroupProps = {
  name: string;
  label?: string;
  options: Option[];
  className?: string;
  showInlineError?: boolean;
};

export const CustomRadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  className,
  showInlineError = false,
}) => {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <div className={className}>
      {label && (
        <legend className="block text-sm font-medium mb-1">{label}</legend>
      )}

      <div className="flex items-center gap-4">
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={field.value === opt.value}
              onChange={() => helpers.setValue(opt.value)}
              onBlur={field.onBlur}
            />
            {opt.label}
          </label>
        ))}
      </div>

      {showInlineError && meta.touched && meta.error && (
        <span className="text-sm text-red-600 mt-1 block">{meta.error}</span>
      )}
    </div>
  );
};
