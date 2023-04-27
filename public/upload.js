const bucketName = 'your-bucket-name'
const s3Path = `${bucketName}/your-file-name.txt`

// Get the file from the file input field
const file = document.getElementById('file-input').files[0]

// Configure the S3 client
const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
    region: 'your-aws-region',
    credentials: {
        accessKeyId: 'your-access-key-id',
        secretAccessKey: 'your-secret-access-key'
    }
})

// Upload the file to S3
s3.putObject({
    Bucket: bucketName,
    Key: s3Path,
    Body: file
}, (err, data) => {
    if (err) {
        console.error(err)
    } else {
        console.log(`File uploaded successfully to ${s3Path}`)
    }
})