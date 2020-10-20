let canvas;
let ctx;
let width = 500;
let height = 500;

let audioSource;

window.onload = init;

function init(){

    canvas = document.querySelector('canvas');
    canvas.height = width;
    canvas.width = height;

    ctx = canvas.getContext("2D");

    audioSource = document.querySelector("#myAudio"); 

    let playButton = document.querySelector("#playButton");
    let fsButton = document.querySelector("#fsButton");

    fsButton.onclick = e => {
        console.log("init called");
        goFullscreen(canvas);
      };

    playButton.addEventListener("click",function(){
    
        if(playButton.dataset.play == "no"){
            audioSource.play();
            playButton.dataset.play = "yes";

        }else{
            audioSource.pause();
            playButton.dataset.play = "no";
        }
        
    });

}

function loop(){

}


const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};