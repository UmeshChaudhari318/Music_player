const prevButton =document.getElementById("prev");
const nextButton = document.getElementById("next");
const repeatButton= document.getElementById("repeat");
const shuffleButton = document.getElementById("shuffle");
const audio = document.getElementById("audio");
const songName =document.getElementById("song-name");
const songImage=document.getElementById("song-image");
const songArtist = document.getElementById("song-artist");
const pauseButton=document.getElementById("pause");
const playButton= document.getElementById("play");
const playlistButton=document.getElementById("playlist");
const maxDuration = document.getElementById("max-duration");
const currentTimeRef = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const playlistContainer = document.getElementById("playlist-container");
const closeButton = document.getElementById("close-button");
const playlistSongs = document.getElementById("playlist-songs");
const currentProgress = document.getElementById("current-progress");


//index for songs

let index;

//initially loop true
let loop = true;

const songsList=[{
    name: "Make me move",
    link: "songs/song1.mp3",
    artist: "culture code",
    image:"images/img-1.jpg",
},

{
    name: "where we started",
    link: "songs/sample1.mp3",
    artist: "Lost Sky",
    image: "images/img-2.jpg",
},
{
    name: "On and on",
    link: "songs/sample2.mp3",
    artist: "Rival",
    image: "images/img-3.jpg",
},
];

//events object

let events= {
    mouse: {
        click: "click",
    },
    touch:{
        click: "touchstart",
    },
};

let deviceType= "";

//Detect touch device

const isTouchdevice = () => {
    try{
        // we try to create touch event

        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true;
    }

    catch(e){
        deviceType ="mouse";
        return false;
    }
};



//format time convert ms to second

const timeFormatter = (timeInput) => {
    let minute= Math.floor(timeInput /60);
    minute = minute < 10 ? "0" + minute : minute;
    let second = Math.floor(timeInput % 60);
    second = second < 10 ? "0" + second : second;
    return `${minute}:${second}`;
};



// //set song

const setSong = (arrayIndex) => {
    let {name, link, artist,image} = songsList[arrayIndex];
    audio.src= link;
    songName.innerHTML = name;
    songArtist.innerHTML= artist;
    songImage.src= image;

    //display duration

    audio.onloadedmetadata = () => {
        maxDuration.innerHTML = timeFormatter(audio.duration);
    };

};


//play song

const playAudio = () =>{
    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
};


 //repeat button

repeatButton.addEventListener("click", () => {
    if(repeatButton.classList.contains("active")){
        repeatButton.classList.remove("active");
        audio.loop=false;
        console.log("repeat off");
    }

    else{
        repeatButton.classList.add("active");
        audio.loop=true;
        console.log("repeat on");
    }
});


// //nect song

const nextSong =() => {
    if(loop){
        if(index == songsList.length-1){
            index=0;
        }
        else{
            index +=1;
        }

        setSong(index);
        playAudio();
    }

    else{
        let randIndex =Math.floor(Math.random() * songsList.length);
        console.log.randIndex;
        setSong(randIndex);
        playAudio();
    }
};


//pause song

const pauseAudio = () =>{
    audio.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");


};


//previous song

const previousSong = () => {
    if(index > 0){
        pauseAudio();
        index -=1;
    }

    else{
        index =songsList.length -1 ;
    }

    setSong(index);
    playAudio();
};

//next song when current song ends

audio.onended = () =>{
    nextSong();
};

//shuffle song

shuffleButton.addEventListener("click", () => {
    if(shuffleButton.classList.contains("active")){
        shuffleButton.classList.remove("active");
        loop=true;
        console.log("shuffle off");
    }
    else{
        shuffleButton.classList.add("active");
        loop= false;
        console.log("shuffle on");
    }
})

// //play button

playButton.addEventListener("click", playAudio);

//pause button

pauseButton.addEventListener("click", pauseAudio);

//prev button

prevButton.addEventListener("click", previousSong);

// // next Button

nextButton.addEventListener("click", nextSong);

//if user clicks on progress bar

isTouchdevice();
progressBar.addEventListener(events[deviceType].click,(event) => {

    let coordStart = progressBar.getBoundingClientRect().left;

    let coordEnd = !isTouchdevice() ? event.clientX : event.touches[0].clientX;

    let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

    currentProgress.style.width = progress * 100 + "%";

    audio.currentTime = progress * audio.duration;

    audio.play();
    pauseButton.classList.remove("hide");
    playButton.classList.add("hide");
});

setInterval(() => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
    currentProgress.style.width = (audio.currentTime / audio.duration.toFixed(3)) * 100 +"%";
});

//update time

audio.addEventListener("timeupdate", () => {
    currentTimeRef.innerHTML = timeFormatter(audio.currentTime);
});



//create playlist
const initializePlaylist = () =>{
    for(let i in songsList){
        playlistSongs.innerHTML += `<li Class='playlistSong' onclick='setSong(${i})'>
        <div class="playboy">
        
            <img src = "${songsList[i].image}" />
        </div>
        <div class="playlist-song-details">

            <span id="playlist-song-name">
            ${songsList[i].name}
            </span>

            <span id="playlist-song-artist-album">
            ${songsList[i].artist}
            </span>
        </div>
        
        </li>`;

    
    }
};

//display playlist

playlistButton.addEventListener("click", () =>{
    playlistContainer.classList.remove("hide");
});

//hide playlist

closeButton.addEventListener("click", () =>{
    playlistContainer.classList.add("hide");
});

window.onload = () => {
    index = 0;
    setSong(index);

    //create playlist

    initializePlaylist();
};