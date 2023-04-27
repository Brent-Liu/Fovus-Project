import boto3
import os

#configuration part
session = boto3.Session(profile_name='s3_dev')

client = session.client('s3')

dynamodb = session.resource('dynamodb')

table_name = 'fovustable'
table = dynamodb.Table(table_name)
item_id = 1
response = table.get_item(Key={'id': item_id})
input_file_name = response['Item']['input_file_path']
input_text = response['Item']['input_text']


bucketname, file = os.path.split(input_file_name)

s3path = input_file_name


cur_path = os.getcwd()

filename_down = os.path.join(cur_path, '', file)
client.download_file(Bucket=bucketname, Key=s3path, Filename=filename_down)


output_file = "output"

with open(filename_down, 'r') as f:
    file_content = f.read()

output_content = f"{file_content}:{input_text}"

with open(f"{output_file}.txt", 'w') as f:
    f.write(output_content)


# upload part
filename = os.path.join(cur_path, '', output_file)

client.upload_file(f"{filename}.txt", bucketname, f"{bucketname}/{output_file}.txt") 


item = {
    'id': 2, 
    'output_file_path':  f'{bucketname}/{output_file}.txt'  # Replace with your output file path
}


# Insert the item into the table
table.put_item(
    Item=item
)