
async function fetchPlaylists() {
    try {
        const response = await fetch("http://localhost:8888/get_playlists");
        const data = await response.json();

        const playlistList = document.getElementById("playlists");
        data.items.forEach(playlist => {
            let li = document.createElement("li");
            li.textContent = playlist.name;
            li.onclick = () => sortPlaylist(playlist.id);
            playlistList.appendChild(li);
        });
    }
    catch(error) {
        console.error(error);
    }
}

function sortPlaylist(playlistId) {
    window.location.href = `http://localhost:8888/sort_playlist?playlist_id=${playlistId}`;
}

fetchPlaylists();   // calls when page loads