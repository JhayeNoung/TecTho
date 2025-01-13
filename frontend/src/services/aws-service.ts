import apiMovie from '@/services/api-movie';

// Upload a file to S3
export async function uploadFile(poster: File) {
  try {

    // Get the presigned URI from the backend
    const response = await apiMovie.post('/presigned-url/post-url', { fileName: poster.name });
    const url = response.data.url;

    // Upload the file to S3 using the pre-signed URL
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': poster.type },
      body: poster,
    });

    // Return the URL before question mark of the uploaded file
    // `https://your-s3-bucket.s3.amazonaws.com/key?...`
    return url.split('?')[0];
  }

  catch (error) {
    console.error('File upload failed:', error);
    return null
  }
}


// Delete a file from S3
export async function deleteFile(poster: File) {
  try {

    // Get the presigned URI from the backend
    const response = await apiMovie.post('/presigned-url/delete-url', { fileName: poster.name });
    const url = response.data.url;

    // Delete the file from S3 using the pre-signed URL
    await fetch(url, {
      method: 'DELETE',
    });
  }
  catch (error) {
    console.error('File delete failed:', error);
  }
}

