import React, { useState } from 'react'
import { AWS_CONFIG } from './aws-config'
import AWS from 'aws-sdk'
const { nanoid } = require('nanoid')

const endpoint = 'https://wzodaxlz2j.execute-api.us-east-2.amazonaws.com/fovusAPI'


function Form () {
    const [textInput, setTextInput] = useState('')
    const [fileInput, setFileInput] = useState('')

    const handleTextInputChange = (event) => {
        setTextInput(event.target.value)
    }

    const handleFileInputChange = (event) => {
        setFileInput(event.target.files[0])
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        const s3 = new AWS.S3(AWS_CONFIG)
        const file = fileInput
        const fileName = file.name
        const bucketName = 'aws-brent-fulltime'
        const s3Path = `${bucketName}/${fileName}`     //This is S3 path
        const input = textInput
        const id = nanoid()

        s3.putObject(
            {
                //ACL: 'public-read',
                Bucket: bucketName,
                Key: s3Path,
                Body: file,
                ContentType: 'text/plain',
            },
            function (err, data) {
                if (err) {
                    console.log('Error uploading file:', err)
                } else {
                    console.log('File uploaded successfully:', data.Location)
                }
            }
        )
        const postData = async () => {
            const post = {
                id: 1,
                input_text: input,
                input_file_path: s3Path
            }
            console.log('Post', post)
            try {
                const response = await fetch(`${endpoint}/upload`, {
                    headers: 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                    method: 'POST',
                    body: JSON.stringify(post),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })

                if (!response.ok) {
                    throw new Error('Network response was not ok!')
                }
                const data = await response.json();;
                console.log('Data', data)
            } catch (err) {
                console.log('Error', err.message)
            }
        }
        postData()
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Text Input:
                    <input
                        type="text"
                        name="text-input"
                        value={textInput}
                        onChange={handleTextInputChange}
                    />
                </label>
                <br />
                <br />
                <label>
                    File Input:
                    <input
                        type="file"
                        name="file-input"
                        onChange={handleFileInputChange}
                    />
                </label>
                <br />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Form