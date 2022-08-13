import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

args = sys.argv

WORK_DIR=args[1]
POST_ID=args[2]
BLOG_ID=args[3]

CREDENTIALS_JSON = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/blogger']

credentials = None

if os.path.exists(CREDENTIALS_JSON):
    credentials = Credentials.from_authorized_user_file(
        CREDENTIALS_JSON, SCOPES)

if not credentials or not credentials.valid:
    if credentials and credentials.expired and credentials.refresh_token:
        credentials.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            'client_secrets.json', scopes=SCOPES)
        flow.run_local_server(prompt='consent')

        credentials = flow.credentials

        with open(CREDENTIALS_JSON, 'w') as token:
            token.write(credentials.to_json())

with open(f'{WORK_DIR}/{POST_ID}.html') as f:
  post = f.read().strip()
with open(f'{WORK_DIR}/{POST_ID}.tags.txt') as f:
  tags = f.read().split('\n')
with open(f'{WORK_DIR}/{POST_ID}.title.txt') as f:
  title = f.read().strip()
with open(f'{WORK_DIR}/{POST_ID}.created_at.txt') as f:
  created_at = f.read().strip()

body= {
  "content": post,
  "labels": tags,
  "title": title,
  "published": created_at
}

with build('blogger', 'v3', credentials=credentials) as service:

    response = service.posts().insert(
        blogId=BLOG_ID,
        body=body,
        isDraft=True
    ).execute()

    print(response)
