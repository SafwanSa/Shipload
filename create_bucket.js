const AWS = require('aws-sdk');
const fs = require('fs');

const ID = 'AKIAIRHLOZ3FEOMDGPZQ';
const SECRET = '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';

// The name of the bucket that you have created
const BUCKET_NAME = 'shipmentsdocss';

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const uploadFile = (fileName) => {
  // Read content from the file
  const fileContent = fs.readFileSync(fileName);

  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: 'test.pdf', // File name you want to save as in S3
      Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};

module.exports = uploadFile;