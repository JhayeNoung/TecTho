const { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Configure S3 Client
const client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Function to generate a random path
const generateRandomPath = () => {
    return Math.random().toString(36).substring(2, 5);
};

function replaceSpacesWithUnderscore(input) {
    if (input.includes(" ")) {
        return input.replace(/ /g, "_");
    }
    return input;
}

// AWS S3 API Example
router.get('/aws-api', async (req, res) => {
    try {
        // configure the input parameters
        const input = {
            Bucket: process.env.BUCKET_NAME,
            Prefix: 'media/images/', // to get only from given folder
        }

        // Create the ListObjectsV2Command for listing objects in the bucket
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectVersionsCommand/
        const command = new ListObjectsV2Command(input);

        // Send the command to the S3 client
        const response = await client.send(command);

        // sww3 uses file path as key, in the following link key is "media/images/hello.jpg"
        // https://${process.env.BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/media/images/hello.jpg
        // concatenate your key to your bucket link
        const imageURIs = response.Contents
            .map((item) =>
                `https://${process.env.BUCKET_NAME}.s3.ap-southeast-2.amazonaws.com/${item.Key}`)

        res.send(response.Contents)
    }
    catch (error) {
        res.send(`${error}`)
    }
});



// Generate presigned URL for uploading files
router.post('/post-url', async (req, res) => {
    try {
        const { fileName } = req.body;
        console.log(fileName);
        var key = fileName.includes(".mp4") ? `media/videos/${replaceSpacesWithUnderscore(fileName)}` : `media/images/${replaceSpacesWithUnderscore(fileName)}`;

        // configure the input parameters 
        const input = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            ContentType: 'image/jpeg',  // Adjust based on the file type
        };

        // Create the PutObjectCommand for uploading the file
        const command = new PutObjectCommand(input);

        // Generate the presigned URL with a 5-minute expiry time
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-s3-request-presigner/
        const url = await getSignedUrl(client, command, { expiresIn: 60 * 5 }); // URL expires in 5 minutes

        res.json({ url });

    }
    catch (error) {
        res.status(500).send(`${error}`);
    }

});


// Generate presigned URL for deleting files
router.post('/delete-url', async (req, res) => {
    try {
        const { KEY } = req.body;

        // configure the input parameters
        const input = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${KEY}`,
        };

        // Create the DeleteObjectCommand for deleting the file
        const command = new DeleteObjectCommand(input);

        // Generate the presigned URL with a 5-minute expiry time
        const url = await getSignedUrl(client, command, { expiresIn: 60 * 5 });

        res.json({ url });
    }
    catch (error) {
        res.status(500).send(`${error}`);
    }
});

module.exports = router;