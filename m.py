import os

import requests
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
import json
import random

load_dotenv()

session = requests.session()

url = os.getenv('TRADE_URL')
headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,en;q=0.9',
    'Origin': 'https://widgetsenvironment.activtrades.com',
    'Referer': 'https://widgetsenvironment.activtrades.com/',
    'Sec-Ch-Ua': '"Not:A-Brand";v="99", "Chromium";v="112"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.5615.138 Safari/537.36'
}

# make a flask endpoint to return the json
app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})
# cache = Cache(app, config={'CACHE_TYPE': 'simple', 'CACHE_DEFAULT_TIMEOUT': 30})  # 1800 seconds = 30 minutes


@app.route('/values')
def get_json():
    # response = session.get(url, headers=headers)
    # j = response.json()
    # j['spread'] = j['lastAsk'] / 100 - j['lastBid'] / 100
    # print(j.get('lastBid'), j)
    # return json.dumps(j)
    last_bid = random.randint(1341575, 1342675)
    last_ask = random.randint(1341575, 1342675)
    spread = abs(last_ask/100 - last_bid/100)
    return json.dumps(
        {
            "lastBid": last_bid,
            "lastAsk": last_ask,
            "spread": spread,
        }
    )


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
