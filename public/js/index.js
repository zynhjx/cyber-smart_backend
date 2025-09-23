
const video = document.querySelector("video#bg-video")
const preloader = document.querySelector(".preloader")

const btn = document.querySelector(".btn button")
const container = document.querySelector(".container")

video.addEventListener("canplaythrough", function() {
    preloader.style.display = "none"; 
});




