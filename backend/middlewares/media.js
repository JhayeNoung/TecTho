const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Configure S3 Client
const client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});


const generatePresignedUrl = async (fileName) => {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    Key: `images/${fileName}`,  // Key must be "folder/your-fileName"
    ContentType: 'image/jpeg',  // Adjust based on the file type
  };
  
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/
  const command = new PutObjectCommand(input);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-s3-request-presigner/
  return getSignedUrl(client, command, { expiresIn: 60 * 5 }); // URL expires in 5 minutes
};

const generatePresignedDeleteUrl = async (fileName) => {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    Key: `images/${fileName}`,  // The S3 object key (path to your file)
  };

  // Create the DeleteObjectCommand for deleting the file
  const command = new DeleteObjectCommand(input);

  // Generate the presigned URL with a 5-minute expiry time
  return getSignedUrl(client, command, { expiresIn: 60 * 5 });
};


// Example Logic
const listObjects = async (folder) => {
    const input = {
      Bucket: process.env.BUCKET_NAME,
      Prefix: folder, // to get only from given folder
    }

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectVersionsCommand/
    const command = new ListObjectsV2Command(input);
    return client.send(command);
}


module.exports = { listObjects, generatePresignedUrl, generatePresignedDeleteUrl};


