//Create variables here
var dogImg
var dog
var happyDog
var database
var foodS
var foodStock
var feed, addfood;
var fedTime, lastFed;
var foodObj;
var gameState="hungry";
var bedroomImg,gardenImg,washroomImg;
var currentTime

function preload()
{
	//load images here
  dogImg=loadImage("images/dogImg.png")
  happyDog=loadImage("images/dogImg1.png")
  bedroomImg=loadImage("images/Bed Room.png")
  gardenImg=loadImage("images/Garden.png")
  washroomImg=loadImage("images/Wash Room.png")
}


function setup() {
	createCanvas(1000, 500);
  
  database=firebase.database();

  var readState=database.ref("gameState")
  readState.on("value",(data)=>{gameState=data.val()})

  foodStock=database.ref("Food")
  foodStock.on("value",readStock)
   

  foodObj=new Food();

  dog=createSprite(870,250,10,10)
  dog.addImage(dogImg);
  dog.scale=0.3;

  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog)

  addFood=createButton("Add Food")
  addFood.position(800,95);
  addFood.mousePressed(addFoodS)

  /*foodStock=database.ref("Food")
    foodStock.on("value",readStock)
    foodStock.set(20);*/

}


function draw() {  

  background(46,139,87)

fedTime=database.ref('FeedTime')
fedTime.on("value",function(data){
  lastFed=data.val();
})


   textSize(20)
    fill (255)
    if(lastFed>=12){
      text("Last Feed : "+lastFed%12+"PM",350,30);
    }else if(lastFed==0){
      text ("Last Feed : 12 AM",350,30)
    }else{
      text("Last Feed : "+ lastFed+ "AM",350,30);
    }


    if(gameState!= "hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(dogImg);
    }

    currentTime=hour();
    if(currentTime==(lastFed+1)){
        update("Playing");
        foodObj.garden();
    }else if(currentTime==(lastFed+2)){
      update("sleeping");
      foodObj.bedroom();
    }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
    }else{
      update("hungry")
      foodObj.display();
    }
    
    foodObj.display();
    drawSprites();

  }


function readStock(data){
 foodS=data.val();
 foodObj.updateFoodStock(foodS)
}



function feedDog(){
  dog.addImage(happyDog);

     var food_stock_val=foodObj.getFoodStock();
            if(food_stock_val<=0){
               foodObj.updateFoodStock(food_stock_val*0);
            }else{
     foodObj.updateFoodStock(food_stock_val -1);
}

  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    feedTime:hour ()
  })
}



function addFoodS(){
foodS ++;
database.ref("/").update({
  Food:foodS
})
}

function update(state){
  database.ref("/").update({
    gameState:state
  });
}


/*function writeStock(x){

  if(x<=0){
    x=0;
  }
  else{
    x=x-1;
  }

  database.ref("/").update({
    Food:x
  })
}*/
