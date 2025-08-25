import { ErrorMessage } from 'formik';

export function InlineError({ name }: { name: string }) {
  return (
    <ErrorMessage
      name={name}
      render={msg => (
        <div className="mt-1 text-sm text-red-600" role="alert">
          {msg}
        </div>
      )}
    />
  );
}
