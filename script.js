
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
       this.zombies = []
       this.defenseBlocks = [];
       this.automatedDefences = [];
       this.TrapsAndMineDefences = [];
       this.numberOfautomatedDefence = 10;
       this.numberOfObstacles = 5;
       this.score;
       this.numberOfZombies = 10;
       this.numberOfDefenseBlocks = 1;
       this.gameOver;
       this.timer;
       this.bottomMargin;
       this.smallFont;
       this.isSurvivorAttacking = false;
       this.largeFont;
       this.message1;
       this.message2;
       this.eventTimer = 0;  // done to do things in terms of milliseconds and not in terms of no. of animation frames
       this.eventInterval = 125;
       this.eventUpdate = false;
       this.touchStartX;
       this.swipeDistance = 50;
       this.isPaused = false;
       this.isPreparationPhaseActive = false;
       // detecting swipes left from the tutorial
       this.preparationPhase = new PreparationPhase(this);
       this.survivor = new Survivor(this);
       this.resize(window.innerWidth,window.innerHeight);
       this.weapons = new Weapon(this);
       this.ammunitions = [];
       this.checkResize();
       // mouseevents
       this.canvas.addEventListener("mousedown",(e)=>{
        //    this.survivor.jump();
            if(this.weapons.isListMoving == true)
                {
                    return;
                }
            let a = this.canvas.width * this.ratio;
            let b = this.canvas.height;

            const x = e.clientX ;
            const y = e.clientY ;

            if(this.weapons.isWeaponListShown == false)
                {   // console.log("hey1 ");
                     if(x>0 && x<a*0.045 && y>b*0.40 && y<b*0.60)
                        {
                            this.weapons.isWeaponListShown = true;
                            console.log("hello11")
                        }
                }
            else if(this.weapons.isWeaponListShown == true )
                {  // console.log("hey  2");
                  //  console.log(x>a*0.1);
                  //  console.log(x<a*0.1+a*0.045);
                   // console.log(y>b*0.40);
                   // console.log(y<b*0.60);
                    if(x>a*0.1 && x<a*0.1+a*0.045 && y>b*0.4 && y<b*0.6)
                        {
                            this.weapons.isWeaponListShown = false;
                            console.log("hello12")
                        }
                    else if(x>a*0.005 && x<a*0.09 * 0.9 + a*0.005 && y>b*0.15 && y<b*0.80/5 * 0.9 + b*0.15)
                        {   
                              this.weapons.selectedWeapon = 0;
                        }
                    else if(x>a*0.005 + a*0.09*0.3 && x<a*0.005 + a*0.09*0.3 + a*0.09 * 0.4  && y>b*0.15+b*0.80*1/5 && y<b*0.15+b*0.80*1/5 +b*0.80/5 * 0.9)
                        {   
                              this.weapons.selectedWeapon = 1;
                        }
                    else if(x>a*0.005 && x<a*0.005+ a*0.09 && y>b*0.15+b*0.80*2/5 && y<b*0.80/5 * 0.9 + b*0.15+b*0.80*2/5)
                        {      
                              this.weapons.selectedWeapon = 2;
                        }
                    else if(x>a*0.005 && x<a*0.09 +  a*0.005 && y>b*0.15+b*0.80*3/5 && y<b*0.15+b*0.80*3/5 + b*0.80/5 * 0.9)
                        {    
                              this.weapons.selectedWeapon = 3;
                        }
                    else if(x>a*0.005 && x<a*0.005+a*0.09  && y>b*0.15+b*0.80*4/5 && y<b*0.15+b*0.80*4/5 + b*0.80/5 * 0.9)
                        {     
                              this.weapons.selectedWeapon = 4; ///////////////lklklkkjkj
                        }
                }
            
            if(this.isSurvivorAttacking == true)
                {
                    this.weapons.mousePosition = this.getMousePosition(e);
                    // console.log(this.weapons.mousePosition);
                    this.survivor.startAttack();
                    
                }
            if(this.isPreparationPhaseActive == true)
                {
                    if(x > a+a*0.005 && x<a*0.09+a+a*0.005 && y>b*0.15+b*0.80*1/5 && y<b*0.80/5 * 0.9+b*0.15+b*0.80*1/5 )
                        {
                             this.preparationPhase.addTrapsAndMines(0);
                        }
                    else if(x > a+a*0.005 && x < a*0.09+a+a*0.005 && y>b*0.15+b*0.80*2/5 && y<b*0.15+b*0.80*2/5+b*0.80/5 * 0.9)
                        {
                             this.preparationPhase.addTrapsAndMines(1);
                        }
                }
       });
       this.canvas.addEventListener("mouseup",(e)=>{
            setTimeout(()=>{this.survivor.wingsUp()},100);
    });
       

    //    this.canvas.addEventListener("click",(e)=>{

    //    })
       // keyboard events
       window.addEventListener("keydown",(e)=>{
           if( e.key.toLowerCase() == 'w');
            {
                this.survivor.jump();
            }
             if(e.key == 'R')
                {
                    restartGame();
                }
            else if( e.key.toLowerCase() == 'c')
                {
                    this.survivor.startCharge();
                }
            else if(e.key.toLowerCase() == 'a')
                {
                    this.survivor.runLeft();
                }
            else if(e.key.toLowerCase() == 'd')
                {
                    this.survivor.runRight();
                }
            else if(e.key.toLowerCase()=='s')
                {
                    this.survivor.stop();
                }
            else if(e.key.toLowerCase()=='j')  // just to test
                {
                    this.survivor.changeSurvivorState("attack");
                }
            else if(e.key == "Shift")
                {   
                    this.isSurvivorAttacking = true;    
                }
            else if(e.key == "Enter")
                {
                    this.weapons.canFire = true;
                }
            else if(e.key.toLowerCase()== 'y')
                {
                    this.survivor.applyJetPack();
                }
       });
       window.addEventListener("keyup",(e)=>{
        this.survivor.wingsUp();
        this.isSurvivorAttacking = false;
        this.weapons.canFire = false;
        if(this.survivor.frameX == 9)
            { 
                // Not sure
            }
    });
       // touch events
    //    this.canvas.addEventListener("touchstart",(e)=>{
    //         this.survivor.jump();
    //         this.touchStartX = e.changedTouches[0].pageX;
    //    });
    //    this.canvas.addEventListener("touchmove",(e)=>{
    //        e.preventDefault();
    //    });
    //    this.canvas.addEventListener("touchend",(e)=>{
    //     if(e.changedTouches[0].pageX - this.touchStartX > this.swipeDistance)
    //         {
    //             this.survivor.startCharge();
    //         }
    //         else
    //         {
    //             this.survivor.jump();
    //         }
    //    });
    }
    getMousePosition(e)
    {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x : e.clientX - rect.left,
            y : e.clientY - rect.top
        };
    }
    drawGame(deltaTime) {
        if(this.gameOver == false) {this.timer += deltaTime;}
        this.handlePeriodicEvents(deltaTime);
        this.background.update();
        this.background.draw();
        this.drawStatusScore();
        this.survivor.update();
        this.survivor.draw();
        if(this.isPreparationPhaseActive == true)
            {
                this.preparationPhase.update();
                this.preparationPhase.draw();
            }
        if(this.isPreparationPhaseActive == false)
            {
                 this.obstacles.forEach((obstacle)=>{
                 obstacle.update();
                 obstacle.draw();
            });
            }
        // Think about defenceBlock
        this.defenseBlocks.forEach((defenseBlock)=>{
            defenseBlock.update();
            defenseBlock.draw();
        })
        this.automatedDefences.forEach((automatedDefence)=>{
            automatedDefence.update();
            automatedDefence.draw();
        })
        this.TrapsAndMineDefences.forEach((trapsAndMines)=>{
            trapsAndMines.update();
            trapsAndMines.draw();
        })
        if(this.isPreparationPhaseActive == false)
        {
            this.zombies.forEach((zombie)=>{
            zombie.update();
            zombie.draw();
        });
        }
        this.ammunitions.forEach((ammunition)=>{
            
            ammunition.draw();
            ammunition.update();
        })
        this.weapons.update();
        this.weapons.draw();
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
        const obstacleSpacing = 1200 * this.ratio;
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
    ZombieHitsSurvivor(zombie)
    {   if(this.survivor.collisionY + this.survivor.collisionRadius < zombie.y || this.survivor.collisionY - this.survivor.collisionRadius > zombie.y + zombie.scaledHeight)
        {
            return false;
        }
        if(zombie.x >= this.survivor.collisionX + this.survivor.collisionRadius)
            {
                 if(zombie.x - this.survivor.collisionX <= this.survivor.collisionRadius+3*this.ratio)
                    {
                        return true;
                    }
                else {
                    return false;
                }
            }
        else if(zombie.x <= this.survivor.x - this.survivor.collisionRadius)  //doubt ,, earlier the condition was this---->>>>  this.survivor.x - this.survivor.collisionRadius
            {
                if(this.survivor.collisionX - zombie.x <= this.survivor.collisionRadius+zombie.scaledWidth)
                    {
                        return true;
                    }
                else {
                    return false;
                }
            }
        else if(zombie.x>= this.survivor.collisionX - this.survivor.collisionRadius && zombie.x <= this.survivor.collisionX + this.survivor.collisionRadius)
            {
                return true;
            }
        else if(zombie.x+zombie.scaledWidth>= this.survivor.collisionX - this.survivor.collisionRadius && zombie.x+zombie.scaledWidth <= this.survivor.collisionX + this.survivor.collisionRadius)
            {
                return true;
            }
        }
    ZombieHitsAutomatedDefences(zombie)
    {   let isHit = false; let finalIsHit = false;
        this.automatedDefences.forEach((automatedDefence)=>{
        if(automatedDefence.collisionY + automatedDefence.collisionRadius < zombie.y || automatedDefence.collisionY - automatedDefence.collisionRadius > zombie.y + zombie.scaledHeight)
            {
                isHit =  false;
            }
            if(zombie.x >= automatedDefence.collisionX + automatedDefence.collisionRadius)
                {
                     if(zombie.x - automatedDefence.collisionX <= automatedDefence.collisionRadius+3*this.ratio)
                        {
                            isHit = true;
                        }
                    else {
                        isHit = false;
                    }
                }
            else if(zombie.x <= automatedDefence.x - automatedDefence.collisionRadius)  //doubt ,, earlier the condition was this---->>>>  this.survivor.x - this.survivor.collisionRadius
                {
                    if(automatedDefence.collisionX - zombie.x <= automatedDefence.collisionRadius+zombie.scaledWidth)
                        {
                            isHit = true;
                        }
                    else {
                        isHit = false;
                    }
                }
            else if(zombie.x>= automatedDefence.collisionX - automatedDefence.collisionRadius && zombie.x <= automatedDefence.collisionX + automatedDefence.collisionRadius)
                {
                    isHit = true;
                }
            else if(zombie.x+zombie.scaledWidth>= automatedDefence.collisionX - automatedDefence.collisionRadius && zombie.x+zombie.scaledWidth <= automatedDefence.collisionX + automatedDefence.collisionRadius)
                {
                    isHit = true;
                }
            if(isHit == true)
                {
                    finalIsHit = true;
                }
            });

        return finalIsHit;
    }
    pause()
    {
       this.isPaused = true;
    }
    play()
    {
       this.isPaused = false;
    }
    leaderboard()
    {

    }
    checkCollisionWithDefenseBlock(player)
    {   
        let foundBlock = null;
        let moveX = 0;
        let moveY = 0;
        this.defenseBlocks.forEach((defenseBlock)=>{
          
             if(defenseBlock.numberOfBlocks == 1)
                {   
                   if(player.x - defenseBlock.x <= defenseBlock.scaledWidth+60*this.ratio && player.y+player.scaledHeight == defenseBlock.y+defenseBlock.scaledHeight && player.x > defenseBlock.x)
                    {   
                        // player.isJumping = true;
                        // alert("hello1"+defenseBlock.x)
                        foundBlock =  defenseBlock;
                    }
                    else if(defenseBlock.x - player.x <= player.scaledWidth+60*this.ratio && player.y+player.scaledHeight == defenseBlock.y+defenseBlock.scaledHeight && defenseBlock.x > player.x) 
                        {   
                            // player.isJumping = true;
                            // alert("hello2"+defenseBlock.x)
                            foundBlock = defenseBlock;
                        }
                    else if(player.y + player.scaledHeight <= defenseBlock.y && (player.x - defenseBlock.x <= defenseBlock.scaledWidth || defenseBlock.x - player.x <= player.scaledWidth))
                        {
                            
                        }
                }
             else if(defenseBlock.numberOfBlocks == 2)
                {  
                    if(defenseBlock.orientation == -1)
                        {   
                            if(defenseBlock.x - player.x <= 60*this.ratio+player.scaledWidth + 0.5*defenseBlock.scaledWidth && player.y+player.scaledHeight == defenseBlock.y+defenseBlock.scaledHeight && defenseBlock.x > player.x) 
                                {   
                                    // player.isJumping = true;
                                    // alert("hello3"+defenseBlock.x)
                                    foundBlock = defenseBlock;
                                }
                            else if(player.x - defenseBlock.x <= 60*this.ratio+1*defenseBlock.scaledWidth && player.y+player.scaledHeight == defenseBlock.y+defenseBlock.scaledHeight && player.x > defenseBlock.x )
                                {   
                                    // player.isJumping = true;
                                    // alert("hello4"+defenseBlock.x)
                                    foundBlock = defenseBlock;
                                }
                        }
                    else if(defenseBlock.orientation == 1)
                        {   
                            if(player.x - defenseBlock.x <= 60*this.ratio+1.5*defenseBlock.scaledWidth && player.y+player.scaledHeight == defenseBlock.y+defenseBlock.scaledHeight && player.x > defenseBlock.x)
                                {  
                                    // player.isJumping = true;
                                    // alert("hello5"+defenseBlock.x)
                                    foundBlock = defenseBlock;
                                }
                            else if(defenseBlock.x - player.x <= 60*this.ratio+player.scaledWidth && player.y+player.scaledHeight == defenseBlock.y+defenseBlock.scaledHeight && defenseBlock.x > player.x)
                                {   
                                    // player.isJumping = true;
                                    // alert("hello6"+defenseBlock.x)
                                    foundBlock = defenseBlock;
                                }
                        }
                }
        });
        if(player.isJumping == true && foundBlock == null)
            {
                return null;
            }
        else if(player.isJumping == true && foundBlock != null)
            {
                player.isJumping = false;
                return null;
            }
        else if(player.isJumping == false && foundBlock !=null)
            {
                player.isJumping = true;
                return foundBlock;
            }
        else if(player.isJumping == false && foundBlock == null)
            {   
                return foundBlock;
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
            // console.log("time");
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
        if(this.isPreparationPhaseActive == false)
            {
                for(let i=0;i<this.survivor.energy;i++)
                    {
                        this.context.fillRect(10+i*this.survivor.barSize*2,50, this.survivor.barSize, this.survivor.barSize * 5);
                    }
            }
        else {
                 this.context.fillText("PREPARATION PHASE",10,60);
             }
        this.context.fillStyle = "Blue";
        for(let i=0;i<this.survivor.health;i++)
            {
                this.context.fillRect(500+10+i*this.survivor.barSize*2,40, this.survivor.barSize, this.survivor.barSize * 5);
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
        this.createZombies();
        this.createObstacles();
        this.createDefenseBlocks();
        this.createAutomatedDefences();
        this.isSurvivorAttacking = false;
        // this.weapons.resize(); // dont know why it is not working
        this.isPreparationPhaseActive = true; // not sure may be false is better here
        this.preparationPhase.resize();
        this.obstacles.forEach((obstacle)=>{
            obstacle.resize()
        });
        this.zombies.forEach((zombie)=>{
            zombie.resize();
        })
        this.defenseBlocks.forEach((defenseBlock)=>{
            defenseBlock.resize();
        })
        this.TrapsAndMineDefences.forEach((trapsAndMines)=>{
            trapsAndMines.resize();
        })
        this.score = 0;
        this.gameOver = false;
        this.timer = 0;
        // console.log(this.ratio);
    }
    createZombies()
    {
        this.zombies = [];
        const firstX = this.baseHeight * this.ratio + 400 ;
        const zombieSpacing = 300 * this.ratio;
        for(let i=0;i<this.numberOfZombies;i++)
            {
                this.zombies.push(new Zombie(this,Math.pow(-1,i)*(firstX + i*zombieSpacing),1));
            }
    }
    createDefenseBlocks()
    {
        this.defenseBlocks = [];
        const firstX = this.baseHeight * this.ratio ;
        const defenseBlockSpacing = 300 * this.ratio;
        for(let i=0;i<this.numberOfDefenseBlocks;i++)
            {
                this.defenseBlocks.push(new DefenseBlocks(this,Math.pow(-1,i)*(firstX + i*defenseBlockSpacing)));
            }
    }
    createAutomatedDefences()
    {  
        this.automatedDefences = [];
        const firstX = this.baseHeight * this.ratio +  1000 ;
        const automatedDefenceSpacing = 700 * this.ratio;
        for(let i=0;i<this.numberOfautomatedDefence;i++)
            {   let type = Math.floor(Math.random()*2);
                this.automatedDefences.push(new AutomatedDefences(this,Math.pow(-1,i)*(firstX + i*automatedDefenceSpacing),type));
            }
    }
}

class Menu{
    constructor()
    {

    }
}
class PreparationPhase
{
    // landmines and bearTraps
    constructor(game)
    {   this.game = game;
        this.TrapsAndMinesArray = [{  
            "defence" : "BearTrap",
            "spriteWidth" : 740,
            "spriteHeight" : 740,
            "Image" : document.getElementById("BearTrap"),
            "amount" : 3
          },{
            "defence" : "LandMine",
            "spriteWidth" : 300,
            "spriteHeight" : 300,
            "Image" : document.getElementById("LandMine"),
            "amount" : 3
          }]
    }
    addTrapsAndMines(type)
    {
       if(this.TrapsAndMinesArray[type]["amount"]>0)
        {
            this.TrapsAndMinesArray[type]["amount"] -= 1;
            this.game.TrapsAndMineDefences.push(new TrapsAndMines(this.game,this.game.survivor.x,type));
        }
    }  
    draw()
    {
        let a = this.game.canvas.width * this.game.ratio;
        let b = this.game.canvas.height;
        this.game.context.beginPath();
        this.game.context.roundRect(a,b*0.15+b*0.80*1/5,a*0.1,b*0.80*2/5,[10,10,10,10]);
        this.game.context.roundRect(a+a*0.005,b*0.15+b*0.80*1/5,a*0.09,b*0.80/5,[10,10,10,10]);
        this.game.context.drawImage(this.TrapsAndMinesArray[0]["Image"],a+a*0.005,b*0.15+b*0.80*1/5,a*0.09 ,b*0.80/5 * 0.9);
        this.game.context.roundRect(a+a*0.005,b*0.15+b*0.80*2/5,a*0.09,b*0.80/5,[10,10,10,10]);
        this.game.context.drawImage(this.TrapsAndMinesArray[1]["Image"],a+a*0.005 ,b*0.15+b*0.80*2/5,a*0.09 ,b*0.80/5 * 0.9);
        this.game.context.stroke();
    }
    update()
    {
        if(this.game.timerInSeconds() > 60.0)
            {
                this.game.isPreparationPhaseActive = false;
            }
    }
    resize()
    {
        this.TrapsAndMinesArray[0]["amount"] = 3;
        this.TrapsAndMinesArray[1]["amount"] = 3;
    }
}
// idea : survivor starting out from middle pos or little less than middle pos then doing the movement as shown in the tutorial
// Health Bar
class Survivor{
    constructor(game)
    {
        this.game = game;
        this.x = 50;
        this.y = 0;
        this.spriteHeight = 458;
        this.spriteWidth = 363;
        this.width;
        this.height;
        this.speedY = -5 * this.game.ratio;
        this.speedX = 0;
        this.maxSpeedX = 5;
        this.minSpeedX;
        this.collisionX ;
        this.collisionY ;
        this.collisionRadius;
        this.jumpSpeed;
        this.collided ;
        this.energy = 30;
        this.maxenergy = this.energy * 2;
        this.minenergy = 15;
        this.barSize;
        this.charging;   // see state design pattern from FL for better design effects and code 
        this.image = document.getElementById('Survivor_Run');
        this.frameY;
        this.frameX = 0;
        this.frameStartX = 0;
        this.isRunning ;
        this.health = 50; 
        this.maxHealth = 50;
        this.survivorState = "run";
        this.survivorDirection = "right";
        this.isImmune = false;
        this.isDead = false;
        this.isJetPackPresent = false;
        this.jetPackImage = document.getElementById("jetPack");

        this.powerUpArray = [{
            "name" : "charge"
        }, {
            "name" : "healthPack"
         },{
            "name" : "Immunity"
         }];
        
        this.SurvivorSpriteAnimations = {
            "idle" : {
                 Image : document.getElementById("Survivor_Idle"),
                 Image2 : document.getElementById("Survivor_Idle2"),
                 spriteHeight : 439,
                 spriteWidth : 232,
                 numberOfFrames : 10
                     },
             "attack" : {
                Image : document.getElementById("Survivor_Attack"),
                Image2 : document.getElementById("Survivor_Attack2"),
                 spriteHeight : 495,
                 spriteWidth : 536,
                 numberOfFrames : 10,
                     },
             "dead" : {
                Image : document.getElementById("Survivor_Dead"),
                Image2 : document.getElementById("Survivor_Dead2"),
                 spriteHeight : 498,
                 spriteWidth : 482,
                 numberOfFrames : 10,
                     },
             "jump" : {
                Image : document.getElementById("Survivor_Jump"),
                Image2 : document.getElementById("Survivor_Jump2"),
                spriteHeight : 483,
                spriteWidth : 362,
                numberOfFrames :10,
                     },
             "run" : {
                 Image : document.getElementById("Survivor_Run"),
                 Image2 : document.getElementById("Survivor_Run2"),
                 spriteHeight : 458,
                 spriteWidth : 363,
                 numberOfFrames : 10,
                     },
             "throw" : {
                 Image : document.getElementById("Survivor_Throw"),
                 Image2 : document.getElementById("Survivor_Throw2"),
                 spriteHeight : 451,
                 spriteWidth : 377,
                 numberOfFrames : 10,
                     }
                    }
    }
    changeSurvivorState(state)
    {
        this.survivorState = state;
        if(this.survivorDirection == "left")
            {
                 this.image = this.SurvivorSpriteAnimations[this.survivorState].Image2;
                 this.frameX=0;
                 this.spriteWidth = this.SurvivorSpriteAnimations[this.survivorState].spriteWidth ;
                 this.spriteHeight = this.SurvivorSpriteAnimations[this.survivorState].spriteHeight;
                 let totalFrames  =  this.SurvivorSpriteAnimations[this.survivorState].numberOfFrames;
                 this.frameStartX = (totalFrames - this.frameX ) * this.spriteWidth;
              }
         else if(this.survivorDirection == "right")
             {
                 this.image = this.SurvivorSpriteAnimations[this.survivorState].Image;
                 this.frameX=0;
                 this.spriteWidth = this.SurvivorSpriteAnimations[this.survivorState].spriteWidth ;
                 this.spriteHeight = this.SurvivorSpriteAnimations[this.survivorState].spriteHeight;
                 let totalFrames  =  this.SurvivorSpriteAnimations[this.survivorState].numberOfFrames;
                 this.frameStartX = this.frameX * this.spriteWidth;
              }

              this.width = this.spriteWidth * this.game.ratio *  0.6;
              this.height = this.spriteHeight * this.game.ratio * 0.7;
              this.collisionRadius = this.width * 0.5;
              this.collisionX = this.x + this.width * 0.5;
              this.collisionY = this.y + this.height * 0.5;
              this.draw();
    }
    draw()
    {   
       // this.game.context.strokeRect(this.x,this.y,this.width,this.height);
    //    console.log(this.image);
    if(this.isJetPackPresent == true)
        {
            this.game.context.drawImage(this.jetPackImage,0,0,935,684,this.x,this.y,this.width,this.height);
        }
        if(this.survivorDirection == "left")
            {
                this.game.context.drawImage(this.image,this.frameStartX,0,-this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
            }
        else{
            this.game.context.drawImage(this.image,this.frameStartX,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.width,this.height);
        }
        this.game.context.beginPath();
        this.game.context.arc(this.collisionX,this.collisionY,Math.abs(this.collisionRadius),0,Math.PI * 2);
        this.game.context.stroke();
    }
    applyJetPack()
    {   
        if(this.isJetPackPresent == true)
            {
                this.isJetPackPresent = false;
            }
        else if(this.isJetPackPresent == false)
            {
                this.isJetPackPresent = true;
            }
    }
    update()
    {   this.y += this.speedY;
        this.x += this.speedX;

      if(this.game.eventUpdate == true)
        {
        if(this.survivorDirection == "left")
            {
                //  this.image = this.SurvivorSpriteAnimations[this.survivorState].Image2;
                //  this.spriteWidth = this.SurvivorSpriteAnimations[this.survivorState].spriteWidth ;
                //  this.spriteHeight = this.SurvivorSpriteAnimations[this.survivorState].spriteHeight;
                 let totalFrames  =  this.SurvivorSpriteAnimations[this.survivorState].numberOfFrames;
                 if(this.survivorState == "dead" && this.frameX == 9)
                    {
                        this.game.triggerGameOver();
                    }
                 this.frameX = (this.frameX+1)%totalFrames;
                 this.frameStartX = (totalFrames - this.frameX ) * this.spriteWidth;
              }
         else if(this.survivorDirection == "right")
             {
                //  this.image = this.SurvivorSpriteAnimations[this.survivorState].Image;
                //  this.spriteWidth = -this.SurvivorSpriteAnimations[this.survivorState].spriteWidth ;
                //  this.spriteHeight = this.SurvivorSpriteAnimations[this.survivorState].spriteHeight;
                 let totalFrames  =  this.SurvivorSpriteAnimations[this.survivorState].numberOfFrames;
                 this.frameX = (this.frameX+1)%totalFrames;
                 this.frameStartX = this.frameX*this.spriteWidth;
              }
            }
        


        if(this.speedY >= 0)
            {
                this.wingsUp();
            }
        this.handleEnergy();
        this.collisionY = this.y + this.height * 0.5;
        this.collisionX = this.x + this.width * 0.5;
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
        if(this.x <= 0)
            {
                this.x = 0;
                if(this.isRunning == true)
                    {  
                         this.game.background.shouldMove = "left"
                    }
            }
        if(this.x >= this.game.width/2)
            {
                this.x = this.game.width/2;
                if(this.isRunning == true)
                    {  
                         this.game.background.shouldMove = "right";
                    }
            }
        
    }
    resize()
    {
        this.width = this.spriteWidth * this.game.ratio * 0.6;
        this.height = this.spriteHeight * this.game.ratio * 0.7;
        this.y = this.game.height * 0.5 - this.height * 0.5;
        this.speedY = -7 * this.game.ratio;
        // this.speedX =  5 * this.game.ratio;
        this.minSpeedX = this.speedX;
        this.maxSpeedX = 7 * this.game.ratio;
        this.jumpSpeed = 7 * this.game.ratio;
        this.collisionRadius = this.width * 0.5;
        this.collisionX = this.x + this.width * 0.5;
        this.collided = false;
        this.barSize = Math.floor(5 * this.game.ratio);
        this.frameY = 0;
        this.charging = false;
        this.survivorDirection = "right";
        this.health = 50;
        this.maxHealth = 50;
        this.isImmune = false;
        this.isDead = false;
        this.isJetPackPresent = false;
    }
    startCharge() 
    {  
        if(this.energy >= this.minenergy && !this.charging)
        {
            this.wingsCharge();
            this.charging = true;
            if(this.game.background.shouldMove == "false")
                {
                    this.speedX = this.maxSpeedX;
                    this.game.backgroundSpeed = 0;
                }
                else
                {
                    this.game.backgroundSpeed = this.game.maxBackgroundSpeed;
                    this.speedX = 0;
                }
            this.game.sound.play(this.game.sound.charge);
        }
        else
        {
            this.stopCharge();
        }
    }
    stopCharge()
    {   this.charging = false;
        if(this.game.background.shouldMove == "false")
            {
                this.speedX = this.minSpeedX;
                this.game.backgroundSpeed = 0;   // maybe issue on this line okay
            }
            else
            {
                this.game.backgroundSpeed = this.game.minBackgroundSpeed;
                this.speedX = 0;
            }
    }
    runLeft()
    {   if(this.game.background.shouldMove == "right")
        {
            this.stop();
            // this.changeSurvivorState(this.survivorState);
        }
        if(this.x <= 0)
        {
            console.log("left");
            this.speedX = 0;
            this.game.background.shouldMove = "left";
            this.survivorDirection = "left"
            this.isRunning = false;
            this.image = this.SurvivorSpriteAnimations[this.survivorState].Image2;
        }
        else{
            this.speedX = -5 * this.game.ratio; 
            this.isRunning = true;
            this.survivorDirection = "left";
            this.image = this.SurvivorSpriteAnimations[this.survivorState].Image2;
        }
       
    }
    runRight()
    {   if(this.game.background.shouldMove == "left")
        {
            this.stop();
            // this.changeSurvivorState(this.survivorState);
        }
        if(this.x >= this.game.width / 2)
        {
            console.log("right");
            this.speedX = 0;
            this.game.background.shouldMove = "right";
            this.isRunning = false;
            this.survivorDirection = "right";
            this.image = this.SurvivorSpriteAnimations[this.survivorState].Image;
        }
        else{
            this.speedX = 5 * this.game.ratio;
            this.isRunning = true;
            this.survivorDirection = "right";
            this.image = this.SurvivorSpriteAnimations[this.survivorState].Image;
        }
        
    }
    stop()
    {
        this.game.background.shouldMove = "false";
        this.speedX = 0;
        this.isRunning = false;
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
    isTouchingMiddle()
    {
        if(this.y <= this.game.height - this.height * 1.15 - this.game.bottomMargin)
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
    healthPack()
    {
         if(this.health < this.maxHealth)
            {
                this.health = this.maxHealth;
            }
    }
    immunity(){
        this.isImmune = true;
        setTimeout(()=>{
            this.isImmune = false;
        },60000);
    }
    jump()
    {   this.stopCharge();
        if(this.isTouchingTop()==false && this.isJetPackPresent == true)
        {   this.game.sound.play(this.game.sound.jump1);
            this.speedY = -this.jumpSpeed;
            this.wingsDown();
        }
        else if(this.isTouchingTop()==false && this.isTouchingMiddle()==false)
            {
                this.game.sound.play(this.game.sound.jump1);
                this.speedY = -this.jumpSpeed;
                this.wingsDown();
            }
    }
    isSurvivorDead()
    {
        if(this.health <= 0 && this.isDead == false)
            {
                this.isDead = true;
                this.changeSurvivorState("dead");
            }
    }



    // Attacking
    startAttack()
    {
         if(this.game.weapons.selectedWeapon == 2)
            {
                this.changeSurvivorState("attack");
                this.game.weapons.startAttack();
            }
         else {
            this.changeSurvivorState("throw");
            this.game.weapons.startAttack();
         }
         
    }
    stopAttack()
    {
        this.changeSurvivorState("run");
        this.game.weapons.stopAttack();
    }
}

// finishing touches part left from the tutorial
// issue : background not moving by itself at edge points
// issue : synchronization of movements
class Background{
    constructor(game)
    {
        this.game = game;
        this.backgroundImage = document.getElementById("background");
        this.width = 2400; // these values which we use here should exactly match the dimensions of the background image
        this.height = this.game.baseHeight;
        this.scaledWidth;
        this.scaledHeight;
        this.shouldMove;
        this.x;
    }
    update()
    {   if(this.shouldMove == "right")
        {
            this.x -= this.game.backgroundSpeed;
        }
        else if(this.shouldMove == "left")
        {
            this.x += this.game.backgroundSpeed;
        }
        else if(this.shouldMove == "false")
            {
                this.x += 0;
            }
        if(this.x <= -this.scaledWidth)
            {
                this.x = 0;
            }
        else if(this.x >= this.scaledWidth)
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
                this.game.context.drawImage(this.backgroundImage,this.x - this.scaledWidth*3 + 3,0,this.scaledWidth,this.scaledHeight);
            }

        this.game.context.drawImage(this.backgroundImage,this.x - this.scaledWidth + 1,0,this.scaledWidth,this.scaledHeight);
        this.game.context.drawImage(this.backgroundImage,this.x - this.scaledWidth*2 + 2,0,this.scaledWidth,this.scaledHeight);
    }
    resize()
    {   this.scaledWidth = this.width * this.game.ratio;
        this.scaledHeight =  this.height * this.game.ratio;
        this.x = 0;
        this.shouldMove = "false"
    }
}

class Obstacle{
    constructor(game,x)
    {
        this.game = game;
        this.spriteWidth = 200;
        this.spriteHeight = 200;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.collisionX;
        this.collisionY;
        this.collisionRadius = this.scaledWidth * 0.5;
        this.x = x;
        this.y = Math.random() * (this.game.height - this.scaledHeight - this.game.zombies[0].scaledHeight) ; // this.scaledHeight * 0.5
        this.speedY = Math.random()>0.5 ? 1 : -1;
        this.speedY *= this.game.ratio;
        this.markedToRemove = false;
        this.image = document.getElementById("obstacle");
        this.frameY = Math.floor(Math.random()*4);
        this.flyheight;
    }
    update()
    {  this.y += this.speedY;
        if(this.game.eventUpdate == true)
            {
                this.frameY = (this.frameY+1)%4;
            }
        if(this.game.survivor.charging == true && this.game.background.shouldMove == "false")
            {
                 this.x += 0;
            }
        else 
        {
            this.x -= this.game.backgroundSpeed + 1;
        }
       if(this.game.zombies.length > 0)
        {
            this.flyheight = this.game.zombies[0].scaledHeight;
        }
       else {
        this.flyheight = this.game.survivor.height;
       }
       this.collisionX = this.x + this.scaledWidth * 0.5;
       this.collisionY = this.y + this.scaledHeight * 0.5;
       if(this.y <=0 || this.y >= this.game.height - this.scaledHeight - this.flyheight)
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
                // console.log(this.game.obstacles);
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
       this.game.context.drawImage(this.image,0,this.frameY * this.spriteHeight,this.spriteWidth,this.spriteHeight,this.x,this.y,this.scaledWidth,this.scaledHeight)
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

class Zombie{
    constructor(game,x,ZombieType)
    {
        this.game = game;
        this.spriteWidth ;
        this.spriteHeight ;
        this.isDead = false;



        this.zombieStatusArray1 ={
            "walk" : [0,183,412,644,835,1029,1230],
            "attack" : [1230,1475,1718,1935,2151,2378,2565],
            "dead" : [2565,2753,2992,3304,3684,4058,4460,4909,5357],
            "jump" : [5357,5535,5748,5951,6162,6359,6535,6725]
        }
        this.zombieStatusArray2 ={
            "walk" : this.zombieStatusArray1["walk"].map((val)=>{
                return (6725-val);
            }),
            "attack" : this.zombieStatusArray1["attack"].map((val)=>{
                return (6725-val);
            }),
            "dead" : this.zombieStatusArray1["dead"].map((val)=>{
                return (6725-val);
            }),
            "jump" : this.zombieStatusArray1["jump"].map((val)=>{
                return (6725-val);
            }),
        }


        this.zombieSpriteAnimations = {
            "idle" : {
                 Image : document.getElementById("zombie_idle"),
                 spriteHeight : 367,
                 loc:[
                    {x: 0,y:0 ,spriteWidth:207},
                    {x: 207,y:0 ,spriteWidth:210},
                    {x: 417,y:0 ,spriteWidth:215},
                    {x: 632,y:0 ,spriteWidth:219},
                     ]
                     },
             "attack" : {
                Image : document.getElementById("zombie_attack"),
                 spriteHeight : 353,
                 loc:[
                    {x: 0,y:0 , spriteWidth:245},
                    {x: 245,y:0 , spriteWidth:243},
                    {x: 488,y:0 , spriteWidth:217},
                    {x: 705,y:0 , spriteWidth:216},
                    {x: 921,y:0 , spriteWidth:228},
                    {x: 1149,y:0 , spriteWidth:189}
                     ]
                     },
             "dead" : {
                Image : document.getElementById("zombie_dead"),
                 spriteHeight : 354,
                 loc:[
                    {x: 0,y: 0, spriteWidth:177},
                    {x: 177,y: 0, spriteWidth:224},
                    {x: 401,y: 0, spriteWidth:307},
                    {x: 708,y: 0, spriteWidth:374},
                    {x: 1082,y: 0, spriteWidth:358},
                    {x: 1440,y: 0, spriteWidth:393},
                    {x: 1833,y: 0, spriteWidth:432},
                    {x: 2265,y: 0, spriteWidth:447},
                     ]
                     },
             "jump" : {
                Image : document.getElementById("zombie_jump"),
                spriteHeight : 431,
                 loc:[
                    {x: 0,y:0 ,spriteWidth :174},
                    {x: 174,y:0 ,spriteWidth :206},
                    {x: 380,y:0 ,spriteWidth :196},
                    {x: 576,y:0 ,spriteWidth :205},
                    {x: 781,y:0 ,spriteWidth :189},
                    {x: 970,y:0 ,spriteWidth :175},
                    {x: 1145,y:0 ,spriteWidth :184},
                     ]
                     },
             "run" : {
                 Image : document.getElementById("zombie_run"),
                 spriteHeight : 369,
                 loc:[
                    {x: 0,y: 0, spriteWidth :162},
                    {x: 162,y: 0, spriteWidth :204},
                    {x: 366,y: 0, spriteWidth :220},
                    {x: 586,y: 0, spriteWidth :239},
                    {x: 825,y: 0, spriteWidth :235},
                    {x: 1060,y: 0, spriteWidth :296},
                    {x: 1356,y: 0, spriteWidth :333},
                    {x: 1689,y: 0, spriteWidth :294},
                    {x: 1983,y: 0, spriteWidth :246},
                    {x: 2229,y: 0, spriteWidth :274},
                     ]
                     },
             "walk" : {
                 Image : document.getElementById("zombie_walk"),
                 spriteHeight : 378,
                 loc:[
                    {x: 0,y:0,spriteWidth : 163 },
                    {x: 163,y:0,spriteWidth : 188 },
                    {x: 351,y:0,spriteWidth : 180 },
                    {x: 531,y:0,spriteWidth : 192 },
                    {x: 730,y:0,spriteWidth : 194 },
                    {x: 924,y:0,spriteWidth : 195 },
                     ]
                     }
                    }




        this.zombieSpriteAnimations2 = {
            "idle" : {
                Image : document.getElementById("zombie_idle2"),
                spriteHeight : 367,
                loc:[
                    {x: 851,y:0 ,spriteWidth:-207},
                    {x: 644,y:0 ,spriteWidth:-210},
                    {x: 434,y:0 ,spriteWidth:-215},
                    {x: 219,y:0 ,spriteWidth:-219},
                    ]
                    },
            "attack" : {
                Image : document.getElementById("zombie_attack2"),
                spriteHeight : 353,
                loc:[
                    {x: 1338,y:0 , spriteWidth:-245},
                    {x: 1093,y:0 , spriteWidth:-243},
                    {x: 850,y:0 , spriteWidth:-217},
                    {x: 633,y:0 , spriteWidth:-216},
                    {x: 417,y:0 , spriteWidth:-228},
                    {x: 189,y:0 , spriteWidth:-189}
                        ]
                        },
                "dead" : {
                    Image : document.getElementById("zombie_dead2"),
                    spriteHeight : 354,
                    loc:[
                    {x: 2712,y: 0, spriteWidth:-177},
                    {x: 2535,y: 0, spriteWidth:-224},
                    {x: 2311,y: 0, spriteWidth:-307},
                    {x: 2004,y: 0, spriteWidth:-374},
                    {x: 1630,y: 0, spriteWidth:-358},
                    {x: 1272,y: 0, spriteWidth:-393},
                    {x: 879,y: 0, spriteWidth:-432},
                    {x: 447,y: 0, spriteWidth:-447},
                        ]
                        },
                "jump" : {
                    Image : document.getElementById("zombie_jump2"),
                    spriteHeight : 431,
                    loc:[
                    {x: 1329,y:0 ,spriteWidth :-174},
                    {x: 1155,y:0 ,spriteWidth :-206},
                    {x: 949,y:0 ,spriteWidth :-196},
                    {x: 753,y:0 ,spriteWidth :-205},
                    {x: 548,y:0 ,spriteWidth :-189},
                    {x: 359,y:0 ,spriteWidth :-175},
                    {x: 184,y:0 ,spriteWidth :-184},
                        ]
                        },
                "run" : {
                    Image : document.getElementById("zombie_run2"),
                    spriteHeight : 369,
                    loc:[
                    {x: 2503,y: 0, spriteWidth :-162},
                    {x: 2341,y: 0, spriteWidth :-204},
                    {x: 2137,y: 0, spriteWidth :-220},
                    {x: 1917,y: 0, spriteWidth :-239},
                    {x: 1678,y: 0, spriteWidth :-235},
                    {x: 1443,y: 0, spriteWidth :-250},
                    {x: 1200,y: 0, spriteWidth :-280},
                    {x: 924,y: 0, spriteWidth :-294},
                    {x: 630,y: 0, spriteWidth :-296},
                     {x: 314,y: 0, spriteWidth :-314},
                        ]
                        },
                "walk" : {
                    Image : document.getElementById("zombie_walk2"),
                    spriteHeight : 378,
                    loc:[
                    {x: 1119,y:0,spriteWidth : -163 },
                    {x: 956,y:0,spriteWidth : -188 },
                    {x: 758,y:0,spriteWidth : -180 },
                    {x: 588,y:0,spriteWidth : -192 },
                    {x: 396,y:0,spriteWidth : -194 },
                    {x: 202,y:0,spriteWidth : -195 },
                        ]
                        }
                    }



        this.zombieStatus = "walk";
        this.spriteHeight = this.zombieSpriteAnimations[this.zombieStatus].spriteHeight;
        this.spriteWidth = this.zombieSpriteAnimations[this.zombieStatus].loc[0].spriteWidth;
        this.scaledWidth = this.spriteWidth * this.game.ratio * 0.7;
        this.scaledHeight = this.spriteHeight * this.game.ratio * 0.7;
        this.x = x;
        this.y = (this.game.height - this.scaledHeight - this.game.bottomMargin) ; 
        this.collisionX = this.x ;
        this.collisionY = this.y ;
        this.collisionWidth = this.scaledWidth;
        this.collisionHeight = this.scaledHeight;
        this.speedY = 0;
        this.jumpSpeed = 0;
        this.speedX = (this.x < this.game.survivor.x)? +2 : -2;
        // this.speedY *= this.game.ratio;
        this.markedToRemove = false;
        this.image = (this.x < this.game.survivor.x)?document.getElementById("zombie_walk"):document.getElementById("zombie_walk2");
        this.frameX = 0; //Math.floor(Math.random()*4);
        this.frameStartX = 0;
        this.zombieDirection = (this.x < this.game.survivor.x)?"right":"left";
        this.isJumping = false;
        this.isStopped = false;
        this.canBeAttackedbySword = false;
    }   
    changeZombieStatus(status){
          if(this.zombieDirection == "left")
           {
                this.zombieStatus = status;
                this.image = this.zombieSpriteAnimations2[this.zombieStatus].Image;
                this.frameX=0;
                this.frameStartX = this.zombieSpriteAnimations2[this.zombieStatus].loc[this.frameX].x;
                this.spriteWidth = this.zombieSpriteAnimations2[this.zombieStatus].loc[this.frameX].spriteWidth ;
                this.spriteHeight = this.zombieSpriteAnimations2[this.zombieStatus].spriteHeight;
             }
        else if(this.zombieDirection == "right")
            {
                this.zombieStatus = status;
                this.image = this.zombieSpriteAnimations[this.zombieStatus].Image;
                this.frameX=0;
                this.frameStartX = this.zombieSpriteAnimations[this.zombieStatus].loc[this.frameX].x;
                this.spriteWidth = this.zombieSpriteAnimations[this.zombieStatus].loc[this.frameX].spriteWidth ;
                this.spriteHeight = this.zombieSpriteAnimations[this.zombieStatus].spriteHeight;
             }
     }
    update()
    {
        this.y += this.speedY;
        if(this.isTouchingBottom()==false )
            {
                this.speedY += this.game.gravity;
            }
        else
        {
            this.speedY = 0;
        }
        if(this.isTouchingBottom()==true)
            {
                this.y = this.game.height - this.scaledHeight - this.game.bottomMargin;
                
            }
        if(this.game.eventUpdate == true)
            {   if(this.zombieDirection == "left")
                {
                    let l = this.zombieSpriteAnimations2[this.zombieStatus].loc.length;
                    this.frameX = (this.frameX+1)%(l);
                    this.spriteHeight = this.zombieSpriteAnimations2[this.zombieStatus].spriteHeight;
                    this.frameStartX = this.zombieSpriteAnimations2[this.zombieStatus].loc[this.frameX].x;
                    this.spriteWidth = this.zombieSpriteAnimations2[this.zombieStatus].loc[this.frameX].spriteWidth; 
                    if(this.zombieStatus == "dead")
                        {
                            this.scaledWidth = this.spriteWidth * this.game.ratio * 0.7;
                            this.scaledHeight = this.spriteHeight * this.game.ratio * 0.7;
                            this.collisionHeight = this.scaledHeight;
                            this.collisionWidth = this.scaledWidth;
                            this.collisionX = this.x;
                            this.collisionY = this.y;
                            if(this.frameX == 7)
                                {
                                    this.isDead = true;
                                }
                        }
                }
                else if(this.zombieDirection == "right")
                    {
                        let l = this.zombieSpriteAnimations[this.zombieStatus].loc.length;
                        this.frameX = (this.frameX+1)%(l);
                        this.spriteHeight = this.zombieSpriteAnimations[this.zombieStatus].spriteHeight;
                        this.frameStartX = this.zombieSpriteAnimations[this.zombieStatus].loc[this.frameX].x;
                        this.spriteWidth = this.zombieSpriteAnimations[this.zombieStatus].loc[this.frameX].spriteWidth; 
                        
                        if(this.zombieStatus == "dead")
                            {
                                this.scaledWidth = this.spriteWidth * this.game.ratio * 0.7;
                                this.scaledHeight = this.spriteHeight * this.game.ratio * 0.7;
                                this.collisionHeight = this.scaledHeight;
                                this.collisionWidth = this.scaledWidth;
                                this.collisionX = this.x;
                                this.collisionY = this.y;

                                if(this.frameX == 7)
                                    {
                                        this.isDead = true;
                                    }
                            }
                    }
                // console.log("hello");
            }

        if((this.game.survivor.charging == true && this.game.background.shouldMove == "false")||this.isStopped == true)
            {
                 this.x += 0;
            }
        else 
        {
            // this.x += (this.x < this.game.survivor.x-this.scaledWidth)? this.game.backgroundSpeed:-this.game.backgroundSpeed;
            if(this.x >= this.game.survivor.x + this.game.survivor.width)
                {
                    this.x -= this.game.backgroundSpeed + 1;
                    if(this.zombieDirection!="left")
                        {
                            // this.image = document.getElementById("zombie_walk2"); 
                            this.zombieDirection = "left"
                        }
                }
            else if(this.x <= this.game.survivor.x-this.scaledWidth)
                {
                    this.x += this.game.backgroundSpeed;
                    if(this.zombieDirection!="right")
                        {
                            // this.image = document.getElementById("zombie_walk"); 
                            this.zombieDirection = "right"
                        }
                }
            // else {
            //     this.x += 0;
            // }
        }


        if(this.isDead)
            {
                this.isDead = true;
                this.game.zombies = this.game.zombies.filter((zombie)=>{
                    if(zombie.isDead == false)
                        {
                            return true;
                        }
                    else
                    {
                        return false;
                    }
                })
             this.game.score++;
            }


        let j = this.game.checkCollisionWithDefenseBlock(this);
            if(j)
            {   this.changeZombieStatus("run")
                this.jumpSpeed = 7*this.game.ratio;
                this.jump();
            }
        this.collisionX = this.x;
        this.collisionY = this.y;

        if(this.game.ZombieHitsSurvivor(this) == true)
            {   this.canBeAttackedbySword = true;
                this.game.survivor.collided = true;
                this.game.survivor.stopCharge();
                // this.game.triggerGameOver();
                if(this.game.survivor.isImmune == false)
                    {  
                       this.isSuckingBlood = true;
                    }
                    else{
                        this.isSuckingBlood = false;
                    }
            }
        else{
            this.isSuckingBlood = false;
            this.canBeAttackedbySword = false;
        }
        
             
        if(this.game.ZombieHitsAutomatedDefences(this)==true)
            {   console.log("zombie dead" + this.game.zombies.length)
                this.isDead = true;  
            }

        this.handleSurvivorHealth();
    }
    handleSurvivorHealth()
    {
        if(this.game.eventUpdate == true) // was working well when it was not there also with earlier values
      {
            if(this.isSuckingBlood == true && this.game.survivor.isDead == false)
                {
                    this.game.survivor.health -= 0.7;  // 0.1
                    if(this.game.survivor.health <= 0)
                        {
                            this.energy = 0;
                            this.game.survivor.isSurvivorDead();
                        }
                }
       }
    }
    jump()
    {
        if(this.isTouchingTop()==false)
        {   console.log("jumping")
            this.speedY = -this.jumpSpeed;
        } 
    }
    isTouchingBottom()
    {
        if(this.y >= this.game.height - this.scaledHeight - this.game.bottomMargin)
            {
                return true;
            }
            else
            {
                return false;
            } 
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
    draw()
    {
       this.game.context.beginPath();
       this.game.context.drawImage(this.image,this.frameStartX,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.scaledWidth,this.scaledHeight);
       this.game.context.rect(this.collisionX,this.collisionY,this.collisionWidth,this.collisionHeight);
       this.game.context.stroke();
    }
    resize()
    {
        this.scaledWidth = this.spriteWidth * this.game.ratio * 0.7;
        this.scaledHeight = this.spriteHeight * this.game.ratio * 0.7;
        this.collisionHeight = this.scaledHeight;
        this.collisionWidth = this.scaledWidth;
        this.collisionX = this.x;
        this.collisionY = this.y;
        this.speedY = 0;
        this.isJumping = false;
        this.isStopped = false;
        this.isDead = false;
        this.canBeAttackedbySword = false;
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

class Weapon{
    constructor(game)
    {
         this.WeaponArray = [{
                                "weaponName" : "Grenade",
                                "Image" : document.getElementById("Grenade"),
                                "damage" : 5,
                                "spriteWidth" : 1,
                                "spriteHeight" : 2,
                                "spriteX" : 3,
                                "velocity" : 12
                             },{
                                 "weaponName" : "Kunai",
                                 "Image" : document.getElementById("Kunai"),
                                 "damage" : 5,
                                 "spriteWidth" : 1,
                                 "spriteHeight" : 2,
                                 "spriteX" : 3,
                                 "velocity" : 12
                               },
                            {
                                "weaponName" : "Sword",
                                "Image" : document.getElementById("Sword"),
                                "damage" : 5,
                                "spriteWidth" : 1,
                                "spriteHeight" : 2,
                                "spriteX" : 3,
                                "velocity" : 0
                            },{
                                "weaponName" : "ShotGun",
                                "Image" : document.getElementById("ShotGun"),  // image needs to be changed very much
                                "damage" : 5,
                                "spriteWidth" : 1,
                                "spriteHeight" : 2,
                                "spriteX" : 3,
                                "velocity" : 20
                            },{
                                "weaponName" : "MachineGun",
                                "Image" : document.getElementById("MachineGun"),  // MachineGun // Image needs to be changed very much
                                "damage" : 5,
                                "spriteWidth" : 1,
                                "spriteHeight" : 2,
                                "spriteX" : 3,
                                "velocity" : 20
                            }]
        this.game = game;
        this.spriteHeight = 50;
        this.spriteWidth = 50;
        this.scaledWidth = this.spriteWidth * this.game.ratio ;
        this.scaledHeight = this.spriteHeight * this.game.ratio ;
        this.x = this.game.survivor.x + this.game.survivor.scaledWidth*0.5;
        this.y = (this.game.height - this.game.survivor.scaledHeight * 0.7 - this.game.bottomMargin) ; 
        this.speedY = this.game.survivor.speedY;
        this.speedX = this.game.survivor.speedX;
        this.image = this.WeaponArray[1]["Image"];
        this.frameX = 0; 
        this.frameStartX = 0;
        this.WeaponDirection;
        this.mousePosition = {
            x : 0,
            y : 0
        }
        this.startX;
        this.startY;
        this.dirX;
        this.dirY;
        this.angle;

        this.velocity ;
        this.velX ;
        this.velY ;
        this.time ;
        this.Xpos ;
        this.Ypos ;

        this.isWeaponListShown = false;
        this.weaponIcon = document.getElementById("weaponIcon");
        this.isListMoving = false;
        this.selectedWeapon = 2; // index for the sword as the default weapon
        this.canFire = false;
    }
    resize()
    {   this.isWeaponListShown = false;
        this.speedX = this.game.survivor.speedX;
        this.speedY = this.game.survivor.speedY;
        this.x = this.game.survivor.x + this.game.survivor.scaledWidth*0.5;
        this.y = (this.game.height - this.game.survivor.scaledHeight * 0.7 - this.game.bottomMargin) ; 
        this.scaledWidth = this.spriteWidth * this.game.ratio ;
        this.scaledHeight = this.spriteHeight * this.game.ratio ;
        this.canFire = false;


        this.mousePosition = {
            x : 0,
            y : 0
        }
    }
    update()
    {
        //  this.game.ammunition.selectedWeapon = this.selectedWeapon;
    }
    startAttack()
    {
        let weaponname = this.WeaponArray[this.selectedWeapon]["weaponName"];
        if(weaponname == "Grenade")
            {   
                this.drawPath(weaponname,this.selectedWeapon)
            } 
        else if(weaponname == "Kunai")
            {
                this.drawPath(weaponname,this.selectedWeapon);
            }
        else if(weaponname == "Sword")
            { 
                this.checkAttackBySword();
            }
        else if(weaponname == "ShotGun")
            {
                this.drawPath(weaponname,this.selectedWeapon);
            }
        else if(weaponname == "MachineGun")
            {
                this.drawPath(weaponname,this.selectedWeapon);
            }
    }
    stopAttack()
    {

    }
    checkAttackBySword()
    {
        this.game.zombies.forEach((zombie)=>{
            console.log(zombie.canBeAttackedbySword)
            if(zombie.canBeAttackedbySword==true)
                {
                    if(zombie.x > this.game.survivor.x && this.game.survivor.survivorDirection == "right")
                        {
                            zombie.isDead = true;
                            console.log("zombie dead")
                        }
                    else if(zombie.x < this.game.survivor.x && this.game.survivor.survivorDirection == "left")
                        {
                            zombie.isDead = true;
                        }
                        else
                        {
                            console.log("kuch bhi")
                        }
                }
        })
    }
    drawPath(weaponname,selectedWeapon)
    {   if(weaponname == "Sword")
        {
            return;
        }
        console.log("hello drawPath")
        this.startX =  this.game.survivor.x + this.game.survivor.width; // this.game.survivor.collisionX;
        this.startY = this.game.survivor.y + this.game.survivor.height * 0.5; // this.game.survivor.collisionY;
        // this.game.context.translate(startX,startY);
        // console.log(startX + "     "+startY);
        this.dirX = this.mousePosition.x;
        this.dirY = this.mousePosition.y;
        this.angle = Math.atan2(this.dirY - this.startY,this.dirX - this.startX);
        if(this.angle<0)
            {
                this.angle = -this.angle;
            }
        else if(this.angle>0)
            {
                this.angle = (360 - this.angle);
            }
        this.velocity = this.WeaponArray[selectedWeapon]["velocity"];
        this.velX = this.velocity * Math.cos(this.angle);
        this.velY = this.velocity * Math.sin(this.angle);
        this.time = this.velY/this.game.gravity;
        this.Xpos = this.startX + this.time*this.velX;
        this.Ypos = this.startY - (this.velY*this.velY)/(2*this.game.gravity);
        
        }
        
    draw()
    {   
        // if(this.game.survivor.isSurvivorAttacking == true)
        // {
        //     this.drawPath(this.WeaponArray[this.selectedWeapon]["weaponName"]);
        // }
        
        if(this.game.isSurvivorAttacking == true)
            {
        this.game.context.setLineDash([5,3]);
        this.game.context.strokeStyle = "red";
        this.game.context.beginPath();
        this.game.context.moveTo(this.startX,this.startY);
        this.game.context.quadraticCurveTo(this.Xpos,this.Ypos,this.startX+2*(this.Xpos - this.startX),this.startY);
        this.game.context.stroke();
        this.game.context.strokeStyle = "white";

        // firing 
        // something related to duration 
        if(this.canFire == true && this.game.eventUpdate == true)       // Not sure about this eventUpdate to be put here or not but it is helping me 
            {   
                console.log("firing ............"+ this.selectedWeapon);
                let newAmmunition = new Ammunition(this.game,this.velocity,this.velX,this.velY,this.angle,this.selectedWeapon,this.startX,this.startY);
                this.game.ammunitions.push(newAmmunition);
                
                 }
            }

        if(this.isWeaponListShown == false)
            {   let a = this.game.canvas.width * this.game.ratio;
                let b = this.game.canvas.height ;
                this.game.context.beginPath();
                this.game.context.moveTo(0,b * 0.4);
                this.game.context.bezierCurveTo(a*0.07,b*0.5,a*0.07,b*0.5,0,b*0.6);
                this.game.context.drawImage(this.weaponIcon,0,0,80,80,0,b*0.45,a*0.045,b*0.1)
                this.game.context.stroke();
            }
        else
            {   let a = this.game.canvas.width * this.game.ratio;
                let b = this.game.canvas.height;
                this.game.context.beginPath();
                this.game.context.roundRect(0,b*0.15,a*0.1,b*0.80,[10,10,10,10]);
                this.game.context.roundRect(a*0.005,b*0.15,a*0.09,b*0.80/5,[10,10,10,10]);
                this.game.context.drawImage(this.WeaponArray[0]["Image"],a*0.005 ,b*0.15,a*0.09 * 0.9,b*0.80/5 * 0.9);
                this.game.context.roundRect(a*0.005,b*0.15+b*0.80*1/5,a*0.09,b*0.80/5,[10,10,10,10]);
                this.game.context.drawImage(this.WeaponArray[1]["Image"],a*0.005 + a*0.09*0.3,b*0.15+b*0.80*1/5,a*0.09 * 0.4,b*0.80/5 * 0.9);
                this.game.context.roundRect(a*0.005,b*0.15+b*0.80*2/5,a*0.09,b*0.80/5,[10,10,10,10]);
                this.game.context.drawImage(this.WeaponArray[2]["Image"],a*0.005 ,b*0.15+b*0.80*2/5,a*0.09 ,b*0.80/5 * 0.9);
                this.game.context.roundRect(a*0.005,b*0.15+b*0.80*3/5,a*0.09,b*0.80/5,[10,10,10,10]);
                this.game.context.drawImage(this.WeaponArray[3]["Image"],a*0.005 ,b*0.15+b*0.80*3/5,a*0.09 ,b*0.80/5 * 0.9);
                this.game.context.roundRect(a*0.005,b*0.15+b*0.80*4/5,a*0.09,b*0.80/5,[10,10,10,10]);
                this.game.context.drawImage(this.WeaponArray[4]["Image"],a*0.005 ,b*0.15+b*0.80*4/5,a*0.09 ,b*0.80/5 * 0.9);
                this.game.context.stroke();
                this.game.context.beginPath();
                this.game.context.moveTo(a*0.1,b * 0.4);
                this.game.context.bezierCurveTo(a*0.1+a*0.07,b*0.5,a*0.1+a*0.07,b*0.5,a*0.1,b*0.6);
                this.game.context.drawImage(this.weaponIcon,0,0,80,80,a*0.1,b*0.45,a*0.045,b*0.1)
                this.game.context.stroke();
            }
    }
}

class Ammunition
{
    constructor(game,velocity,velX,velY,angle,selectedWeapon,startX,startY)
    {
        this.game = game;
        this.selectedWeapon = selectedWeapon;
        this.AmmunitionArray = [{
            "weaponName" : "Grenade",
            "ammunition" : "Grenade",
            "Image" : document.getElementById("Grenade"),
            "spriteWidth" : 2000,
            "spriteHeight" : 2000,
            "spriteX" : 1,
            "velocity" : 12
                               },{
            "weaponName" : "Kunai",
            "ammunition" : "Kunai",
            "Image" : document.getElementById("Kunai"),
            "spriteWidth" : 32,
            "spriteHeight" : 160,
            "spriteX" : 1,
            "velocity" : 12
                               },{
            "weaponName" : "Sword",
            "ammunition" : "Sword",
            // "Image" : document.getElementById("nn"),
            "spriteWidth" : 200,
            "spriteHeight" : 200,
            "spriteX" : 1,
            "velocity" : 0
                               },{
            "weaponName" : "ShotGun",
            "ammunition" : "Bullet",
            "Image" : document.getElementById("Bullet1"),
            "spriteWidth" : 300,
            "spriteHeight" : 300,
            "spriteX" : 1,
            "velocity" : 20
                               },{
            "weaponName" : "MachineGun",
            "ammunition" : "Bullet",
            "Image" : document.getElementById("Bullet2"),
            "spriteWidth" : 300,
            "spriteHeight" : 300,
            "spriteX" : 1,
            "velocity" : 20
                               },];
            this.collisionX = startX ;
            this.collisionY = startY ;
            this.angle = angle;
            this.spriteWidth = this.AmmunitionArray[this.selectedWeapon]["spriteWidth"];
            this.spriteHeight = this.AmmunitionArray[this.selectedWeapon]["spriteHeight"];
            this.scaledWidth = Math.min(this.spriteWidth * this.game.ratio,80);
            this.scaledHeight = Math.min(this.spriteHeight * this.game.ratio,80);
            // this.collisionRadius = this.AmmunitionArray[this.selectedWeapon]["spriteWidth"]*0.5 ;
            this.collisionRadius = this.scaledWidth * 0.5;
            this.x = this.collisionX - this.collisionRadius;
            this.y = this.collisionY - this.collisionRadius;
            this.velocity = velocity;
            this.velocityX = velX ;
            this.velocityY = velY ;
            this.isAmmunitionMoving = false;
            this.isMarkedToRemove = false;
            this.image = this.AmmunitionArray[this.selectedWeapon]["Image"];
    }
    // updateVelocity(weaponname,selectedWeapon)
    // {   if(this.isAmmunitionMoving == false)
    //     this.selectedWeapon = selectedWeapon;
    //         this.x;
    //         this.y;
    //         this.collisionX;
    //         this.collisionY;
    //         this.collisionRadius;
    //         this.velocity;
    //         this.velocityX;
    //         this.velocityY;
    // }
    update()
    {
        //  this.selectedWeapon = this.game.weapons.selectedWeapon;
        this.collisionX += this.velocityX ;
        this.collisionY -= this.velocityY ;
        this.x = this.collisionX - this.collisionRadius;
        this.y = this.collisionY - this.collisionRadius;
        this.velocityY -= this.game.gravity;
        if(this.isMarkedToRemove == true)
            {
                 
            } 
    }
    draw()
    {           
                if(this.selectedWeapon == 2)
                {
                return;
                }
                this.game.context.beginPath();
                this.game.context.strokeStyle = "green"
                this.game.context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, 2 * Math.PI);
                this.game.context.drawImage(this.image,0,0,this.spriteWidth,this.spriteHeight,this.x,this.y,this.scaledWidth,this.scaledHeight);
                this.game.context.stroke();
                this.game.context.strokeStyle = "white"
            
    }
    resize()
    { 
         this.isMarkedToRemove = false;
    } 
    isOffScreen()
    {
        if(this.collisionX + this.collisionRadius < 0 || this.collisionX - this.collisionRadius  > this.game.canvas.width || this.collisionY + this.collisionRadius < 0 || this.collisionY - this.collisionRadius > this.game.canvas.height)
            {
                return true;
            }
        else{
            return false;
        }
    }
}
class DefenseBlocks{
    constructor(game,x)
    {
        this.game = game ;
        this.width = 653;
        this.height = 653;
        this.scaledHeight = this.height * this.game.ratio * 0.25;
        this.scaledWidth = this.width * this.game.ratio * 0.25;
        this.x = x;
        this.y = (this.game.height - this.scaledHeight - this.game.bottomMargin);
        this.collisionX = this.x ;
        this.collisionY = this.y ;
        this.collisionWidth = this.scaledWidth;
        this.collisionHeight = this.scaledHeight; 
        this.speedY;
        this.speedX;
        this.markedToRemove;
        this.image = document.getElementById("wall");
        this.numberOfBlocks = Math.floor(Math.random()*2) + 1;
        this.orientationOption = [-1,1]; 
        this.orientation =  this.orientationOption[Math.floor(Math.random()*2) ];
    }
    update()
    {
        this.y += 0;
        if(this.game.background.shouldMove == "right")
            {
                this.x -= this.game.backgroundSpeed;
            }
            else if(this.game.background.shouldMove == "left")
            {
                this.x += this.game.backgroundSpeed;
            }
            else if(this.game.background.shouldMove == "false")
                {
                    this.x += 0;
                }
        this.collisionX = this.x;
        this.collisionY = this.y;
    }
    draw()
    {
        this.game.context.beginPath();
        this.game.context.drawImage(this.image,0,0,this.width,this.height,this.x,this.y,this.scaledWidth,this.scaledHeight);
        this.game.context.rect(this.x,this.y,this.scaledWidth,this.scaledHeight);
        this.game.context.stroke();
        if(this.numberOfBlocks == 2)
            {
                this.game.context.beginPath();
                this.game.context.drawImage(this.image,0,0,this.width,this.height,this.x+this.scaledWidth*0.5*this.orientation,this.y-this.scaledHeight,this.scaledWidth,this.scaledHeight);
                this.game.context.rect(this.x+this.scaledWidth*0.5*this.orientation,this.y-this.scaledHeight,this.scaledWidth,this.scaledHeight);
                this.game.context.stroke();
            }
    }
    resize()
    {
        this.scaledWidth = this.width * this.game.ratio * 0.25;
        this.scaledHeight = this.height * this.game.ratio * 0.25;
        this.collisionHeight = this.scaledHeight;
        this.collisionWidth = this.scaledWidth;
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

class TrapsAndMines{
    constructor(game,x,type)
    {
        this.TrapsAndMinesArray = [{  
            "defence" : "BearTrap",
            "spriteWidth" : 740,
            "spriteHeight" : 740,
            "Image" : document.getElementById("BearTrap"),
          },{
            "defence" : "LandMine",
            "spriteWidth" : 300,
            "spriteHeight" : 300,
            "Image" : document.getElementById("LandMine"),
          }]
        this.game = game;
        this.x = x;
        this.type = type;
        this.width = this.TrapsAndMinesArray[this.type]["spriteWidth"];
        this.height = this.TrapsAndMinesArray[this.type]["spriteWidth"];
        if(this.type == 1)
            {
                this.scaledHeight = this.height * this.game.ratio * 0.5 ;
                this.scaledWidth = this.width * this.game.ratio * 0.5 ;
            }
        else {
                this.scaledHeight = this.height * this.game.ratio * 0.25;
                this.scaledWidth = this.width * this.game.ratio * 0.25;
             }

    this.y = (this.game.height - this.scaledHeight - this.game.bottomMargin);
    this.collisionX = this.x + this.scaledWidth * 0.5;
    this.collisionY = this.y + this.scaledHeight * 0.5;
    this.collisionRadius = this.scaledWidth * 0.5;
    this.speedY;
    this.speedX;
    this.markedToRemove = false;
    this.image = this.TrapsAndMinesArray[this.type]["Image"];
    }
    update()
    {
        this.y += 0;
        if(this.game.background.shouldMove == "right")
            {
                this.x -= this.game.backgroundSpeed;
            }
            else if(this.game.background.shouldMove == "left")
            {
                this.x += this.game.backgroundSpeed;
            }
            else if(this.game.background.shouldMove == "false")
                {
                    this.x += 0;
                }

        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY = this.y + this.scaledHeight * 0.5;
    }
    draw()
    {
        this.game.context.beginPath();
        if(this.type == 0)
            {
                this.game.context.drawImage(this.image,this.x,this.y,this.scaledWidth,this.scaledHeight);
            }
        else if(this.type == 1)
            {
                this.game.context.drawImage(this.image,0,0,this.width,this.height,this.x,this.y,this.scaledWidth,this.scaledHeight);
            }
        // this.game.context.rect(this.x,this.y,this.scaledWidth,this.scaledHeight);
        this.game.context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,2 * Math.PI);
        this.game.context.stroke();
    }
    resize()
    {
        if(this.type == 1)
            {
                this.scaledHeight = this.height * this.game.ratio * 0.5 ;
                this.scaledWidth = this.width * this.game.ratio * 0.5 ;
            }
        else {
                this.scaledHeight = this.height * this.game.ratio * 0.25;
                this.scaledWidth = this.width * this.game.ratio * 0.25;
             }
        this.y = (this.game.height - this.scaledHeight - this.game.bottomMargin);
        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY = this.y + this.scaledHeight * 0.5;
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

class AutomatedDefences{
    constructor(game,x,type)
    {   // canonBall left 
        this.AutomatedDefencesArray = [{  
                                          "defence" : "canonGun",
                                          "spriteWidth" : 96,
                                          "spriteHeight" : 80,
                                          "Image" : document.getElementById("canonGun"),
                                        },{
                                          "defence" : "spikes",
                                          "spriteWidth" : 294,
                                          "spriteHeight" : 512,
                                          "Image" : document.getElementById("spikes"),
                                          "totalFrames" : 10,
                                        }]
                                        
        this.game = game;
        this.x = x;
        this.type = type;
        this.width = this.AutomatedDefencesArray[this.type]["spriteWidth"];
        this.height = this.AutomatedDefencesArray[this.type]["spriteHeight"];
        if(this.type == 1)
            {
                this.scaledHeight = this.height * this.game.ratio * 0.7 ;
                this.scaledWidth = this.width * this.game.ratio * 0.6 ;
            }
        else {
                this.scaledHeight = this.height * this.game.ratio * 2;
                this.scaledWidth = this.width * this.game.ratio * 2;
             }
        
        this.y = (this.game.height - this.scaledHeight - this.game.bottomMargin);
        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY = this.y + this.scaledHeight * 0.5;
        this.collisionRadius = this.scaledWidth * 0.5;

        if(this.type == 0)
            {
                this.collisionRadius *= 2.5;
            }

        this.speedY;
        this.speedX;
        this.markedToRemove = false;
        this.image = this.AutomatedDefencesArray[this.type]["Image"];
        this.frameX = 0;
    }
    update()
    {   
        this.y += 0;
        if(this.game.background.shouldMove == "right")
            {
                this.x -= this.game.backgroundSpeed;
            }
            else if(this.game.background.shouldMove == "left")
            {
                this.x += this.game.backgroundSpeed;
            }
            else if(this.game.background.shouldMove == "false")
                {
                    this.x += 0;
                }

        if(this.type == 1 && this.game.eventUpdate == true)
            {
                this.frameX = (this.frameX+1)%this.AutomatedDefencesArray[1]["totalFrames"];
            }
        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY = this.y + this.scaledHeight * 0.5;
    }
    draw()
    {   this.game.context.beginPath();
        if(this.type == 1)
        {
            this.game.context.drawImage(this.image,this.frameX*this.width,0,this.width,this.height,this.x,this.y,this.scaledWidth,this.scaledHeight);
        }
        else if(this.type == 0)
            {
                this.game.context.drawImage(this.image,0,0,this.width,this.height,this.x,this.y,this.scaledWidth,this.scaledHeight);
            }
        
        // this.game.context.rect(this.x,this.y,this.scaledWidth,this.scaledHeight);
        this.game.context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,2 * Math.PI);
        this.game.context.stroke();
        
    }
    resize()
    {
        if(this.type == 1)
            {
                this.scaledHeight = this.height * this.game.ratio * 0.9 ;
                this.scaledWidth = this.width * this.game.ratio * 0.6 ;
            }
        else {
                this.scaledHeight = this.height * this.game.ratio * 2;
                this.scaledWidth = this.width * this.game.ratio * 2;
             }
        
        this.y = (this.game.height - this.scaledHeight - this.game.bottomMargin);
        this.collisionX = this.x + this.scaledWidth * 0.5;
        this.collisionY = this.y + this.scaledHeight * 0.5;
        this.collisionRadius = this.scaledWidth * 0.5;
        
        if(this.type == 1)
            {
                this.collisionRadius *= 2.5;
            }
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
        this.jump1 = document.getElementById('jump1');
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
        if(game.isPaused == false)
            {
                requestAnimationFrame(animate);
            }
        //    }
    }
    this.requestAnimationFrame(animate);
})






// Power-Up ideas
// Speed Boost: Temporarily increases the runner’s speed to escape zombies faster.
// Health Pack: Restores a portion of the runner’s health if injured.
// Shield: Provides temporary invincibility from zombie attacks.
