from flask import Flask, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app)

CLIENT_ID = os.environ.get("CLIENT_ID")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET")

STREAMERS = [
    "Tatohaoe", "lorddekko", "nightclaim",
    "partyman96", "etherias_gaming", "ciruelitaruby",
    "nhn_forever"
]

def obtener_token():
    res = requests.post("https://id.twitch.tv/oauth2/token", params={
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "grant_type": "client_credentials"
    })
    return res.json()["access_token"]

@app.route("/streams")
def streams():
    token = obtener_token()
    headers = {
        "Client-ID": CLIENT_ID,
        "Authorization": f"Bearer {token}"
    }

    params_streams = [("user_login", s) for s in STREAMERS]
    params_users = [("login", s) for s in STREAMERS]

    res_streams = requests.get("https://api.twitch.tv/helix/streams", headers=headers, params=params_streams)
    data_streams = res_streams.json().get("data", [])

    res_users = requests.get("https://api.twitch.tv/helix/users", headers=headers, params=params_users)
    data_users = res_users.json().get("data", [])

    avatares = {u["login"].lower(): u["profile_image_url"] for u in data_users}

    for stream in data_streams:
        stream["avatar"] = avatares.get(stream["user_login"].lower(), "")

    data_streams.sort(key=lambda x: x["viewer_count"], reverse=True)

    return jsonify({"streams": data_streams, "avatares": avatares})

if __name__ == "__main__":
    app.run(port=5000)