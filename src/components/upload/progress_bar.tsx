import React from 'react';

const ProgressBar: React.FC<{ progress: number; stopUpload: () => void }> = ({
  progress,
  stopUpload,
}) => {
  return (
    <>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-blue-500 h-3 rounded-full transition-all"
          style={{ width: `${Math.floor(progress)}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
        {Math.floor(progress)}%
      </div>
      <button
        type="button"
        className="mt-2 px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm"
        onClick={stopUpload}
      >
        Cancel Upload
      </button>
    </>
  );
};

export default ProgressBar;
