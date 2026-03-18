//import { createElement } from "react";

function main () {
    const $KOI = document.querySelector("#KOI");
    const $block = document.querySelector("#block");
    const $game = document.querySelector("#game");
    const acceleration = 1.2;
    const orgSpeed = 24;

    let speed = orgSpeed;
    let pos = 0;
    let animationKOI = null;
    let Start = 0;
    
     window.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault(); // 阻止默认的滚动行为
    }
    });
    resetGame();

    $game.addEventListener("keydown",function(event){
        console.log(event.code);
        if(event.code =="KeyR"){
            Start = 1;
        }
    });

    $game.addEventListener("keydown",function(event){
        //已经点了就不会继续向上了
        // console.log(event.code);
        if(animationKOI)  {
            // console.log(animationKOI);
            return; 
        }
        if(!Start) return;

        if(event.code=="Space"){
            event.preventDefault(); // 阻止默认滚动行为
            event.stopPropagation();
            let up = function(){
                speed -= acceleration;
                
                //console.log(speed);
                
                pos += speed;
                $KOI.style.bottom = `${pos}px`;
                if(speed <= 1e-8) {
                    cancelAnimationFrame(animationKOI);
                    animationKOI = requestAnimationFrame(down);
                } else {
                    animationKOI = requestAnimationFrame(up);
                }
            }
    
            animationKOI = requestAnimationFrame(up);
            let down = function(){
                speed += acceleration;
                pos -= speed;
                 $KOI.style.bottom = `${pos}px`;
                if(pos <= 0){
                    pos = 0 ;
                    speed = orgSpeed;
                    $KOI.style.bottom = `${pos}px`;
                    cancelAnimationFrame(animationKOI);
                    animationKOI = null;
                    return;
                }
                animationKOI = requestAnimationFrame(down);
            }

        }
    });

    let animationBlock = null;
    let posBlock = 0;
    const initSpeed = 8;
    let speedBlock = initSpeed;

    //block动画
    setInterval(function(){
        //console.log(objKoi.kb);
        
        if(animationBlock) return;
        if(!Start) return;
        let moveBlock = function(){
            posBlock += speedBlock;
            $block.style.right = `${posBlock}px`;
            if(posBlock >= 790) {
                posBlock = 0;
                $block.style.right = `${posBlock}px`;
                animationBlock = null;
                return;
            }
            animationBlock = requestAnimationFrame(moveBlock)
        }

        animationBlock = requestAnimationFrame(moveBlock);


    },10);

    let $title = document.getElementById("title");
    //定时检测
    setInterval(function(){
        if(!Start) return;
        else $title.style.display = "none";
        check();
        speedAdjust();
        showScore();
        getScore();
    },1);

    let score = 0;

    //得分判断
    let getScore = function() {
        score++;

        //console.log(score);
    }

    //分数显示
    let $sScore = document.getElementById("score"); 
    let showScore = function() {

        $sScore.textContent = `score:${score}`;
    }

    //难度调节
    let speedAdjust = function() {
        if(score%500===0){
            speedBlock++;
        }
    }

    //实现失败判定
    let cssKOI = document.getElementById("KOI");
    let styleObjKOI = window.getComputedStyle(cssKOI);
    let cssblock = document.getElementById("block");
    let styleObjblock = window.getComputedStyle(cssblock);
    let cssGame = document.getElementById("game");
    let styleObjgame = window.getComputedStyle(cssGame);

    let objKoi = {
        "kb":parseInt(styleObjKOI.getPropertyValue("bottom")),
        "kw":parseInt(styleObjKOI.getPropertyValue("width")),
        "kh":parseInt(styleObjKOI.getPropertyValue("height")),
        "kl":parseInt(styleObjKOI.getPropertyValue("left"))
    }
    let objBlock = {
        "bb":parseInt(styleObjblock.getPropertyValue("bottom")),
        "br":parseInt(styleObjblock.getPropertyValue("right")),
        "bh":parseInt(styleObjblock.getPropertyValue("height")),
    }
    let objGame = {
        "gw":parseInt(styleObjgame.getPropertyValue("width"))
    }
    
    //console.log(objKoi.kb);


    // 游戏失败重置时调用
    function resetGame() {
        // 1. 获取游戏容器（给你的外层 div 加个 id 比如 gameContainer）
        const container = document.getElementById('game');
        
        // 2. 强制重置样式（彻底消除黑线）
        //container.style.border = 'none'; // 清除边框
        container.style.overflow = 'hidden'; // 隐藏滚动条
        container.style.outline = 'none'; // 清除默认轮廓
        
        // 3. 其他重置逻辑（分数、角色位置等）
      
    }


    // let $rank = querySelector('#scoreList');
    // let ScoreList = [];
    // let Scoreindex = 1;
    // function Rank() {
    //     const rankItem = document.createElement('p');
    //     rankItem.textContent = `${Scoreindex}: ${score}`; // 加空格优化显示
    //     // 5. 将创建的 p 标签挂载到页面容器中（核心缺失步骤）
    //     $rank.appendChild(rankItem);
    //     ScoreList.push(rankItem);
    //     Scoreindex++;
    // }

    // 1. 修复选择器（必须加 #/.，否则找不到元素）
    // 假设你的 scoreList 是 id，用 #；如果是 class 用 .
    let $rank = document.querySelector('#scoreList');
    // 初始化分数列表数组
    let ScoreList = [];
    // 2. 排名索引从 1 开始（合理，但要注意数组下标）
    let Scoreindex = 1;

    // 3. 封装排名创建函数，增加健壮性
    function Rank() {
        // 防御性检查：确保找到容器，避免 DOM 操作报错
        if (!$rank) {
            console.error('未找到分数列表容器 scoreList');
            return;
        }
        //ScoreContainer.innerHTML = '';
        
        // 4. 修复数组存储逻辑（原逻辑会跳过下标 0，且未挂载到 DOM）
        const rankItem = document.createElement('p');
        rankItem.textContent = `${Scoreindex}: ${score}`; // 加空格优化显示
        // 5. 将创建的 p 标签挂载到页面容器中
        //$rank.appendChild(rankItem);
        
        // 6. 存储到数组（可选，仅需记录时用）
        ScoreList.push(rankItem);
        ScoreList.sort();
        // 7. 索引自增
        Scoreindex++;

        ScoreList.forEach(element => {
            $rank.appendChild(rankItem);
        });
    }


    let check = function() {
        if(score>99999) {
            window.alert("!?强强!?\n你的分数超上限了！");
        }
        if((pos <= objBlock.bh) && ((posBlock <= objGame.gw - objKoi.kl) && (posBlock >= objGame.gw - objKoi.kw))){
            //游戏结束处理
            window.alert("游戏结束\nscore:"+score);
            resetGame();
            Rank();
            score = 0;
            Start = 0;
            speedBlock = initSpeed;
            $title.style.display = "block";
            
        }
    }

   
}


export { main }