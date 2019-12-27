// //获取开始按钮注册事件
// let btnStart=document.querySelector(".startBtn button");
// btn
let sw=20; //小方块的宽
let sh=20;  //小方块的高
let rownum=30;  //行数
let colnum=30;   //列数

//将蛇身蛇头食物抽象为小方块 小方块的构造函数
function Square(x,y,classname) {
    this.x=sw*x;
    this.y=sh*y;
    this.classname=classname;
}
Square.prototype.create=function () {
    //根据不同的classname获取其父节点
    let parent=null;
    if(this.classname=="snakeHead" || this.classname=="snakeBody")
    {
        parent=document.getElementsByClassName("snakewrapper")[0];
    }
    else{
        parent=document.getElementById("wrapper");
    }
    //创建节点
    let square = document.createElement("div");
    square.className=this.classname;
    square.style.left=this.x+"px";
    square.style.top=this.y+"px";
    parent.appendChild(square);
    this.domEle=square;
}
//小方块的移动方法
Square.prototype.transfer=function(x,y){
    if(this.domEle){
        this.x=x*sw;
        this.y=y*sh;
        let ele=this.domEle;
        ele.style.left=x*sw+"px";
        ele.style.top=y*sh+"px";
    }
}
//蛇的构造函数
function Snake() {
    this.head=null;
    this.tail=null;
    this.bodyPos=[];
    this.directions={
        left:{
            x:-1,
            y:0
        },
        right:{
            x:1,
            y:0
        },
        up:{
            x:0,
            y:-1
        },
        down:{
            x:0,
            y:1
        }
    }
}
//初始化蛇
Snake.prototype.create=function () {
   this.head=new Square(2,0,"snakeHead");
   this.tail=new Square(0,0,"snakeBody");
   this.head.create();
   this.tail.create();
   let snakeBody1=new Square(1,0,"snakeBody");
   snakeBody1.create();
   this.nowDrection=this.directions.right;
   this.bodyPos.push([2,0],[1,0],[0,0]);
  
  //保存每个节点的前后引用
   this.head.pre=null;
   this.head.next=snakeBody1;
   snakeBody1.pre=this.head;
   snakeBody1.next=this.tail;
   this.tail.pre=snakeBody1;
   this.tail.next=null;
}
//蛇的移动方法，每一次移动让蛇头变成蛇身，蛇尾插入到原蛇头前方充当新蛇头，
Snake.prototype.move=function (x,y) { //x，y为前方坐标
    let tail=this.tail;
    let head=this.head;
    tail.transfer(x,y);
    tail.domEle.className="snakeHead";
    head.domEle.className="snakeBody";

    //更新指针
    this.tail=tail.pre;
    this.tail.next=null;
    tail.pre=null;
    tail.next=head;
    head.pre=tail;
    this.head=tail;

    //更新蛇的位置信息 将最后一位移除，把前方位置放到数组头
    this.bodyPos.pop();
    this.bodyPos.unshift([x,y]);
    
}
//蛇吃食物，在食物处创建新蛇头蛇头变为蛇身
Snake.prototype.eat=function(x,y){
    let newHead=new Square(x,y,"snakeHead");
    
    newHead.create();
    //更新指针指向
    this.head.pre=newHead;
    newHead.next=this.head;
    newHead.pre=null;
    
    //更改原蛇头样式
    this.head.domEle.className="snakeBody";
    this.head=newHead;
    //更新位置信息
    this.bodyPos.unshift([x,y]);
    
}
// Snake.prototype.getNextPos=function (foodx,foody) { //传入当前食物所在位置判断
//     let x,y;
//     x=this.bodyPos[0][0]+this.nowDrection.x;
//     y=this.bodyPos[0][1]+this.nowDrection.y;
    

//     //判断吃掉食物
//     if(x==foodx && y==foody)
//     {
        
//     }
//     //判断撞墙
//     if(x<0 || x>29 || y<0 || y>29)
//     {
//         //撞墙
//         return;
//     }
    
// }
function Game() {
    this.score=0,
    this.status="pending";
    this.snake=new Snake();
        this.snake.create();
        //创建食物
        let x,y;
        while(true)
        {
            x=Math.round(Math.random()*(rownum-1));
            y=Math.round(Math.random()*(colnum-1));
             let flag=this.snake.bodyPos.every(function (pos) {
                if(pos[0]!=x && pos[1]!=y){
                    return true;
                }
                else{
                    return false;
                }
            });
            if(flag){
                break;
            }
        }
        this.food=new Square(x,y,"food");
        this.food.create();
}





Game.prototype.getNextPos=function () {
    
    let snakeHead=this.snake.bodyPos[0];
    let nextX=snakeHead[0]+this.snake.nowDrection.x;
    let nextY=snakeHead[1]+this.snake.nowDrection.y;
    if(nextX<0||nextX>29 || nextY<0 ||nextY>29) //撞墙逻辑
    {
        this.gameover();
        return
    }
    if(nextX==this.food.x/20 && nextY==this.food.y/20){ //吃食物
        
        this.snake.eat(nextX,nextY);
        this.score++;
        //改变食物位置
        let x,y;
        while(true)
         {
            x=Math.round(Math.random()*(rownum-1));
            y=Math.round(Math.random()*(colnum-1));
            let flag=this.snake.bodyPos.every(function (pos) {
                if(pos[0]!=x && pos[1]!=y){
                    return true;
                    }
                else{
                     return false;
                 }
                });
            if(flag){
                break;
            }
         }
         this.food.transfer(x,y);   
        return;
    }
    let isOnBody=this.snake.bodyPos.some(function (pos){
        
        return nextX==pos[0]&&nextY==pos[1];    
    });
    if(isOnBody){  //撞到自己 调用gameover（）
        this.gameover();
        return;
    }
    //出去以上三种情况则为向前移动
    this.snake.move(nextX,nextY);
}



Game.prototype.gameover=function(){
    this.status="over";
    if(this.timer){
        clearInterval(this.timer)
    }
    alert("您的得分为："+this.score);
    let startBtn=document.getElementsByClassName("startBtn")[0];
    startBtn.style.display="block";
}




Game.prototype.pause=function()
{
    if(this.timer)
    {
        clearInterval(this.timer);
    }
   this.status= "paused";

}
Game.prototype.restart=function(){
    this.timer=setInterval(function(){game.getNextPos.call(game)},200);
    this.status="started";
}




// 注册键盘事件 并且设置定时器
Game.prototype.start=function()
{
    
    let snake=this.snake;
    document.onkeydown=function(e){
        e.preventDefault();
        //按下左键
        if(e.which==37 && snake.nowDrection!=snake.directions.right){
            
               snake.nowDrection=snake.directions.left;
        }else if(e.which==38 && snake.nowDrection!=snake.directions.down){ //按下上键
            snake.nowDrection=snake.directions.up;
        }else if(e.which==39&&snake.nowDrection!=snake.directions.left){ //按下右键
             snake.nowDrection=snake.directions.right;   
        }else if(e.which==40&& snake.nowDrection!=snake.directions.up){     //按下下键
            snake.nowDrection=snake.directions.down;
        }
    }
    this.timer=setInterval(function(){game.getNextPos.call(game)},200);
    this.status="started"
}
let game=null;
let buttons=document.getElementsByTagName("button");
let outter=document.getElementById("wrapper");
buttons[0].onclick=function(e){
    e.stopPropagation();
    document.getElementsByClassName("snakewrapper")[0].innerHTML="";
    if(game){
        game.food.domEle.remove();
    }
    game=new Game();
    game.start();
    this.parentElement.style.display="none";
}    
outter.onclick=function(){
    game.pause();
    buttons[1].parentElement.style.display="block";
    console.log(1);
}
buttons[1].onclick=function(e){
    e.stopPropagation();
    game.restart();
    buttons[1].parentElement.style.display="none";
}
