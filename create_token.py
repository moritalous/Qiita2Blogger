import os
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

CREDENTIALS_JSON = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/blogger']

credentials = None

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

