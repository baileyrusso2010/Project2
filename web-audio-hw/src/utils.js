// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
  };
  
  const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
  };
  
  const getRandomColor = () => {
      const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor,255-floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
  };
  
  const getLinearGradient = (ctx,startX,startY,endX,endY,colorStops) => {
    let lg = ctx.createLinearGradient(startX,startY,endX,endY);
    for(let stop of colorStops){
      lg.addColorStop(stop.percent,stop.color);
    }
    return lg;
  };

  function colorInterpolation(color1, color2, percentage){

    let diffRed = color2.r - color1.r;
    let diffBlue = color2.g - color1.g;
    let diffGreen = color2.b - color1.b;


    let r = (color2.r - color1.r) * percentage + color1.r;
    let g = (color2.g - color1.g) * percentage + color1.g;
    let b = (color2.b - color1.b) * percentage + color1.b;

    return "rgb("+r+","+g+","+b+")";

  }//end of colorInterpolation

  function setRowColor(arr, color){

    for(let i =0; i < arr.size; i++){
      arr.getIndex(i).setColor(color);
    }

  }//end of setRowColor

  function normalizeNumber(highestNum, currentNumber, numBlocks){

    let current = highestNum-currentNumber;

    let div = current/highestNum;

    let blockNumber = numBlocks * div;

    blockNumber = Math.round(blockNumber);

    return blockNumber;

  }//end of normalizeNumber
  
  function getAverage(arr, numCols){//height of blocks

    let num = Math.floor(arr.length / numCols);
    //5
    let newArray = [];

    console.log(num);
    let counter = 0;
    for(let i =0; i < arr.length; i++){

      if(newArray.length >24)
        break;

      counter += arr[i]

      if(i % num == 0){

        counter /= num;
        counter = Math.floor(counter);

        newArray.push(counter);

        counter = 0;

      }

    }//end of for

    return newArray;

  }//end of getAverage
  
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
  
  export {makeColor, getRandomColor, getLinearGradient, goFullscreen, colorInterpolation, normalizeNumber,setRowColor, getAverage};