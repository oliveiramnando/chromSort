
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

function sortPlaylist(playlistId) {
    window.location.href = `http://localhost:8888/sort_playlist?playlist_id=${playlistId}`;
}

 function popupCard(playlistID) {
    let popup = document.getElementById("playlist__card");
    popup.style.display = "block";

    let card = document.createElement("div");

    popup.appendChild(card);
}

fetchPlaylists();