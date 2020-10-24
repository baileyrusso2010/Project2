/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

let arr =[];



class LinkedList{
    constructor(head=null){
        this.head = head;
        this.next = null;
        this.size = 0;
    }

    add(element){

        let node = new Cell(element.x, element.y, element.width, element.height);

        let current;

        if(this.head == null){this.head = node;}else{

            current = this.head;

            while(current.next){

                current = current.next;
            }//end of while

            current.next = node;

        }
        this.size++;

    }//end of add

    getIndex(index){
        
        let current = this.head;

        let count = 0;

        while(current != null){
            if(count == index){
                return(current);
            }
            count++;
            current = current.next;
        }

        return -1;
    }//end of get index


    getSize(){
        return this.size;
    }

}//end of linked list

class Cell{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "grey";
    }

    draw(color){


        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 50;


        if(color == true){
            ctx.fillStyle = this.color;
        
        }else{
            ctx.fillStyle = "black";
        }
        ctx.lineWidth = 40;

        ctx.strokeStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      //  ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.stroke();

        ctx.fill();


    }

    setColor(color){
        this.color = color;
    }

}

function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;
	// create a gradient that runs top to bottom
	gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:"magenta"},{percent:.25,color:"magenta"},{percent:.5,color:"magenta"},{percent:.75,color:"magenta"},{percent:1,color:"magenta"}]);
	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
    
    
    for(let j = 0; j < 24; j++){
      
        let linked = new LinkedList();
        for(let i =0; i < 20; i++){
            
            let cell = new Cell(j*32+5, i * 18+ 30, 30, 15);
            
            linked.add(cell);
        }
        utils.setRowColor(linked, utils.getRandomColor());
        arr.push(linked);
    }


}//end of setUpCanvas

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    ctx.restore();
		
	// 4 - draw bars
    
    if(params.showBars){

        let barSpacing = 15;
        let margin = 20;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) -margin *2;
        let barWidth =  30;
        let barHeight = 15;
        let topSpacing = 120;

        ctx.save();
        ctx.fillStyle = `rgba{255,255,255,0,50}`;
        ctx.strokeStyle = `rgba{0,0,0,0,50}`;

        //instead
        let numCols = 5;

        //console.log(utils.normalizeNumber(256, audioData[0], 12));

        console.log(audioData.length);

        for(let i =0; i < arr.length; i++){
            
            let holder = arr[i];
            
            let hold = utils.getAverage(audioData, 24);

            //put before this getAverage
            let randNum = utils.normalizeNumber(256, audioData[i], 24);

            for(let j =0; j < holder.size; j++){//linked list size

                let h = j >= randNum;

                arr[i].getIndex(j).draw(h);

            }//end of inner for

        }//end of outer for
        
        ctx.restore();
    }
	
    

// 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array 
    // let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    // let data = imageData.data;
    // let length = data.length;
    // let width = data.width;
	// // B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    // for(let i = 0; i < length; i++){
	// 	// C) randomly change every 20th pixel to red
    //     if(params.showNoise && Math.random() < .05){

    //         data[i] = data[i+1] = data[i+2] = 0;
    //          data[i] = 255;
    //     }

    //     let red = data[i], green = data[i+1], blue = data[i+2];
    //     data[i] = 255-red;
    //     data[i+1] = 255-green;
    //     data[i+2] = 255-blue;
        
    // }

//     if(params.showEmboss)
//     for(let i = 0; i < length; i++){
//         if(i%4 == 3)continue;
//         data[i] = 127+2*data[i] - data[i+4] - data[i+width*4];
//     }
	
// 	// D) copy image data back to canvas
// ctx.putImageData(imageData,0,0);

}
export {setupCanvas,draw};