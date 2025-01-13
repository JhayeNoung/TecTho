import axios from 'axios';
import apiMovie from '@/services/api-movie';

/*
Backend Response Logic

router.post('/generate-presigned-url', async (req, res) => {
    const { fileName } = req.body;
    
    try {
      const url = await generatePresignedUrl(fileName);
      res.json({ url });
      
    } catch (error) {
      res.status(500).send(`${error}`);
    }

});

*/

interface PresignedUrlResponse {
  url: string;
}

// Upload a file to S3
export async function uploadFile(file: File) {
  try {

    // Get the presigned URI from the backend
    const response = await apiMovie.post<PresignedUrlResponse>('/movies/generate-presigned-url', { fileName: file.name });
    const presignedUrl = response.data.url;

    // Upload the file directly via presigned URL
    await axios
      .put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type, // Set the file's MIME type
        },
      })
      .then(response => console.log(response))

    // Return the public URL or key("folderName/fileName") of the uploaded file
    // For example: `https://your-s3-bucket.s3.amazonaws.com/${key}`
    return presignedUrl.split('?')[0]; // Remove query params to get the public URL
  }

  catch (error) {
    console.error('File upload failed:', error);
    return null
  }
}

// Upload a file to S3
export async function deleteFile(file: File) {
  try {

    // Get the presigned URI from the backend
    const response = await apiMovie.post<PresignedUrlResponse>('/movies/generate-presigned-delete-url', { fileName: file.name });
    const presignedUrl = response.data.url;


    // Upload the file directly via presigned URL
    await axios
      .delete(presignedUrl)
      .then(response => {
        console.log(response)
        if (response.status == 204) throw new Error("No content")
      })
  }

  catch (error) {
    console.error('File delete failed:', error);
  }
}

