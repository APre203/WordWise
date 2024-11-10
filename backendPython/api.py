import requests
import json
import os
import json

class APIHandler():
    def __init__(self):
        self.API = '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'
        return

    def callAPI(self, content):
        # os.environ['API']
        response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {self.API}",
            # "HTTP-Referer": f"{YOUR_SITE_URL}", # Optional, for including your app on openrouter.ai rankings.
            # "X-Title": f"{YOUR_APP_NAME}", # Optional. Shows in rankings on openrouter.ai.
        },
        data=json.dumps({
            "model": "google/gemma-2-9b-it:free", # Optional
            "messages": [
            {
                "role": "system",
                "content": '''
                    You are a word generator that generates 4 DIFFERENT synonyms for EACH word in the list.
                    You must a correctly formated return a map that links each given word as a key to the 4 different synonyms as its value in a properly formated list.
                    DO NOT SAY ANYTHING ELSE AND DO NOT INCLUDE ANY BACKSLASHES
                '''
            },
            {
                "role":"user",
                "content":f'{content}'
            }
            ]
            
        })
        )
        data = response.json()
        userData = json.loads(data['choices'][0]['message']['content']) 
        print(userData)
        return userData