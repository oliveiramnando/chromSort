
let cachedPlaylists = [];
let cachedTracks = [];

async function fetchPlaylists() {
    try {
        const response = await fetch("http://localhost:8888/get_playlists");
        const data = await response.json();

        let count = 0;
        const playlistList = document.getElementById("playlists");
        playlistList.innerHTML = "";

        if (!data.playlists || data.playlists.length === 0) {
            playlistList.innerHTML = "<p>No playlists found.</p>";
            return;
        }

        data.playlists.forEach(playlist => {
            let div = document.createElement("div");
            div.textContent = playlist.name; 

            div.onclick = () => popupCard(playlist.id); 

            playlistList.appendChild(div);
            count += 1;
        });
        console.log(count);
    }
    catch(error) {
        console.error(error);
    }
}

function allPlaylists() {
    
}

function yourPlaylists() {

}

function playlistsYouFollow() {
    
}

async function fetchTracks(playlistId) {
    try {
        const url = `http://localhost:8888/get_tracks?playlist_id=${playlistId}`;
        const response = await fetch(url);

        console.log("fetching tracks");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        cachedTracks = data.tracks;

        let trackList = document.getElementById("playlist__tracks");
        trackList.innerHTML = "";

        if (!data.tracks || !Array.isArray(data.tracks) || data.tracks.length === 0) {
            trackList.innerHTML = "<p>No tracks found.</p>";
            return;
        }

        data.tracks.forEach(track => {
            if (!track || !track.name || !track.cover_url) {
                console.warn("Skipping invalid track:", track);
                return;
            }

            let div = document.createElement("div");
            div.textContent = track.name;
            div.style.backgroundImage = `url(${track.cover_url})`;

            trackList.appendChild(div);
        });
        
        console.log("finished fetching");
    }
    catch (error) {
        console.error("Error fetching tracks:", error);
    }
}

async function sortPlaylist(playlistId) {
    try {
        console.log("in sortPLaylist");
        const url = `http://localhost:8888/sort_playlist?playlist_id=${playlistId}`;
        const response = await fetch(url);
        console.log("after fetching the sorted playlist");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log(data);

        let trackList = document.getElementById("sorted__tracks");

        console.log("setting innerHTML to ''");
        trackList.innerHTML = "";

        //  NOTE: ITS NOT .tracks TRACKS ISNT A THINK ANYMORE BECAUSE I CHANGED IT
        if (!data.sortedTracks || !Array.isArray(data.sortedTracks) || data.sortedTracks.length === 0) {
            trackList.innerHTML = "<p>No tracks found.</p>";
            console.log("something went wrong");
            return;
        }

        console.log("displaying playlist");

        data.sortedTracks.forEach(track => {
            if (!track || !track.trackName || !track.track_cover_url) {
                console.warn("Skipping invalid track:", track);
                if (!track){
                    console.log("no track");
                }
                if (!track.trackName) {
                    console.log("No track name");
                }
                if(!track.track_cover_url) {
                    console.log("no track cover url");
                }
                return;
            }

            let div = document.createElement("div");
            div.textContent = track.trackName;
            div.style.backgroundImage = `url(${track.track_cover_url})`;

            trackList.appendChild(div);
        });
    }
    catch (error) {
        console.error("Error fetching tracks:", error);
    }
}

function popupCard(playlistID) {
    let popup = document.getElementById("playlist__card");
    popup.style.display = "block";

    fetch(`http://localhost:8888/get_tracks?playlist_id=${playlistID}`)
        .then(response => response.json())
        .then(data => {
            
            let chromSortButton = document.getElementById("sortButton");

            chromSortButton.onclick = () => sortedPopUP(playlistID);

            let trackList = document.getElementById("playlist__tracks");
            trackList.innerHTML = "";

            data.tracks.forEach(track => {
                let div = document.createElement("div");
                div.style.backgroundImage = `url(${track.cover_url})`;
                trackList.appendChild(div);
            });
        })
        .catch(error => console.error(error));
}

function sortedPopUP(playlistID) {
    let popup = document.getElementById("chromSorted");
    popup.style.display = "block";

    console.log("sort button got clicked");

    sortPlaylist(playlistID);
}

fetchPlaylists();