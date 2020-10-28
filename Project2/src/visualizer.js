import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;

let arr =[];
let numRows = 25;
let cellValueHeight = 20;
let isCells = true;
let changingColors = false;

let xPos = 32, yPos= 18;
let xPadding = 4, yPadding = 30;
let width = 30, height = 15;
let radius = 8;
let progressBar;
let colorTimeout = 500;
let timeout = [];

//https://www.freecodecamp.org/news/implementing-a-linked-list-in-javascript/

class LinkedList{
    constructor(head=null){
        this.head = head;
        this.next = null;
        this.size = 0;
    }

    add(element, isCell){
        let node 
        if(isCell == true){
            node = new Cell(element.x, element.y, element.width, element.height);
        }else{
            node = new Circle(element.x, element.y, element.radius);
        }
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
    }//end of getSize

}//end of linked list

class Cell{
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = "black";
    }

    draw(color){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 50;

        if(color == true){
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 1.0;
        
        }else{
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.0;

        }
        ctx.lineWidth = 40;

        ctx.strokeStyle = "black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
      //  ctx.strokeRect(this.x, this.y, this.width, this.height)
        ctx.stroke();

        ctx.fill();
    }//end of draw

    setColor(color){
        this.color = color;

    }//end of setColor

}//end of cell class

class Circle{
    constructor(x,y,radius){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "black";
    }
    
    draw(color){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.lineWidth = 50;

        if(color == true){
            ctx.fillStyle = this.color;
            ctx.globalAlpha = 1.0;
        
        }else{
            ctx.fillStyle = "black";
            ctx.globalAlpha = 0.0;

        }
        ctx.lineWidth = 2;

      //  ctx.strokeStyle = "black";
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();

        ctx.fill();
        ctx.restore();

    }//end of draw

    setColor(color){
        this.color = color;

    }//end of setColor

}//end of cell class

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

    let switchColor = document.querySelector("#randomColor");
    let circlesCells = document.querySelector("#switch");
    let autoChange = document.querySelector("#autoChange");
    let numberSlider = document.querySelector("#numberRows");
    progressBar = document.querySelector("#myBar");
    
    numberSlider.onchange = e => {

        numRows = e.target.value;
        arr = [];
            for(let j = 0; j < numRows; j++){
            
                let linked = new LinkedList();
                for(let i =0; i < cellValueHeight; i++){
                let cell;
                    if(isCells){
                        cell = new Cell(j*xPos+xPadding, i * yPos+ yPadding, width, height);
                    }else{
                        cell = new Circle(j*xPos+xPadding, i * yPos+ yPadding, radius); 
                    }
                    linked.add(cell, isCells);
                }
                utils.setRowColor(linked, utils.getRandomColor());
                arr.push(linked);

            }//end of for
    };

    autoChange.onchange = e => {
        if(e.target.checked){
            changingColors = true;
        }else{
            changingColors = false;
        }
    };

    circlesCells.onchange = e => {
        isCells = !isCells;
        changeColors(isCells);
      };

    switchColor.onclick = e => {
  
        changeColors(true);
    };
    
    changeColors(true);


}//end of setUpCanvas


function changeColors(isCells){
    arr = [];
    for(let j = 0; j < numRows; j++){
      
        let linked = new LinkedList();
        for(let i =0; i < cellValueHeight; i++){
           let cell;
            if(isCells){
                cell = new Cell(j*xPos+xPadding, i * yPos+ yPadding, width, height);
            }else{
                cell = new Circle(j*xPos+xPadding, i * yPos+ yPadding, radius); 
            }
            linked.add(cell, isCells);
        }
        utils.setRowColor(linked, utils.getRandomColor());
        arr.push(linked);

    }//end of for

}//end of change Colors


function draw(params={}){

	analyserNode.getByteFrequencyData(audioData);

	// 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    //ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth, canvasHeight);
    ctx.restore();



    if(changingColors){
        timeout.push(setTimeout(function(){changeColors(isCells)},colorTimeout));
        colorTimeout += 1000;
    }else{

        for (let i=0; i<timeout.length; i++) {
            clearTimeout(timeout[i]);
        }
        colorTimeout = 0;
    }

        ctx.save();
        ctx.fillStyle = `rgba{255,255,255,0,50}`;
        ctx.strokeStyle = `rgba{0,0,0,0,50}`;

        for(let i =0; i < arr.length; i++){
            
            let holder = arr[i];//gets column
            
            let average = utils.getAverage(audioData, numRows);
            let randNum = utils.normalizeNumber(256, average[i], cellValueHeight);

            for(let j =0; j < holder.size; j++){

                //draws reverse
                let inverse = j >= randNum;
               
                arr[i].getIndex(j).draw(inverse);

            }//end of inner for

        }//end of outer for
        
        ctx.restore();
 

  //  ctx.clearRect(0,0,canvasWidth,canvasHeight);

}//end of draw

export {setupCanvas,draw};