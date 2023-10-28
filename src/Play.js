//Midterm for ASTRG 6 on canvas
class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
        this.direction = 1;
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    //hole in
    //improve logic pointer relative to x
    //
    create() {
        // add background grass
        //this.gameOver = false;

        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width/2, height/10, 'cup');
        this.cup.body.setCircle(this.cup.width/4);
        this.cup.body.setOffset(this.cup.width/4);
        this.cup.body.setImmovable(true);

        this.ball = this.physics.add.sprite(width/2, height - height/10, 'ball');
        this.ball.body.setCircle(this.ball.width/2);
        this.ball.body.setCollideWorldBounds(true);
        this.ball.body.setBounce(0.5);
        this.ball.body.setDamping(true).setDrag(0.5);

        // add walls
        let wallA = this.physics.add.sprite(0, height/4, 'wall');
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2));
        
        wallA.body.setImmovable(true);
        this.wallerA = wallA;
        this.wallerA.body.setCollideWorldBounds(true);
        this.wallerAmovement = 100;
        this.wallerA.body.setVelocityX(this.wallerAmovement);
        this.time.addEvent({delay: 1000, callback: ()=>{
            //console.log(this.wallerA.x);
            if((this.wallerA.x == 545) || (this.wallerA.x == 95)){

                this.wallerAmovement *=-1;
                
                this.wallerA.body.setVelocityX(this.wallerAmovement);
                
            }
        }, loop: true});
        //this.wallerA.update();


        
        
        //score
        //from last project
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
            top: 20,
            bottom: 20,
            },
            fixedWidth: 140
        }
        let shotConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top:20,
                bottom: 20,
            },
            fixedWidth: 140

        }
        let shotpercentConfig = {
            fontFamily: 'Courier',
            fontSize:'28px',
            backgroundColor: '#F3B141',
            color:'#843605',
            align: 'left',
            padding: {
                top: 20,
                bottom: 20,
            },
            fixedWidth: 200
        }
        this.hole = 0;
        this.shotted = 0;
        this.percentage = 0;
        //is it golf score or not.  I rarely watch golf so I do not know.
        this.scored = this.add.text(width - width/1.00002, height - height/1.00002, "score: " +this.hole, scoreConfig);
        this.shotten = this.add.text(width-width/4, height - height/1.00002, "shots: "+ this.shotted, shotConfig);
        this.percented = this.add.text(width-width/1.7, height - height/1.00002, "shot%: " + this.percentage + "%", shotpercentConfig);



        //command to multiselect
        let wallB = this.physics.add.sprite(0, height/2, 'wall');
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2));
        wallB.body.setImmovable(true);

        this.walls = this.add.group([wallA, wallB]);

        //one way
        this.oneWay = this.physics.add.sprite(0, height/4 * 3, 'oneway');
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2));
        this.oneWay.body.setImmovable(true);
        this.oneWay.body.checkCollision.down = false;

        //
        // velocity works as intended if it is not right next the right.  diagnols are fine and TA said it was fine
        this.SHOT_VELOCITY_X_MIN = 400;
        this.SHOT_VELOCITY_X_MAX = 700;
        this.SHOT_VELOCITY_Y_MIN = 700;
        this.SHOT_VELOCITY_Y_MAX = 1100;

        this.input.on("pointerdown", (pointer)=>{
            this.shotted++;
            if(this.hole > 0){
                this.percentage = this.hole*100/this.shotted;
                this.percented.text = "shot%:" + this.percentage + "%";
            }
            this.shotten.text = "shot: "+ this.shotted;
            let shotDirection;
            let shotedDirection;
            pointer.x <= this.ball.x ? shotedDirection = 1 : shotedDirection = -1
            pointer.y <= this.ball.y ? shotDirection = 1 : shotDirection = -1 //left side is true : right is false
            this.ball.body.setVelocityX(Phaser.Math.Between(this.SHOT_VELOCITY_X_MIN, this.SHOT_VELOCITY_X_MAX)*shotedDirection);
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection);

            
        });
        this.physics.add.collider(this.ball, this.cup, (ball, cup)=> {
            this.hole++;
            if(this.hole > 0){
                this.percentage = Math.Round(this.hole*100/this.shotted)
                this.percented.text = "shot%:" + this.percentage + "%";
                
            }
            this.ball.setPosition(width/2, height - height/10);
            this.scored.text = "score: " + this.hole;
            //ball.destroy();

            // this.ball = this.physics.add.sprite(width/2, height - height/10, 'ball');
            // this.ball.body.setCircle(this.ball.width/2);
            // this.ball.body.setCollideWorldBounds(true);
            // this.ball.body.setBounce(0.5);
            // this.ball.body.setDamping(true).setDrag(0.5);
            
        });
        this.physics.add.collider(this.ball, this.walls);
        this.physics.add.collider(this.ball, this.oneWay);
    }

    update() {
        // console.log("here\n");
        // console.log(this.wallerA.x);

        // if((this.wallerA.x == 545) || (this.wallerA.x == 0)){

        //     this.wallerAmovement *=-1;
            
        //     this.wallerA.body.setVelocityX(this.wallerAmovement);
        // }

        // if(this.direction == 1){
        //     while(this.wallerA.x != width){
        //     this.wallerA.body.setVelocityX(200, 1);
        //     }
        //     this.direction = -1;
        // }
        // else{
        //     while(this.wallerA.x != 0){
        //         this.wallerA.body.setVelocityX(200, -1);
        //     }
        //     this.direction = 1;
        // }
        // if(this.direction == 1){
        //     this.walls.wallA.x-=3;
        // }
        // else{
        //     this.walls.wallA.x+=3;
        // }
        // while((this.wallA > 0)&&(this.wallA < 640)){
        //     if()
        //     this.wallA.x -= 3;

        // }
        // if(this)


    }
}