  /*
    main.js is primarily responsible for hooking up the UI to the rest of the application 
    and setting up the main event loop
  */

  // We will write the functions in this file in the traditional ES5 way
  // In this instance, we feel the code is more readable if written this way
  // If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!
  import * as canvas from './visualizer.js';
  import * as utils from './utils.js';
  import * as audio from './audio.js';

  const drawParams = {
    showGradient  : true,
    showBars      : true,
    showCircles   : true,
    showNoise     : true,
    showEmboss    : true
  };

  // 1 - here we are faking an enumeration
  const DEFAULTS = Object.freeze({
    sound1 : "../media/New Adventure Theme.mp3",
    sound2 : "../media/Peanuts Theme.mp3",
    sound3 : "../media/The Picard Song.mp3"

  });

  function init(){
    console.log("init called");
    console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);
    loop();
  }

  function loop(){
    /* NOTE: This is temporary testing code that we will delete in Part II */
      requestAnimationFrame(loop);

      canvas.draw(drawParams);

    }
    

  function setupUI(canvasElement){
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");
    const playButton = document.querySelector("#playButton");
    
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    let showBars = document.querySelector("#barsCB");
    let showCircle = document.querySelector("#circlesCB");
    let showGradient = document.querySelector("#gradientCB");
    let showNoise = document.querySelector("#noiseCB");embossCB
    let showEmboss = document.querySelector("#embossCB");
      
    showBars.checked = showCircle.checked = showGradient.checked = showNoise.checked = true;
    showEmboss.checked = true;

    showEmboss.onchange = e => {
      drawParams.showEmboss = e.target.checked;
    };

    showNoise.onchange = e => {

      drawParams.showNoise = e.target.checked;
    };

    showGradient.onchange = e => {

      drawParams.showGradient = e.target.checked;
    };

    showCircle.onchange = e => {

      drawParams.showCircles = e.target.checked;
    };

    showBars.onchange = e => {

      drawParams.showBars = e.target.checked;
    };


    volumeSlider.oninput = e => {
      audio.setVolume(e.target.value);
      volumeLabel.innerText = Math.round((e.target.value/2 * 100));
    };

    volumeSlider.dispatchEvent(new Event("input"));


    // add .onclick event to button
    fsButton.onclick = e => {
      console.log("init called");
      utils.goFullscreen(canvasElement);
    };

    playButton.onclick = e => {
      if(audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
      }

      if(e.target.dataset.play == "no"){
        audio.playCurrentSound();
        e.target.dataset.play = "yes";
      }else{
        audio.pauseCurrentSound();
        e.target.dataset.play = "no";
      }

    };

    // D - Hookup track <select>
    let trackSelect = document.querySelector("#trackSelect");
    //add .onchange event
    trackSelect.onchange = e => {
      audio.loadSoundFile(e.target.value);

      if(playButton.dataset.play = "yes"){
        playButton.dispatchEvent(new MouseEvent("click"));
      }
    };

    
  } // end setupUI

  export {init};