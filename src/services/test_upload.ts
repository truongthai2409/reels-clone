// // Simple test for upload function
// export const testUploadFunction = async () => {
//   try {
//     // Create a test file
//     const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
//     console.log('🧪 Testing upload function...');
//     console.log('Test file:', testFile);
    
//     // Test the upload function
//     const { uploadFileWithProgress } = await import('./apollo.service');
    
//     const result = await uploadFileWithProgress(testFile, (progress) => {
//       console.log(`Progress: ${progress}%`);
//     });
    
//     console.log('✅ Upload successful:', result);
//     return result;
//   } catch (error) {
//     console.error('❌ Upload failed:', error);
//     throw error;
//   }
// };
