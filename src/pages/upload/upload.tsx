import React, { useState } from "react";
import { UploadImage } from "./upload_image/upload_image";
// import { UploadFile } from "./upload_file/upload_file";
// import { UploadVideo } from "./upload_video/upload_video";

 const Upload: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'image' | 'file' | 'video'>('image');

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Upload System</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('image')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'image'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              📷 Upload Image
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'file'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              📁 Upload File
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${activeTab === 'video'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
            >
              🎥 Upload Video
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {activeTab === 'image' && <UploadImage />}
          {/* {activeTab === 'file' && <UploadFile />}
          {activeTab === 'video' && <UploadVideo />} */}
        </div>
      </div>
    </div>
  );
};

export default Upload;