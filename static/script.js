
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
            // div.classList.add("playlist__item");
            div.textContent = playlist.name;

            // div.innerHTML = `
            //     <img src="${playlist.images.length ? playlist.images[0].url : '/static/default.png'}" alt="${playlist.name}" class="playlist__image">
            //     <h3>${playlist.name}</h3>
            //     <p>${playlist.tracks.total} songs</p>
            // `;

            // div.textContent = playlist.name;
            // li.onclick = () => sortPlaylist(playlist.id); 

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

fetchPlaylists();   // calls when page loads