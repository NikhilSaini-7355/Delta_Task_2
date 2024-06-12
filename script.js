class LastStand_Game{
    constructor(canvas,context)
    {
       this.canvas = canvas;
       this.context = context;
       this.width = this.canvas.width;
       this.height = this.canvas.height;
       this.baseHeight = 720; // base height dimension of the background picture being used here
       this.ratio = this.height / this.baseHeight;
       this.gravity = 1; // gravity will pull down the object by 1 pixels per animation frame
       this.background = new Background(this);
       this.backgroundSpeed;
       this.minBackgroundSpeed;
       this.maxBackgroundSpeed;
       this.sound = new AudioControl();
       this.obstacles = [];
       this.numberOfObstacles = 10;
       this.score;
       this.gameOver;
       this.timer;
       this.bottomMargin;
       this.smallFont;
       this.largeFont;
       this.message1;
       this.message2;
       this.eventTimer = 0;  // done to do things in terms of milliseconds and not in terms of no. of animation frames
       this.eventInterval = 150;
       this.eventUpdate = false;
       this.touchStartX;
       this.swipeDistance = 50;
       // detecting swipes left from the tutorial
       this.survivor = new Survivor(this);
       this.resize(window.innerWidth,window.innerHeight);
       this.checkResize();
       // mouseevents
       this.canvas.addEventListener("mousedown",(e)=>{
           this.survivor.flap();
       });
       this.canvas.addEventListener("mouseup",(e)=>{
            setTimeout(()=>{this.survivor.wingsUp()},100);
    });
       // keyboard events
       window.addEventListener("keydown",(e)=>{
           if(e.key === ' ' || e.key==="Enter")
            {
                this.survivor.flap();
            }
            else if(e.key == 'R')
                {
                    restartGame();
                }
            else if(e.key === 'Shift' || e.key.toLowerCase() == 'c')
                {
                    this.survivor.startCharge();
                }
       });
       window.addEventListener("keyup",(e)=>{
        this.survivor.wingsUp();
    });
       // touch events
       this.canvas.addEventListener("touchstart",(e)=>{
            this.survivor.flap();
            this.touchStartX = e.changedTouches[0].pageX;
       });
       this.canvas.addEventListener("touchmove",(e)=>{
           e.preventDefault();
       });
       this.canvas.addEventListener("touchend",(e)=>{
        if(e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance)
            {
                this.survivor.startCharge();
            }
            else
            {
                this.survivor.flap();
            }
       });
    }
    drawGame(deltaTime) {
        if(this.gameOver == false) {this.timer += deltaTime;}
        this.handlePeriodicEvents(deltaTime);
        this.background.update();
        this.background.draw();
        this.drawStatusScore();
        this.survivor.update();
        this.survivor.draw();
        this.obstacles.forEach((obstacle)=>{
            obstacle.update();
            obstacle.draw();
        })
    }
    checkResize()
    {
        window.addEventListener("resize",(e)=> {
            this.resize(e.currentTarget.innerWidth,e.currentTarget.innerHeight);
        })
    }
    createObstacles()
    {
        this.obstacles = [];
        const firstX = this.baseHeight * this.ratio;
        const obstacleSpacing = 600 * this.ratio;
        for(let i=0;i<this.numberOfObstacles;i++)
            {
                this.obstacles.push(new Obstacle(this,firstX + i*obstacleSpacing));
            }
    }
    checkCollision(a , b)
    {
        let deltaX = a.collisionX - b.collisionX;
        let deltaY = a.collisionY - b.collisionY;
        let distance = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
        let radiiSum = a.collisionRadius + b.collisionRadius;
        if(distance <= radiiSum)
            {
                return true;
            }
        else
        {
            return false;
        }
    }
    timerInSeconds()
    {
        return (this.timer * 0.001).toFixed(1);
    }
    handlePeriodicEvents(deltaTime)
    {
        if(this.eventTimer < this.eventInterval)
            {
                this.eventTimer += deltaTime;
                this.eventUpdate = false;
            }
        else
        {
            this.eventTimer = this.eventTimer % this.eventInterval ;
            this.eventUpdate = true;
            console.log("time");
        }
    }
    drawStatusScore()
    {   this.context.save();
        this.context.fillText("Score :"+ this.score , this.width - this.smallFont ,this.largeFont);
        this.context.textAlign = "left";
        this.context.fillText("Timer :"+ this.timerInSeconds(), this.smallFont , this.largeFont);
        // order matter in dev and html canvas
        if(this.gameOver == true)
            {
                // if(this.survivor.collided == true)
                //     {
                        
                //     }
                // else if(this.obstacles.length <= 0)
                //     {
                        
                //     }
                this.context.textAlign = "center";
                this.context.font = this.largeFont+"px Permanent Marker";
                this.context.fillText(this.message1,this.width*0.5,this.height*0.5 -this.largeFont,this.width);
                this.context.font = this.smallFont+"px Permanent Marker";
                this.context.fillText(this.message2,this.width*0.5,this.height*0.5 - this.smallFont,this.width);
                this.context.fillText("Press R to Play Again",this.width*0.5,this.height*0.5,this.width);
            }

        if(this.survivor.energy <= 20) 
        {
            this.context.fillStyle = "red";
        }
        else if(this.survivor.energy >= this.survivor.maxenergy )
            {
               this.context.fillStyle = "orangered";
            }
        for(let i=0;i<this.survivor.energy;i++)
            {
                this.context.fillRect(10+i*this.survivor.barSize*2,40, this.survivor.barSize, this.survivor.barSize * 5);
            }
        this.context.restore();
    }
    triggerGameOver()
    {
        if(this.gameOver == false)
            {
                this.gameOver = true;
                if(this.obstacles.length <= 0)
                    {
                        this.sound.play(this.sound.win);
                        this.message1 = "Game Won";
                        this.message2 = "Completed in :"+ this.timerInSeconds()+ " seconds";
                    }
                else 
                { 
                    this.sound.play(this.sound.lose);
                    this.message1 = "Game Lost";
                    this.message2 = "Collided in :"+this.timerInSeconds() + " seconds";
                }
            }
    }
    resize(width,height)
    {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.context.fillStyle = "red";
        this.context.textAlign = "right";
        this.context.lineWidth = 3;
        this.context.strokeStyle = "white";
        this.ratio = this.height / this.baseHeight;
        this.gravity = 0.15 * this.ratio;
        this.backgroundSpeed = 2 * this.ratio;
        this.minBackgroundSpeed = this.backgroundSpeed;
        this.maxBackgroundSpeed = this.backgroundSpeed * 5;
        this.background.resize();
        this.bottomMargin = Math.floor(50 * this.ratio);
        this.smallFont = Math.ceil(20 * this.ratio);
        this.largeFont = Math.ceil(45 * this.ratio);
        this.context.font = this.smallFont+"px Permanent Marker";
        this.survivor.resize();
        this.createObstacles();
        this.obstacles.forEach((obstacle)=>{
            obstacle.resize()
        });
        this.score = 0;
        this.gameOver = false;
        this.timer = 0;
        // console.log(this.ratio);
    }

}

class Survivor{
    constructor(game)
    {
        this.game = game;
        this.x = 50;
        this.y = 0;
        this.spriteHeight = 200;
        this.spriteWidth = 200;
        this.width;
        this.height;
        this.speedY = -5;
        this.speedX;
        this.collisionX ;
        this.collisionY ;
        this.collisionRadius;
        this.flapSpeed;
        this.collided ;
        this.energy = 30;
        this.maxenergy = this.energy * 2;
        this.minenergy = 15;
        this.barSize;
        this.charging;   // see state design pattern from FL for better design effects and code 
        this.image = document.getElementById('survivor');
        this.frameY;
    }
    draw()
    {   
       // this.game.context.strokeRect(this.x,this.y,this.width,this.height);
        this.game.context.drawImage(this.image,0,this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        this.game.context.beginPath();
        this.game.context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI * 2);
        this.game.context.stroke();
    }
    update()
    {   this.y += this.speedY;
        if(this.speedY >= 0)
            {
                this.wingsUp();
            }
        this.handleEnergy();
        this.collisionY = this.y + this.height * 0.5;
        if(this.isTouchingBottom()==false && this.charging == false)
            {
                this.speedY += this.game.gravity;
            }
        else
        {
            this.speedY = 0;
        }
        if(this.isTouchingBottom()==true)
            {
                this.y = this.game.height - this.height - this.game.bottomMargin;
                this.wingsIdle();
            }
    }
    resize()
    {
        this.width = this.spriteWidth * this.game.ratio;
        this.height = this.spriteHeight * this.game.ratio;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -7 * this.game.ratio;
        this.flapSpeed = 5 * this.game.ratio;
        this.collisionRadius = this.width * 0.5;
        this.collisionX = this.x + this.width * 0.5;
        this.collided = false;
        this.barSize = Math.floor(5 * this.game.ratio);
         this.collided = false ;
        this.frameY = 0;
        this.charging = false;
    }
    startCharge() 
    {  
        if(this.energy >= this.minenergy && !this.charging)
        {
            this.wingsCharge();
            this.charging = true;
            this.game.backgroundSpeed = this.game.maxBackgroundSpeed;
            this.game.sound.play(this.game.sound.charge);
        }
        else
        {
            this.stopCharge();
        }
    }
    stopCharge()
    {   this.charging = false;
        this.game.backgroundSpeed = this.game.minBackgroundSpeed;
    }
    wingsIdle()
    {
        if(this.charging == false)
            {
                this.frameY = 0;
            }
    }
    wingsDown()
    {
        if(this.charging == false)
            {
                this.frameY = 1;
            }
    }
    wingsUp()
    {   if(this.charging == false)
        {
            this.frameY = 2;
        }
    }
    wingsCharge()
    {
        this.frameY = 3;
    }
    isTouchingTop()
    {
        if(this.y <= 0)
            {
                return true;
            }
        else
        {
            return false;
        }
    }
    isTouchingBottom()
    {   if(this.y >= this.game.height - this.height - this.game.bottomMargin)
        {
            return true;
        }
        else
        {
            return false;
        } 
    }
    handleEnergy()
    {   if(this.game.eventUpdate == true) // was working well when it was not there also with earlier values
      {
            if(this.energy < this.maxenergy)
                {
                    this.energy += 0.2; // 0.01
                }
            if(this.charging == true)
                {
                    this.energy -= 2;  // 0.1
                    if(this.energy <= 0)
                        {
                            this.energy = 0;
                            this.stopCharge();
                        }
                }
       }        
    }
    flap()
    {   this.stopCharge();
        if(this.isTouchingTop()==false)
        {   this.game.sound.play(this.game.sound.flap1);
            this.speedY = -this.flapSpeed;
            this.wingsDown();
        }       
    }
}

// finishing touches part left from the tutorial
class Background{
    constructor(game)
    {
        this.game = game;
        this.backgroundImage = document.getElementById("background");
        this.width = 2400; // these values which we use here should exactly match the dimensions of the background image
        this.height = this.game.baseHeight;
        this.scaledWidth;
        this.scaledHeight;
        this.x;
    }
    update()
    {   this.x -= this.game.backgroundSpeed;
        if(this.x <= -this.scaledWidth)
            {
                this.x = 0;
            }
    }
    draw()
    {
        this.game.context.drawImage(this.backgroundImage,this.x,0,this.scaledWidth,this.scaledHeight);
        this.game.context.drawImage(this.backgroundImage,this.x + this.scaledWidth - 1,0,this.scaledWidth,this.scaledHeight);
        if(this.game.canvas.width >= this.scaledWidth)
            {
                this.game.context.drawImage(this.backgroundImage,this.x + this.scaledWidth*2 - 2,0,this.scaledWidth,this.scaledHeight);
            }
    }
    resize()
    {   this.scaledWidth = this.width * this.game.ratio;
        this.scaledHeight =  this.height * this.game.ratio;
        this.x = 0;
    }
}

class Obstacle{
    constructor(game,x)
    {
        this.game = game;
        this.spriteWidth = 120;
        this.spriteHeight = 120;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.collisionX;
        this.collisionY;
        this.collisionRadius = this.scaledWidth * 0.5;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaledHeight) ; // this.scaledHeight * 0.5
        this.speedY = Math.random()>0.5 ? 1 : -1;
        this.speedY *= this.game.ratio;
        this.markedToRemove = false;
        this.image = document.getElementById("obstacle");
        this.frameX = Math.floor(Math.random() * 4);
    }
    update()
    {  this.y += this.speedY;
       this.x -= this.game.backgroundSpeed;
       this.collisionX = this.x + this.scaledWidth * 0.5;
       this.collisionY = this.y + this.scaledHeight * 0.5;
       if(this.y <=0 || this.y >= this.game.height - this.scaledHeight)
        {
            this.speedY *= -1;
        }
        if(this.isOffScreen())
            {
                this.markedToRemove = true;
                this.game.obstacles = this.game.obstacles.filter((obstacle)=>{
                    if(obstacle.markedToRemove == false)
                        {
                            return true;
                        }
                    else
                    {
                        return false;
                    }
                })
                console.log(this.game.obstacles);
             this.game.score++;
                if(this.game.obstacles.length <= 0)
                    {
                        //this.game.gameOver = true;
                        this.game.triggerGameOver();
                    }
            }
            if(this.game.checkCollision(this,this.game.survivor)==true)
                {
                   // this.game.gameOver = true;
                    this.game.survivor.collided = true;
                    this.game.survivor.stopCharge();
                    //this.game.sound.play(this.game.sound.lose);
                    this.game.triggerGameOver();
                }                
    }
    draw()
    {
       //this.game.context.fillRect(this.x,this.y,this.scaledWidth,this.scaledHeight);
       this.game.context.beginPath();
       this.game.context.drawImage(this.image,this.frameX * this.spriteWidth,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.scaledWidth,this.scaledHeight)
       this.game.context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI * 2);
       this.game.context.stroke();
    }
    resize()
    {
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.collisionRadius = this.scaledWidth * 0.5;
    }
    isOffScreen()
    {
        if(this.x < -this.scaledWidth)
            {
                return true;
            }
            else
            {
                return false;
            }
    }
}

class AudioControl{
    constructor()
    {
        this.charge = document.getElementById('charge');
        this.flap1 = document.getElementById('flap1');
        this.win = document.getElementById("win");
        this.lose = document.getElementById("lose");
    }
    play(sound)
    {
        sound.currentTime = 0;
        sound.play();
    }
}
window.addEventListener('load',function() {
    const canvas = this.document.getElementById("canvas-1");
    const context = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 720;
   // whenever we resize the canvas then, the context attributes are set to their default values  so setting style from here would not work
    const game = new LastStand_Game(canvas,context);

    let lastTime = 0;
    // Animation loop is here 
    function animate(timeStamp)
    {   let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        context.clearRect(0,0,canvas.width,canvas.height); // can be commented out 
        game.drawGame(deltaTime);
        //if(game.gameOver == false)
       //     {
                requestAnimationFrame(animate);
        //    }
    }
    this.requestAnimationFrame(animate);
})