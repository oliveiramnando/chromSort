
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
    // try {
    //     const response = await fetch(`http://localhost:8888/get_tracks?playlist_id=${playlistId}`);
    //     const data = await response.json();

    //     let trackList = document.getElementById("playlist__tracks");
    //     trackList.innerHTML = "";

    //     if (!data.tracks || data.tracks.length === 0) {
    //         trackList.innerHTML = "<p>No tracks found.</p>";
    //         return;
    //     }

    //     data.tracks.forEach(track => {
    //         if (!track.name || !track.cover_url) return; 

    //         let div = document.createElement("div");
    //         div.textContent = track.name;
    //         div.style.backgroundImage = `url(${track.cover_url})`;

    //         trackList.appendChild(div);
    //     });
    // }
    // catch(error) {
    //     console.error(error);
    // }
    console.log("fetchTracks called with playlistId:", playlistId);

    try {
        const url = `http://localhost:8888/get_tracks?playlist_id=${playlistId}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

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
    }
    catch (error) {
        console.error("Error fetching tracks:", error);
    }
    
}

function sortPlaylist(playlistId) {
    window.location.href = `http://localhost:8888/sort_playlist?playlist_id=${playlistId}`;
}

function popupCard(playlistID) {
    let popup = document.getElementById("playlist__card");
    popup.style.display = "block";

    fetch(`http://localhost:8888/get_tracks?playlist_id=${playlistID}`)
        .then(response => response.json())
        .then(data => {
            let trackList = document.getElementById("playlist__tracks");
            trackList.innerHTML = "";

            data.tracks.forEach(track => {
                let div = document.createElement("div");
                // div.textContent = track.track.name;
                div.style.backgroundImage = `url(${track.cover_url})`;
                trackList.appendChild(div);
            });
        })
        .catch(error => console.error(error));
}


fetchPlaylists();