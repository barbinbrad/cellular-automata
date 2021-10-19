// Full-page celluar automata
// TODO: support resize
// TODO: support image uploader

const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;

let visibleCanvas, hiddenCanvas;
let visibleCanvasContext, hiddenCanvasContext;
let canvasCurrent, canvasHistorical;

const LANDSCAPE_SETTINGS = {
  // 23-3: Classic Life
  Birth: [0,1,1,0,0,0,0,0], // Only 0's and 1's are valid 
  Death: [0,0,1,0,0,0,0,0], // Only 0's and 1's are valid 
  ImageWidth: 1280,
  ImageHeight: 430, 
  ImagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Courage_The_Cowardly_Dog_logo.png/1280px-Courage_The_Cowardly_Dog_logo.png',  
  DarkImage: true,
  GrayScale: false,
};

const PORTRAIT_SETTINGS = {
  // 234-3: Livelier Life
  Birth: [0,1,1,1,0,0,0,0], // Only 0's and 1's are valid 
  Death: [0,0,1,0,0,0,0,0], // Only 0's and 1's are valid 
  ImageWidth: 1024,
  ImageHeight: 1024, 
  ImagePath: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Westinghouse_Logo.svg/1024px-Westinghouse_Logo.svg.png',  
  DarkImage: true,
  GrayScale: false,
};

//const settings = ( WIDTH > 1.3*HEIGHT ) ? LANDSCAPE_SETTINGS : PORTRAIT_SETTINGS;
const settings = PORTRAIT_SETTINGS; // always use Westinghouse logo

var image = new Image();
image.src = settings.ImagePath;
image.crossOrigin = 'anonymous';
image.onload = start;

const wolfram2d = (inputs, colorOffset) => {
  // determine which of our neighbors are alive
  let outputs = [];
  
  for(let i=0; i<inputs.length; i++){
    outputs[i] = (canvasHistorical.data[inputs[i] + colorOffset] < 128) ? +!settings.DarkImage : +settings.DarkImage; 
  }
  
  // assume we die
  let output = (settings.DarkImage) ? 0 : 255; 
  // count the amount of alive neighbors we have
  let evaluation = outputs.reduce((a, b) => a + b, 0); 
  
  if(inputs[0]){
    // if we are living...
    for(let i=0; i<settings.Birth.length; i++){
      // do we have the right amount of neighbors?
      if(evaluation == (i + 1) && !!settings.Birth[i]){ 
        // keep on living       
        output = (settings.DarkImage) ? 255 : 0;
        break;
      }
    }
  }
  else{
    // if we are dead...
    for(let i=0; i<settings.Death.length; i++){
      // do we have the right amount of neighbors?
      if(evaluation == (i + 1) && !!settings.Death[i]){
        // resurrect!
        output = (settings.DarkImage) ? 255 : 0;
        break;
      }
    }
  } 
  return output;
}


function run() {
  let X, Y, X1, X2, Y1, Y2;
  let grayValue;
    
  // iterate through all points
  for (X=0; X<WIDTH; X++) { 
    for (Y=0; Y<HEIGHT; Y++) {
      // for each point:
      // find the neighboring points
      X1 = ( X-1 < 0 ) ?  WIDTH-1   : X-1;
      Y1 = ( Y-1 < 0 ) ?  HEIGHT-1  : Y-1;  
      X2 = ( X+1 > WIDTH-1 ) ? 0    : X+1;
      Y2 = ( Y+1 > HEIGHT-1 ) ? 0   : Y+1;

      // the canvas is an array of length 4*WIDTH*HEIGHT
      // because there are 4 values for each point:
      // r, g, b, a
      //
      // the following gives us the positions 
      // of this point input[0] and the 8 neighboring 
      // points in the canvas array

      let inputs = [];

      inputs[0] = 4*(X  + Y  * WIDTH); // the current point
      inputs[1] = 4*(X  + Y1 * WIDTH); // top neighbor
      inputs[2] = 4*(X  + Y2 * WIDTH); // bottom neighbor
      inputs[3] = 4*(X1 + Y  * WIDTH); // left neighbor
      inputs[4] = 4*(X1 + Y1 * WIDTH); // left top neighbor
      inputs[5] = 4*(X1 + Y2 * WIDTH); // left bottom neighbor
      inputs[6] = 4*(X2 + Y  * WIDTH); // right neighbor
      inputs[7] = 4*(X2 + Y1 * WIDTH); // right top neighbor
      inputs[8] = 4*(X2 + Y2 * WIDTH); // right bottom neighbor

      canvasCurrent.data[inputs[0]+0] = wolfram2d(inputs, 0);
      canvasCurrent.data[inputs[0]+1] = wolfram2d(inputs, 1);
      canvasCurrent.data[inputs[0]+2] = wolfram2d(inputs, 2);
      canvasCurrent.data[inputs[0]+3] = 255;
      
      if(settings.GrayScale){
        grayValue = (canvasCurrent.data[inputs[0]] + 
                         canvasCurrent.data[inputs[0]+1] + 
                         canvasCurrent.data[inputs[0]+2]) / 3;
        canvasCurrent.data[inputs[0]] = grayValue;
        canvasCurrent.data[inputs[0]+1] = grayValue;
        canvasCurrent.data[inputs[0]+2] = grayValue;
      }

    }}

    
  for (X=0; X<WIDTH; X++) { 
      for (Y=0; Y<HEIGHT; Y++) { 
        // Copy the new canvas to the old canvas
        canvasHistorical.data[4*(X+Y*WIDTH)  ] = canvasCurrent.data[4*(X+Y*WIDTH)  ];  
        canvasHistorical.data[4*(X+Y*WIDTH)+1] = canvasCurrent.data[4*(X+Y*WIDTH)+1]; 
        canvasHistorical.data[4*(X+Y*WIDTH)+2] = canvasCurrent.data[4*(X+Y*WIDTH)+2]; 
        canvasHistorical.data[4*(X+Y*WIDTH)+3] = canvasCurrent.data[4*(X+Y*WIDTH)+3]; 
      }
  }

  visibleCanvasContext.putImageData(canvasHistorical,0,0);  
  setTimeout(run,1);    
}


function start(){
  if(!settings.DarkImage) document.body.style.backgroundColor = "#ffffff";
 
  let scale = Math.min( WIDTH / settings.ImageWidth, HEIGHT / settings.ImageHeight);  
  
  visibleCanvas = document.getElementById('canvas-current');
    visibleCanvasContext = visibleCanvas.getContext('2d'); 
      visibleCanvasContext.canvas.width = WIDTH;
      visibleCanvasContext.canvas.height = HEIGHT;
      visibleCanvasContext.setTransform(scale, 0, 0, scale, WIDTH / 2, HEIGHT / 2);
      visibleCanvasContext.drawImage(image, -settings.ImageWidth / 2, -settings.ImageHeight / 2, settings.ImageWidth, settings.ImageHeight); 
  
  hiddenCanvas = document.getElementById('canvas-memory'); 
    hiddenCanvasContext = hiddenCanvas.getContext('2d');
      hiddenCanvasContext.canvas.width = WIDTH;
      hiddenCanvasContext.canvas.height = HEIGHT;
      hiddenCanvasContext.setTransform(scale, 0, 0, scale, WIDTH / 2, HEIGHT / 2);
  
  canvasCurrent = hiddenCanvasContext.getImageData(0,0,WIDTH,HEIGHT); 
  canvasHistorical = visibleCanvasContext.getImageData(0,0,WIDTH,HEIGHT);    // need to allocate separate memory!
  
  setTimeout(run,200); 
}
