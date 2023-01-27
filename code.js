const canvas = document.getElementById('canvas') 
var ctx = canvas.getContext('2d')
canvas.width  = screen.width
canvas.height = screen.height
const keys = {up:{pressed:false},down:{pressed:false},left:{pressed:false},right:{pressed:false},shift:{pressed:false},mouse1:{pressed:false}}
const players = []
const obstacles = []

const camera = {
  x:0,
  y:0,
  mousex:0,
  mousey:0,
  mousemulti : 1
}
const worldBorder = {
  maxX:2000,
  maxY:2000,
}
var img = new Image()
var fps = 60
var frameCount = 0
var startTime = performance.now()

img.src = 'sMap.jpg'
class Player {
    constructor(event,position){
       this.ctx = ctx
       this.position = position
       this.velocity = {
        x:0,
        y:0
       }
       this.size = 20
       this.speed = Math.round(280*(1/fps))
       this.angle = 0
       this.event = {x:0,y:0}
       this.rect = canvas.getBoundingClientRect()
       this.uA;
    }
    init(){
        this.draw()
        this.update()
    }
    draw(){
      this.ctx.save()
      this.ctx.fillStyle = '#B9A521'
      this.ctx.strokeStyle = '#80700B'
      this.ctx.translate(this.position.x+(this.size/2),this.position.y+(this.size/2))
      this.ctx.rotate(this.angle)
      this.ctx.translate(-(this.position.x+(this.size/2)),-(this.position.y+(this.size/2)))
      this.ctx.fillRect(this.position.x,this.position.y,this.size,this.size)
      this.ctx.strokeRect(this.position.x,this.position.y,this.size,this.size)
      this.ctx.beginPath()
      this.ctx.moveTo(this.position.x+this.size/2,this.position.y+this.size/2);
      this.ctx.lineTo(this.position.x+this.size,this.position.y+this.size/2);
      this.ctx.stroke()
      this.ctx.restore()

    }
    update(){
      // necessary logic (dont touch pls)
        if (keys.up.pressed){
            this.velocity.y = -this.speed
            if (camera.y > 0 && this.position.y-this.size/2<=camera.y+canvas.height/2) {
            camera.y -= this.speed}
          }
          else if (keys.down.pressed){
            this.velocity.y = this.speed
            if (camera.y < worldBorder.maxY && this.position.y-this.size/2>=camera.y+canvas.height/2){
            camera.y += this.speed}}
          else {this.velocity.y *= 0.70}
          if (keys.left.pressed) {
            this.velocity.x = -this.speed
            if (camera.x > 0 && this.position.x-this.size/2<=camera.x+canvas.width/2){
            camera.x -= this.speed}

          } 
          else if (keys.right.pressed){
            this.velocity.x = this.speed
            if (camera.x < worldBorder.maxX && this.position.x-this.size/2>=camera.x+canvas.width/2){
            camera.x += this.speed}
          }
          else{this.velocity.x *= 0.70}
      // necessary logic (dont touch pls)
          this.position.x += this.velocity.x
          this.position.y += this.velocity.y
          // outer border collision detection 
          if(this.position.x<0){
            this.position.x = 0
          }
          if(this.position.x>(canvas.width)+ worldBorder.maxX-this.size){
            this.position.x = (canvas.width)+ worldBorder.maxX-this.size
          }
          if(this.position.y<0){
            this.position.y = 0
          }
          if(this.position.y>(canvas.height)+ worldBorder.maxY-this.size){
            this.position.y = (canvas.height) + worldBorder.maxY-this.size
          }
          rotatePlayer(this.event,this,this.rect)
          mouseCamera(this.event,4,this.rect)
          this.rect = canvas.getBoundingClientRect()

          
          
    }
    
}
class Obstacle {
  constructor(ctx,position,size){
    this.ctx = ctx
    this.position = position
    this.size = size
  }
  init(){
    this.draw()
    this.update()
}
  draw(){
    this.ctx.save()
    this.ctx.fillStyle ='#a76f08'
    this.ctx.strokeStyle = '#503d01'
    this.ctx.lineWidth = 2
    this.ctx.fillRect(this.position.x,this.position.y,this.size.x,this.size.y)
    //this.ctx.strokeRect(this.position.x,this.position.y,this.size.x,this.size.y)
    
    this.ctx.restore()
  }
  update(){
    this.draw()
  }
}
// spawing things (player.s?/obstacles....etc)
players.push(new Player(ctx,{x:canvas.width/2,y:canvas.height/2}))
obstacles.push(new Obstacle(ctx,{x:700,y:500},{x:10,y:100}))
obstacles.push(new Obstacle(ctx,{x:700,y:500},{x:100,y:10}))
obstacles.push(new Obstacle(ctx,{x:8,y:500},{x:100,y:10}))


// spawing things (player.s?/obstacles....etc)
function resizeCanvas(){
   canvas.width  = Math.round(screen.width);
   canvas.height = Math.round(screen.height);
}
function rotatePlayer(event,player,rect){  
  
  const angle = Math.atan2(event.y*canvas.height/rect.bottom-player.position.y+camera.y+camera.mousey,event.x*canvas.width/rect.right-player.position.x+camera.x+camera.mousex)
  player.angle = angle
}
function mouseCamera(event,multimax,rect){  
  var rect = canvas.getBoundingClientRect()
  var cameraMultix = (event.x*(canvas.width)/rect.right)/canvas.width-1/2
  var cameraMultiy = (event.y*(canvas.height)/rect.bottom)/canvas.height-1/2
  if (keys.shift.pressed && camera.mousemulti <= multimax) {
     camera.mousemulti *= 1.25
  }
  else if (!keys.shift.pressed && camera.mousemulti >= 1){
    camera.mousemulti *= 0.75
  }
  camera.mousex = cameraMultix*50*camera.mousemulti 
  camera.mousey = cameraMultiy*50*camera.mousemulti 

  if (camera.x+camera.mousex < 0)
    {camera.x = -camera.mousex}
  if (camera.y+camera.mousey < 0)
  {camera.y = -camera.mousey}
  
  
  
}
function RectCollision(player,obstacle){
    if(
    player.position.x+player.size > obstacle.position.x &&(obstacle.position.x+obstacle.size.x) > player.position.x&&player.position.y+player.size > obstacle.position.y&&obstacle.position.y+obstacle.size.y > player.position.y){
    if (Math.min(Math.abs(player.position.x+player.size-obstacle.position.x),Math.abs(player.position.x-obstacle.position.x-obstacle.size.x))
      <Math.min(Math.abs(player.position.y+player.size-obstacle.position.y),Math.abs(player.position.y-obstacle.position.y-obstacle.size.y) 
    )){
      if (Math.abs(player.position.x + player.size - obstacle.position.x)>Math.abs(player.position.x - obstacle.position.x - obstacle.size.x)){
      player.position.x = obstacle.position.x + obstacle.size.x
     }
     else {player.position.x = obstacle.position.x - player.size}
    }
    else {
      if (Math.abs(player.position.y + player.size - obstacle.position.y)>Math.abs(player.position.y - obstacle.position.y - obstacle.size.y)){
        player.position.y = obstacle.position.y + obstacle.size.y
       }
       else {player.position.y = obstacle.position.y - player.size}
    }}
}
function LineCollision(x1,y1,x2,y2,x3,y3,x4,y4,player){
  uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1)); 
  uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1 && keys.mouse1.pressed){
    var intersectionX = x1 +(uA*(x2-x1))
    var intersectionY = y1 +(uA*(y2-y1))      
    return {x:intersectionX,y:intersectionY,distance:Math.sqrt(((intersectionX-player.position.x-player.size/2)**2)+((intersectionY-player.position.y-player.size/2)**2))}
  }
  
  else return 0;}
function toBorder(player){
  var dx, dy, py, vx, vy;
  vx = player.event.x*(canvas.width/player.rect.right)+camera.x+camera.mousex - player.position.x-player.size/2;
  vy = player.event.y*(canvas.height/player.rect.bottom)+camera.y+camera.mousey - player.position.y-player.size/2;
  dx = vx < 0 ? 0 : canvas.width+camera.x+camera.mousex;
  dy = py = vy < 0 ? 0 : canvas.height+camera.y+camera.mousey;
  if (vx === 0) {
    dx = player.position.x+player.size/2;
  } else if (vy === 0) {
    dy = player.position.y+player.size/2;
  } else {
    var dy = player.position.y+player.size/2 + (vy / vx) * (dx - player.position.x-player.size/2);
    if (dy < 0 || dy > canvas.height) {
      dx = player.position.x+player.size/2 + (vx / vy) * (py - player.position.y-player.size/2);
      dy = py;
    }
  }
  return {x:dx,y:dy}
}
function NearestPoint(player,obstacle){
  var x1 = toBorder(player).x
  var y1 = toBorder(player).y
  var x2 = player.position.x+player.size/2
  var y2 = player.position.y+player.size/2
  var x3 = obstacle.position.x
  var y3 = obstacle.position.y
  var intersections = {left:{},right:{},top:{},bottom:{}}
  var calc = []
  intersections.left = LineCollision(x1,y1,x2,y2,x3,y3,x3,y3+obstacle.size.y,player);
  intersections.right = LineCollision(x1,y1,x2,y2,x3+obstacle.size.x,y3,x3+obstacle.size.x,y3+obstacle.size.y,player)
  intersections.bottom = LineCollision(x1,y1,x2,y2,x3,y3+obstacle.size.y,x3+obstacle.size.x,y3+obstacle.size.y,player);
  intersections.top = LineCollision(x1,y1,x2,y2,x3,y3,x3+obstacle.size.x,y3,player)
  calc.push(intersections.left.distance,intersections.right.distance,
    intersections.top.distance,intersections.bottom.distance)
  calc.forEach((thing,index)=>{
    if (thing === undefined){
      calc[index] = Infinity
    }
  })
  if (Math.min.apply(null,calc) == intersections.left.distance && keys.mouse1.pressed){
    return {x:intersections.left.x,y:intersections.left.y}
  }
  else if (Math.min.apply(null,calc) == intersections.right.distance && keys.mouse1.pressed){
    return {x:intersections.right.x,y:intersections.right.y}
  }
  else if (Math.min.apply(null,calc) == intersections.top.distance && keys.mouse1.pressed){
    return {x:intersections.top.x,y:intersections.top.y}
  }
  else if (Math.min.apply(null,calc) == intersections.bottom.distance && keys.mouse1.pressed){
     return {x:intersections.bottom.x,y:intersections.bottom.y}
  }
  else {
    return {x:x1,y:y1}
  }
  
}

function loop(){  
  
    ctx.save()
    ctx.translate(-camera.x-camera.mousex,-camera.y-camera.mousey)


  // mapping background -- start
  for (var i = 0;i < canvas.width+worldBorder.maxX+236+camera.x+camera.mousex; i += 236){
    for (var j = 0;j < canvas.height+worldBorder.maxY+236+camera.y+camera.mousey; j += 236){
      ctx.drawImage(img,j,i)
    }} 
  // mapping background -- end


  //fps-ing -- start
  frameCount++
  var elapsedTime = performance.now() - startTime;
  if (elapsedTime > 500) {
    fps = Math.round(frameCount / (elapsedTime / 1000))
    frameCount = 0;
    startTime = performance.now();
  }
  //fps-ing -- end

  // drawing like a lot
    players.forEach((player)=>{
      var points = []   
        obstacles.forEach((obstacle)=>{
          obstacle.init()
            RectCollision(player,obstacle);
            points.push(NearestPoint(player,obstacle));
          })
        

      var nearest = points.reduce((a,b)=>Math.sqrt((player.position.x+player.size/2-a.x)**2+(player.position.y+player.size/2-a.y)**2)
      <Math.sqrt((player.position.x+player.size/2-b.x)**2+(player.position.y+player.size/2-b.y)**2)?a:b)
      if (keys.mouse1.pressed){
        player.ctx.beginPath()
        player.ctx.moveTo(player.position.x+player.size/2,player.position.y+player.size/2)
        player.ctx.lineTo(nearest.x,nearest.y)
        player.ctx.stroke()}
        player.init()
    })
  // drawing like a lot
  
    ctx.restore()
    
    requestAnimationFrame(loop)
}
loop()

addEventListener('keydown',({keyCode}) => { 
    if (keyCode == 87) // W
       {keys.up.pressed = true}
    if (keyCode == 83) // S
      {keys.down.pressed = true}
    if (keyCode == 65) // A
      {keys.left.pressed = true}
    if (keyCode == 68) // D
     {keys.right.pressed = true}
     if (keyCode == 32){// test
      obstacles[0].position.x += 1
     }
     if (keyCode == 16){// shift
      keys.shift.pressed = true
     }
})
addEventListener('keyup',({keyCode}) => {
 
    if (keyCode == 87) // W
       {keys.up.pressed = false}
    if (keyCode == 83) // S
      {keys.down.pressed = false}
    if (keyCode == 65) // A
      { keys.left.pressed = false}
    if (keyCode == 68) // D
     {keys.right.pressed = false}
     if (keyCode == 16){ // shift
      keys.shift.pressed = false
     }
})
addEventListener('mousemove',(event)=>{
  players[0].event = event
  
})
addEventListener('mousedown',(event)=>{
      keys.mouse1.pressed = true
})
addEventListener('mouseup',(event)=>{
      keys.mouse1.pressed = false
})
addEventListener('resize',resizeCanvas,false)