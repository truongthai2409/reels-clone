import React, { useState } from 'react';
import { UploadImage } from './upload_image/upload_image';
import { UploadFile } from './upload_file/upload_file';
import { UploadVideo } from './upload_video/upload_video';
import { UploadEtc } from './upload_video/upload_etc';

const tabs = [
  { key: 'image', label: '📷 Upload Image', component: <UploadImage /> },
  { key: 'file', label: '📁 Upload File', component: <UploadFile /> },
  { key: 'video', label: '🎥 Upload Video', component: <UploadVideo /> },
  { key: 'etc', label: '📎 Upload Etc', component: <UploadEtc /> },
];

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-md text-sm font-medium transition-all ${
        isActive
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
      }`}
    >
      {children}
    </button>
  );
};

type TabKey = (typeof tabs)[number]['key'];

const Upload: React.FC = () => {
  //upload screen
  // const [activeTab, setActiveTab] = useState<'image' | 'file' | 'video' | 'etc'>('image');
  const [activeTab, setActiveTab] = useState<TabKey>('image'); // tối ưu khi có nhiều key

  const activeComponent = tabs.find(tab => tab.key === activeTab)?.component;

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Upload System
        </h1>

        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {tabs.map(tab => (
              <TabButton
                key={tab.key}
                isActive={activeTab === tab.key}
                onClick={() => setActiveTab(tab.key as any)}
              >
                {tab.label}
              </TabButton>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {activeComponent}
        </div>
      </div>
    </div>
  );
};

export default Upload;
