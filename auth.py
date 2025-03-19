import os
import random
import string
import requests
import urllib.parse
from dotenv import load_dotenv
from flask import Flask, redirect, request, jsonify, make_response, render_template

load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = "http://localhost:8888/callback" 
TOKEN_URL = "https://accounts.spotify.com/api/token"

app = Flask(__name__)


def generate_random_string(length=16):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

STATE_KEY = "spotify_auth_state"

@app.route("/login")
def login():
    """ Redirect user to Spotify authorization page """
    state = generate_random_string(16)

    # Set cookie for state parameter to prevent CSRF attacks
    response = make_response(redirect(
        "https://accounts.spotify.com/authorize?" + urllib.parse.urlencode({
            "response_type": "code",
            "client_id": CLIENT_ID,
            "scope": "user-read-private user-read-email playlist-read-private playlist-modify-private",
            "redirect_uri": REDIRECT_URI,
            "state": state
        })
    ))
    response.set_cookie(STATE_KEY, state)
    return response

@app.route("/callback")
def callback():
    """ Handle callback from Spotify after user login """
    auth_code = request.args.get("code")
    state = request.args.get("state")
    stored_state = request.cookies.get(STATE_KEY)

    if not auth_code or state != stored_state:
        return redirect("/#" + urllib.parse.urlencode({"error": "state_mismatch"}))

    # Exchange authorization code for an access token
    token_data = {
        "grant_type": "authorization_code",
        "code": auth_code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    
    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(TOKEN_URL, data=token_data, headers=headers)
    token_json = response.json()

    if "access_token" not in token_json:
        return redirect("/#" + urllib.parse.urlencode({"error": "invalid_token"}))

    access_token = token_json.get("access_token")
    refresh_token = token_json.get("refresh_token")


    # Fetch user info using the access token
    user_info_response = requests.get(
        "https://api.spotify.com/v1/me",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    with open("tokens.txt", "w") as f:
        f.write(f"ACCESS_TOKEN={access_token}\nREFRESH_TOKEN={refresh_token}")

    # Redirect to frontend to display playlists
    return redirect("/dashboard")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")
    
@app.route("/refresh_token")
def refresh_token():
    """ Refresh the access token using the refresh token """
    refresh_token = request.args.get("refresh_token")

    token_data = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }

    headers = {"Content-Type": "application/x-www-form-urlencoded"}
    response = requests.post(TOKEN_URL, data=token_data, headers=headers)
    token_json = response.json()

    return jsonify({
        "access_token": token_json.get("access_token"),
        "refresh_token": token_json.get("refresh_token")
    })


@app.route("/get_playlists")
def get_playlists():
    """Fetch user's playlists and return them as JSON"""
    
    # Load access token from saved file
    with open("tokens.txt", "r") as f:
        tokens = dict(line.strip().split("=") for line in f)

    access_token = tokens.get("ACCESS_TOKEN")

    headers = {"Authorization": f"Bearer {access_token}"}

    playlists = []

    next_url = "https://api.spotify.com/v1/me/playlists?limit=50&offset=0"
    while next_url:
        response = requests.get(next_url, headers=headers)
        data = response.json()

        if "items" in data:
            playlists.extend(data["items"])

        next_url = data.get("next")
        
        
    # response = requests.get("https://api.spotify.com/v1/me/playlists", headers=headers)
    # playlists = response.json()

    return jsonify({"playlists": playlists})


@app.route("/get_tracks")
def get_tracks():
    """Fetch tracks from a specific playlist"""
    
    playlist_id = request.args.get("playlist_id")
    if not playlist_id:
        return jsonify({"error": "Missing playlist_id"}), 400
    
    with open("tokens.txt", "r") as f:
        tokens = dict(line.strip().split("=") for line in f)

    access_token = tokens.get("ACCESS_TOKEN")
    headers = {"Authorization": f"Bearer {access_token}"}

    tracks = []
    next_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=100"

    while next_url:
        response = requests.get(next_url, headers=headers)
        data = response.json()

        if "items" in data:
            # tracks.extend(data["items"])

            for item in data["items"]:
                track = item.get("track")
                if track:
                    track_info = {
                        "name": track.get("name"),
                        "cover_url": track.get("album", {}).get("images", [{}])[0].get("url")
                    }
                    tracks.append(track_info)


        next_url = data.get("next")

    return jsonify({"tracks": tracks})

@app.route("/sort_playlist")
def sort_playlist():

    return jsonify()


if __name__ == "__main__":
    print("Listening on port 8888...")
    app.run(port=8888, debug=True)
