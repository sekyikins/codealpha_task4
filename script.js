let progress = document.getElementById("progress");
let volume = document.getElementById("volume");
let song = document.getElementById("song");
let playPauseIcon = document.getElementById("playPauseIcon");
let songImg = document.getElementById("song-img");
let songTitle = document.querySelector(".song-title");
let songArtist = document.querySelector(".artist");

// List of songs
let songs = [
    {
        title: "Diamonds",
        artist: "Rihanna",
        src: "Assets/Diamonds.mp3",
        img: "Assets/lonely1.jpg"
    },
    {
        title: "Halo",
        artist: "Beyoncé",
        src: "Assets/Halo.mp3",
        img: "Assets/smoke.jpg"
    },
    {
        title: "Lonely",
        artist: "Akon",
        src: "Assets/Lonely.mp3",
        img: "Assets/lonely.jpg"
    }
];

let currentSongIndex = Math.floor(Math.random() * songs.length);

// Function to Load a Song
function loadSong(index) {
    let selectedSong = songs[index];
    song.src = selectedSong.src;
    songTitle.textContent = selectedSong.title;
    songArtist.textContent = selectedSong.artist;
    songImg.src = selectedSong.img;
    
    // Reset progress bar
    progress.value = 0;
}

song.onloadedmetadata = function () {
    progress.max = Math.floor(song.duration); // Set max to full song duration
    progress.value = 0; // Reset progress to start
};

// Update progress bar as song plays
setInterval(() => {
    progress.value = Math.floor(song.currentTime); // Ensure progress updates correctly
}, 500);

// Allow user to seek within the song
progress.addEventListener("input", function () {
    song.currentTime = progress.value; // Sync slider with playback
});

// Function to refresh page
function refresh() {
    location.reload();
}

// Function to Play or Pause Song
function playPause() {
    if (song.paused) {
        song.play();
        playPauseIcon.classList.add("fa-pause");
        playPauseIcon.classList.remove("fa-play");
        songImg.classList.add("rotate");
        songImg.style.animationPlayState = "running";
    } else {
        song.pause();
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
        songImg.style.animationPlayState = "paused";
    }
}

// Function to Play Next Song
function next() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    let wasPlaying = !song.paused;
    loadSong(currentSongIndex);
    
    if (wasPlaying) { // If the previous song was playing, play the new one
        song.play();
        playPauseIcon.classList.add("fa-pause");
        playPauseIcon.classList.remove("fa-play");
        songImg.style.animationPlayState = "running"; // Continue rotating
    } else { // If the previous song was paused, keep the new one paused
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
        songImg.style.animationPlayState = "paused"; // Pause rotation
    }
}

// Function to Play Previous Song
function previous() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    let wasPlaying = !song.paused;
    loadSong(currentSongIndex);
    
    if (wasPlaying) { // If the previous song was playing, play the new one
        song.play();
        playPauseIcon.classList.add("fa-pause");
        playPauseIcon.classList.remove("fa-play");
        songImg.style.animationPlayState = "running"; // Continue rotating
    } else { // If the previous song was paused, keep the new one paused
        playPauseIcon.classList.remove("fa-pause");
        playPauseIcon.classList.add("fa-play");
        songImg.style.animationPlayState = "paused"; // Pause rotation
    }
}

function downloadSong() {
    const songTitle = document.querySelector(".song-title").textContent;
    const songArtist = document.querySelector(".artist").textContent;

    const download = confirm(`Download "${songTitle}" by ${songArtist}?`);
        if (download) {
            const link = document.createElement('a');
            link.href = song.src;
            link.download = song.src.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
}

// Auto-Play Next Song When Current Song Ends
song.addEventListener("ended", function () {
    next(); // Move to the next song
    song.play(); // Ensure the next song starts playing
    playPauseIcon.classList.add("fa-pause");
    playPauseIcon.classList.remove("fa-play");
});


// Volume Control
song.volume = volume.value / 100;
volume.addEventListener("input", function () {
    song.volume = volume.value / 100;
});

// Update Progress Bar
setInterval(() => {
    if (!song.paused) {
        progress.value = song.currentTime;
    }
}, 500);

progress.onchange = function () {
    song.currentTime = progress.value;
};

// Space Bar Controls Play/Pause
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        event.preventDefault();
        playPause();
    }
    else if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        next();
    }
    else if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        previous();
    }
    else if (event.code === "ArrowLeft") { 
        // Left Arrow → Rewind 5 seconds
        song.currentTime = Math.max(song.currentTime - 5, 0);
    }
    else if (event.code === "ArrowRight") { 
        // Right Arrow → Forward 5 seconds
        song.currentTime = Math.min(song.currentTime + 5, song.duration);
    }
});

// 🔄 Load the first song when page loads
loadSong(currentSongIndex);
