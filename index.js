// Q-1
const object = {
  message: "Hello, World!",
  //change on the next line
  getMessage: () => {
    return this.message;
  },
};




// ----------------------------------
// Q-2

function Pet(name) {
  this.name = name;
}

Pet.prototype.getName = function () {
  return this.name;
};

const cat = new Pet("Fluffy");


const { getName } = cat;

// change on the next line
const petResult = getName();



// ------------------------------------------------------
// Q-3

const object2 = {
  message: "Hello, World!",
};

function logMessage() {
  return this.message;
}

// change on the next line
const object2Result = logMessage;


// -----------------------------------
// Q-4
class Rectangle{
    constructor(width, height){
        this.width = width;
        this.height = height;
    }

    // change on the next line
    getArea(){
        return this.width * this.height;
    }
}

const reactangle = new Rectangle(10,20);

// or this next line
const areaFunc = reactangle.getArea;


module.exports = {
    object,
    petResult,
    object2Result,
    areaFunc,
}