## Procedure to run the project

1. cd into the /frontend using `cd /frontend`
2. type `npm start` to run the front-end

## Let me add

1. I think the code cannot be tested because I delete the AWS credentials files, I am not sure if the front-end can request Gateway API without authentication.

2. I have finished the script which can download txt file from s3 and query item in DynamoDB, appen the text into file and upload to s3 and DynamoDB. which is in the script.py file, I remove the credential file.

3. I don't know how to how to let the instance execute specified bash code when it starts. I wrote the bash code which can update the linux environment, download script file from s3 and execute it. I tested it worked in AWS Linux, but I don't know how to execute the given bash code automatically when the instance starts. I tried to use `UserData` parameter in `ec2.run_instance` to let the running instance execute the bash code in `user_data` string, but I failed. I want to figure out how to overcome this challenge. Can you give me the hint? The code in lambda function part is attached as follows.

```
import boto3
import time
import os

ec2 = boto3.client('ec2')

def lambda_handler(event, context):
    s3_bucket_name = 'aws-brent-fulltime'
    s3_file_key = 'script'


    user_data = """#!/bin/bash
    S3_BUCKET="aws-brent-fulltime"
    PYTHON_SCRIPT_FILE="script.py
    if ! command -v aws &> /dev/null
    then
        echo "AWS CLI is not installed. Installing it now..."
        yum update -y
        yum install pip
        yes Y | pip install boto3
    fi
    export AWS_ACCESS_KEY_ID=XXXXXXXXXXX
    export AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXX
    aws s3 cp s3://${S3_BUCKET}/${PYTHON_SCRIPT_FILE} ~/${PYTHON_SCRIPT_FILE} --region us-east-2
    python3 ~/${PYTHON_SCRIPT_FILE}
    """


    response = ec2.run_instances(
        ImageId="ami-02f97949d306b597a",
        MinCount=1,
        MaxCount=1,
        InstanceType="t2.micro",
        UserData=user_data
    )
```

## References

1. Boto3 documentation [https://boto3.amazonaws.com/v1/documentation/api/latest/index.html]
2. AWS Resource center [https://aws.amazon.com/getting-started/hands-on/?getting-started-all.sort-by=item.additionalFields.content-latest-publish-date&getting-started-all.sort-order=desc&awsf.getting-started-category=*all&awsf.getting-started-level=*all&awsf.getting-started-content-type=*all]
3. Youtube [https://www.youtube.com/watch?v=typ-AJQGKKI]
