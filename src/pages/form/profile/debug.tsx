import React from "react";

interface FormDebugProps {
  values: any;
  errors: any;
  touched: any;
}

export const FormDebug: React.FC<FormDebugProps> = ({ values, errors, touched }) => {
  return (
    <details className="mt-6">
      <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400">
        Debug values
      </summary>
      <pre className="text-xs bg-gray-50 dark:bg-gray-800 p-3 rounded-xl overflow-auto max-h-64">
        {JSON.stringify({ values, errors, touched }, null, 2)}
      </pre>
    </details>
  );
};
