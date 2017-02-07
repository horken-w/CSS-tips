window.addEventListener('load', eventWindowLoaded);

function eventWindowLoaded() {
    canvasApp();
}

function canvasApp() {
    var cvs = document.getElementById('canvas'),
        ctx = cvs.getContext('2d');
    if (!ctx) return;

    // 狀態判定
    const GAME_STATE_TITLE = 0;
    const GAME_STATE_NEW_GAME = 1;
    const GAME_STATE_NEW_LEVEL = 2;
    const GAME_STATE_PLAYER_START = 3;
    const GAME_STATE_PLAY_LEVEL = 4;
    const GAME_STATE_PLAYER_DIE = 5;
    const GAME_STATE_GAME_OVER = 6;
    var currentGameState = 0,
        currentGameStateFunction = null;

    // 標題畫面
    var titleStarted = false,
        gameOverStared = false;

    // 遊戲環境
    var score = 0,
        level = 0,
        extraShipAtEach = 10000,
        extraShipEarned = 0,
        playerShips = 3;

    // 比賽場地
    var xMin = 0,
        xMax = 400,
        yMin = 0,
        yMax = 400;

    // score
    var bigRockScore = 50,
        medRockScore = 75,
        smlRockScore = 100,
        saucerScore = 300

    // Frequency
    const Rock_scal_Large = 1;
    const Rock_scale_Medium = 2;
    const Rock_scale_Small = 3;

    // player and the game obj
    var player = [],
        rocks = [],
        saucers = [],
        playerMissiles = [],
        particles = [].
    saucerMissiles = [];

    // Game Level
    var levelRockMaxSpeedAdjust = 1,
        levelSaucerMax = 1,
        levelSaucerOccurrenceRate = 25,
        levelSaucerSpeed = 1,
        levelSaucerFireDelay = 300,
        levelSaucerFireRate = 30,
        levelSaucerMissileSpeed = 1;

    // keyPress
    var keyPressList = [];

    function runGame() {
        currentGameStateFunction();
    }

    function switchGameState(newState) {
        currentGameState = newState;

        switch (currentGameState) {
            case GAME_STATE_TITLE:
                currentGameStateFunction = gameStateTitle
                break;
            case GAME_STATE_NEW_GAME:
                currentGameStateFunction = gameStateNewGame;
                break;
            case GAME_STATE_NEW_LEVEL:
                currentGameStateFunction = gameStateNewLevel;
                break;
            case GAME_STATE_PLAYER_START:
                currentGameStateFunction = gameStatePlayerStart;
                break;
            case GAME_STATE_PLAY_LEVEL:
                currentGameStateFunction = gameStatePlayLevel
                break;
            case GAME_STATE_PLAYER_DIE:
                currentGameStateFunction = gameStatePlayerDie;
                break;
            case GAME_STATE_GAME_OVER:
                currentGameStateFunction = gameStateGameOver;
                break;
        }
    }

    function gameStateTitle() {
        if (!titleStarted) {
            fillBackground();
            setTextStyle();
            ctx.fillText('GEO Blaster Basic', 130, 70);
            ctx.fillText('Press Space To Play', 125, 140);
            titleStarted = true;
        } else {
            if (keyPressList[32]) {
                console.log('space pressed');
                switchGameState(GAME_STATE_NEW_GAME);
                titleStarted = false;
            }
        }
    }

    function gameStateNewGame() {
        // new game
        level = 0;
        score = 0;
        playerShips = 3;
        player.maxVelocity = 5;
        player.width = 20;
        player.height = 20;
        player.helfWidth = 10;
        player.helfHeight = 10;
        player.rotationalVelocity = 5; // 飛船旋轉角度
        player.thrustAcceleration = .05;
        player.missileFrameDelay = 5;
        player.thrust = false;

        fillBackground();
        renderScoreBoard();
        switchGameState(GAME_STATE_NEW_LEVEL);
    }

    function gameStateNewLevel() {
        rocks = [];
        saucers = [];
        playerMissiles = [];
        particles = [];
        saucerMissiles = [];

        level++;

        levelRockMaxSpeedAdjust = level * .25;
        if (levelRockMaxSpeedAdjust > 3) levelRockMaxSpeedAdjust = 3;

        levelSaucerMax = 1 + Math.floor(level / 10);
        if (levelSaucerMax > 5) levelSaucerMax = 5;

        levelSaucerOccurrenceRate = 10 + 3 * level;
        if (levelSaucerOccurrenceRate > 35) levelSaucerOccurrenceRate = 35;

        levelSaucerSpeed = 1 + .5 * level;
        if (levelSaucerSpeed > 5) levelSaucerSpeed = 5;

        levelSaucerFireDelay = 120 - 10 * level;
        if (levelSaucerFireDelay < 20) levelSaucerFireDelay = 20;

        levelSaucerFireRate = 20 + 3 * level;
        if (levelSaucerFireRate < 50) levelSaucerFireRate = 50;

        levelSaucerMissileSpeed = 1 + 2 * level;
        if (levelSaucerMissileSpeed > 4) levelSaucerMissileSpeed = 4;

        for (var newRockctr = 0; newRockctr < level + 3; newRockctr++) {
            var newRock = {};

            newRock.scale = 1;
            //岩石大小 1 = 大 2 = 中 3 = 小
            //用於判定岩石大小尺寸
            // ex: 
            // 大 50/1  中 50/2  小50/3
            newRock.width = 50;
            newRock.height = 50;
            newRock.helfWidth = 25;
            newRock.helfHeight = 25;

            // 起始岩石位置
            newRock.x = Math.floor(Math.random() * 50);
            newRock.y = Math.floor(Math.random() * 50);

            newRock.dx = (Math.random() * 2) + levelRockMaxSpeedAdjust;
            if (Math.random() < .5) newRock.dx *= -1;

            newRock.dy = (Math.random() * 2) + levelRockMaxSpeedAdjust;
            if (Math.random() < .5) newRock.dy *= -1;

            newRock.rotationInc *= -1;
            if (Math.random() < .5) newRock.rotationInc *= -1;

            newRock.scoreValue = bigRockScore;
            newRock.rotation = 0;

            rocks.push(newRock);
        }
        resetPlayer();
        switchGameState(GAME_STATE_PLAYER_START);
    }

    function gameStatePlayerStart() {
        fillBackground();
        renderScoreBoard();

        if (player.alpha < 1) {
            player.alpha += .2;
            ctx.globalAlpha = player.alpha;
        } else switchGameState(GAME_STATE_PLAY_LEVEL);

        renderPlayerShip(player.x, player.y, 270, 1);
        ctx.globalAlpha = 1;
        updateRocks();
        renderRocks();
    }

    function gameStatePlayLevel() {
        checkKeys();
        update();
        render();
        checkCollisions();
        checkForExtraShip();
        frameRateCounter.countFrames();
    }

    function gameStatePlayerDie() {
    	if(particles.length > 0 || playerMissiles.length > 0){
    		fillBackground();
    		renderScoreBoard();
    		updateRocks();
    		updateSaucers();
    		updateParticles();
    		updateSaucerMissiles();
    		updatePlyerMissiles();
    		renderRocks();
    		renderSaucers();
    		renderParticles();
    		renderSaucerMissiles();
    		renderPlayerMissiles();
    		frameRateCounter.countFrames();
    	}
    	else{
    		playerShips--;
    		if(Player.ship<1) switchGameState(GAME_STATE_GAME_OVER);
    		else{
    			resetPlayer();
    			switchGameState(GAME_STATE_PLAYER_START);
    		}
    	}
    }

    function gameStateGameOver(){
    	if(!gameOverStared){
    		fillBackground();
    		renderScoreBoard();
    		setTextStyle();
    		ctx.fillText('Game Over', 150, 70);
    		ctx.fillText('Press Space to Player', 125, 140)
    		gameOverStared = true;
    	}
    	else{
    		if (keyPressList[32]) {
                console.log('space pressed');
                switchGameState(GAME_STATE_TITLE);
                titleStarted = false;
            }
    	}
    }

    function resetPlayer() {
        player.rotation = 270;
        player.x = .5 * xMax;
        player.y = .5 * yMax;
        player.facingX = 0;
        player.facingY = 0;
        player.movingX = 0;
        player.movingY = 0;
        player.alpha = 0;
        player.missileFrameCount = 0;
    }

    function checkCollisions(){
    	// 碰撞偵測
    	// 通過岩石的飛彈循環偵測

    	var tempRock = {};
    	var rocksLength = rocks.length-1;
    	var tempPlayerMissile = {};
    	var playerMissileLength = playerMissiles.length-1;
    	var saucerLength = saucers.length-1;
    	var tempSaucer = {};
    	var saucerMissileLength = saucerMissiles.length-1;

    	rocks: for(var rockCtr = rocksLength; rockCtr--;){
    		tempRock = rocks[rockCtr];

    		missiles: for(var playerMissileCtr = playerMissileLength; playerMissileCtr--;){
    			tempPlayerMissile = playerMissiles[playerMissileCtr];

    			if(boundingBoxCollide(tempRock, tempPlayerMissile)){
    				createExplode(tempRock.x + tempRock.halfWidth, tempRock.y+tempRock.halfHeight, 10)
    			
    				if(tempRock.scale < 3) splitRock(tempRock.scale+1, tempRock.x, tempRock.y);

    				addToScore(tempRock.scoreValue);
    				playerMissiles.splice(playerMissileCtr, 1);
    				tempPlayerMissile = null;

    				rocks.splice(rockCtr, 1);
    				tempRock = null;

    				break rocks;
    				break missiles;
    			}
    		}

    		saucers: for(var saucerCtr = saucerLength; saucerCtr--;){
    			tempSaucer = saucers[saucerCtr];

    			if(boundingBoxCollide(tempRock. tempSaucer)){
    				createExplode(tempSaucer.x + tempSaucer.halfWidth, tempSaucer.y + tempSaucer.halfHeight, 10);
    				createExplode(tempRock.x + tempRock.halfWidth, tempRock.y + tempRock.halfHeight, 10);

    				if(tempRock.scale < 3) splitRock(tempRock.scale+1, tempRock.x, tempRock.y);

    				saucers.splice(saucerCtr, 1);
    				tempSaucer = null;

    				rocks.splice(rockCtr, 1);
    				tempRock = null;

    				break rocks;
    				break saucers;
    			}
    		}
    		// 碰撞 - 飛碟的飛彈與岩石
    		saucerMissiles: for(var saucerMissileCtr = saucerMissileLength; saucerMissileCtr--;){
    			tempSaucerMissile = saucerMissile[saucerMissileCtr];

    			if(boundingBoxCollide(tempRock, tempSaucerMissile)){
    				createExplode(tempRock.x + tempRock.halfWidth, tempRock.y + tempRock.halfHeight, 10)

    				if(tempRock.scale<3) splitRock(tempRock.scale+1, tempRock.x, tempRock.y);

    				saucerMissiles.splice(saucerCtr, 1);
    				tempRock = null;

    				break rocks;
    				break saucerMissiles;
    			}
    		}
    		if(boundingBoxCollide(tempRock, player)){
    			createExplode(tempRock.x + tempRock.halfWidth, tempRock + tempRock.halfHeight, 10);
    			addToScore(tempRock.scoreValue);
    			
    			if(tempRock.scale < 3) splitRock(tempRock.scale+1, tempRock.x, tempRock.y);

    			rocks.splice(rockCtr, 1);
    			tempRock = null;

    			playerDie();
    		}
    	}

    	// 最後檢查飛彈與飛碟和玩家碰撞
    	playerMissileLength = playerMissiles.length-1;
    	saucerLength = saucers.length-1;
    	saucers: for(var saucerCtr = saucerLength; saucerCtr--;){
    		tempSaucer = saucers[saucerCtr];

    		missiles: for(var playerMissileCtr = playerMissileLength; playerMissileCtr--;){
    			tempPlayerMissile = playerMissiles[playerMissileCtr];

    			if(boundingBoxCollide(tempSaucer, tempPlayerMissile)){
    				createExplode(tempSaucer.x + tempSaucer.halfWidth, tempSaucer.y + tempSaucer.halfHeight, 10);

    				addToScore(tempSaucer.scoreValue);
    				playerMissiles.splice(playerMissileCtr, 1);
    				tempPlayerMissile = null;

    				saucer.splice(saucerCtr, 1);
    				tempSaucer = null;

    				break saucers;
    				break missiles;
    			}
    		}
			//玩家對準飛彈
			if(boundingBoxCollide(tempSaucer, player)){
				createExplode(tempSaucer.x + 16, tempSaucer.y + 16, 10);
				addToScore(tempSaucer.scoreValue);

				saucers.splice(rockCtr, 1);
				tempSaucer = null;

				playerDie();
			} 
    	}

    	saucerMissileLength - saucerMissiles.length - 1;

    	saucerMissiles: for(var saucerMissileCtr = saucerMissileLength; saucerMissileCtr--;){
    		tempSaucerMissile = saucerMissiles[saucerMissileCtr];

    		if(boundingBoxCollide(player, tempSaucerMissile)){
    			playerDie();
    			saucerMissiles.splice(saucerCtr, 1);
    			tempSaucerMissile = null;

    			break saucerMissiles;
    		}
    	}
    }

    function checkForExtraShip() {
        if (Math.floor(score / extraShipAtEach) > extraShipEarned) {
            playerShips++;
            extraShipEarned++;
        }
    }

    function checkForEndOfLevel() {
        if (rocks.length == 0) {
            switchGameState(GAME_STATE_NEW_LEVEL);
        }
    }

    function renderScoreBoard() {
        ctx.fillStyle = 'white';
        ctx.fillText('Score' + score, 10, 20);
        renderPlayerShip(200, 16, 200, .75);
        ctx.fillText('X' + playerShips, 220, 20);

        ctx.fillText('FPS: ' + frameRateCounter.lastFrameCount, 300, 200);
    }

    function renderPlayerShip(x, y, rotation, scale) {
        var angleInRadians = rotation * Math.PI / 180;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.translate(x + player.helfWidth, y + player.helfHeight);
        ctx.rotate(angleInRadians);
        ctx.scale(scale, scale);

        ctx.strokeStyle = 'white';
        ctx.beginPath();

        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 0);
        ctx.moveTo(10, 1);
        ctx.lineTo(-10, 10);
        ctx.lineTo(1, 1);
        ctx.moveTo(1, -1);
        ctx.lineTo(-10, -10);

        if (player.trust && scale) {
            // 檢查飛行指標是否推進
            ctx.moveTo(-4, -2);
            ctx.lineTo(-4, 1);
            ctx.moveTo(-5, -1);
            ctx.lineTo(-10, -1);
            ctx.moveTo(-5, 0);
            ctx.lineTo(-10, 0);
        }
        ctx.stroke();
        ctx.closePath();

        ctx.restore();
    }

    function playerDie(){
    	console.log('Player Die');
    	createExplode(player.x + player.halfWidth, player.y + player.halfHeight, 50);
    	switchGameState(GAME_STATE_PLAYER_DIE);
    }

    function boundingBoxCollide(obj1, obj2){
    	var left1 = obj1.x,
    		left2 = obj2.x,
    		right1 = obj1.x + obj1.width,
    		right2 = obj2.x + obj2.width,
    		top1 = obj1.y,
    		top2 = obj2.y,
    		btm1 = obj1.y + obj1.height,
    		btm2 = obj2.y + obj2.height;

    		if(btm1 < top2) return false;
    		if(top1 > btm2) return false;

    		if(right1 < left2) return false;
    		if(left1 > right2) return false;

    		return true;
    }

    function createExpload(x, y, num){
    	for(var partCtr = 0; partCtr < num, partCtr++;){
    		var newParticle = new Object();
    		newParticle.dx = Math.radom()*3;
    		if(Math.random() < .5 ) newParticle.dx *= -1;

    		newParticle.dy = Math.radom()*3;
    		if(Math.random() < .5 ) newParticle.dy *= -1;

    		newParticle.life = Math.floor(Math.random() * 30 + 30);
    		newParticle.lifeCtr = 0;
    		newParticle.x = x;
    		newParticle.y = y;

    		particles.push(newParticle);
    	}
    }

    function fillBackground() {
        ctx.fillStyle = 'black';
        ctx.fillRect(xMin, yMin, xMax, yMax);
    }

    function setTextStyle() {
        ctx.fillStyle = 'white';
        ctx.font = '15px _sans';
        ctx.textBaseline = 'top';
    }

    function checkKeys(){
    	if(keyPressList[38]){
    		var angleInRadians = player.rotation * Math.PI / 180;
    		player.facingX = Math.cos(angleInRadians);
    		player.facingY = Math.sin(angleInRadians);

    		var moveingXNew = player.movingX+player.thrustAcceleration*player.facingX;
    		var moveingYNew = player.movingY+player.thrustAcceleration*player.facingY;

    		var currentVelocity = Math.sqrt((moveingXNew*moveingXNew)) + ((moveingXNew*moveingXNew));

    		if(currentVelocity < player.maxVelocity){
    			player.movingX = moveingXNew;
    			player.movingY = moveingYNew;

    		}
    		player.trust = true;
    	}
    	else{
    		player.trust = false;
    	}

    	if(keyPressList[37]) player.rotation -= player.rotationalVelocity; //順時針旋轉
    	if(keyPressList[39]) player.rotation += player.rotationalVelocity; //逆時針旋轉
    	if(keyPressList[32]) //空格發射子彈
    		if(player.missileFrameCount > player.missileFrameDelay){
    			firePlayerMissile();
    			player.missileFrameCount = 0;
    		}
    }

    function update(){
    	updatePlayer();
    	updatePlyerMissiles();
    	updateRocks();
    	updateSaucers();
    	updateSaucerMissiles();
    	updateParticles();
    }

    function render(){
    	fillBackground();
    	renderScoreBoard();
    	renderPlayerShip(player.x, player.y, player.rotation, 1);
    	renderPlayerMissiles();
    	renderRocks();
    	renderSaucer();
    	renderSaucerMissiles();
    	renderParticles();
    }

    function updatePlayer(){
    	player.missileFrameCount++;

    	player.x += player.movingX;
    	player.y += player.movingY;


    	if(player.x > xMax) player.x =- player.width;
    	else if(player.x < -player.width) player.x = xMax;

    	if(player.y > yMax) player.y =- player.height;
    	else if(player.y < -player.height) player.y = yMax;
    }

    function firePlayerMissile(){
    	var newPlayerMissile = {};

    	newPlayerMissile.dx = 5*Math.cos(Math.PI*(player.rotation) / 180);
    	newPlayerMissile.dy = 5*Math.sin(Math.PI*(player.rotation) / 180);
    	newPlayerMissile.x = player.x + player.halfWidth;
    	newPlayerMissile.y = player.y + player.halfHeight;
    	newPlayerMissile.life = 60;
    	newPlayerMissile.lifeCtr = 0;
    	newPlayerMissile.width = 2;
    	newPlayerMissile.height = 2;
    	playerMissiles.push(newPlayerMissile);
    }

    function updatePlyerMissiles(){
    	var tempPlayerMissile = {},
    		playerMissileLength = playerMissiles.length-1;

    	for(var playerMissileCtr = playerMissiles.length; playerMissileCtr--;){
    		tempPlayerMissile = playerMissiles[playerMissileCtr];

    		tempPlayerMissile.x += tempPlayerMissile.dx;
    		tempPlayerMissile.y += tempPlayerMissile.dy;
    		if(tempPlayerMissile.x > xMax) tempPlayerMissile.x -=tempPlayerMissile.width;
    		else if( tempPlayerMissile.x < -tempPlayerMissile.width) tempPlayerMissile.x = xMax;

    		if(tempPlayerMissile.y > yMax) tempPlayerMissile.y -=tempPlayerMissile.height;
    		else if( tempPlayerMissile.y < -tempPlayerMissile.height) tempPlayerMissile.y = xMax;

    		tempPlayerMissile.lifeCtr++;
    		if(tempPlayerMissile.lifeCtr >tempPlayerMissile.life){
    			playerMissiles.splice(playerMissileCtr, 1);
    			tempPlayerMissile = null;
    		}
    	}
    }

    function renderPlayerMissiles(){
    	var tempPlayerMissile = {},
    		playerMissileLength = playerMissiles.length-1;

    	for(var playerMissileCtr = playerMissileLength; playerMissileCtr--;){
    		tempPlayerMissile = playerMissiles[playerMissileCtr];
    		ctx.save();
    		ctx.setTransform(1, 0, 0, 1, 0, 0);

    		ctx.translate(tempPlayerMissile.x+1, tempPlayerMissile.y+1);
    		ctx.stroke = 'white';

    		ctx.beginPath();

    		ctx.moveTo(-1, -1);
    		ctx.lineTo(1, -1);
    		ctx.lineTo(1, 1);
    		ctx.lineTo(-1, 1);
    		ctx.lineTo(-1, -1);
    		ctx.stroke();
    		ctx.closePath();
    		ctx.restore();
    	}
    }

    function updateRocks(){
    	var tempRock = {};
    	var rocksLength = rocks.length-1;

    	for(var rockCtr = rocksLength; rockCtr--;){
    		tempRock = rocks[rockCtr];
    		tempRock.x += tempRock.dx;
    		tempRock.y += tempRock.dy;
    		tempRock.rotation += tempRock.rotationInc;

			if(tempRock.x > xMax) tempRock.x = xMin - tempRock.width;
			else if(tempRock.x < xMin-tempRock.width) tempRock.x = xMax;

			if(tempRock.y > yMax) tempRock.y = yMin - tempRock.width;
    		else if(tempRock.y < yMin-tempRock.width) tempRock.y = yMax;
		}
    }

    function renderRocks(){
    	var tempRock = {};
    	var rocksLength = rocks.length - 1;

    	for(var rockCtr = rocksLength; rockCtr--;){
    		tempRock = rocks[rockCtr];
    		var angleInRadians = tempRock.rotation * Math.PI / 180;

    		ctx.save();
    		ctx.setTransform(1, 0, 0, 1, 0, 0);

    		ctx.translate(tempRock.x + tempRock.halfWidth,
    					  tempRock.y + tempRock.halfHeight);

    		ctx.rotate(angleInRadians);
    		ctx.strokeStyle = 'white';

    		ctx.beginPath();

    		ctx.moveTo(-(tempRock.halfWidth - 1), -(tempRock.halfHeight-1));
    		ctx.lineTo((tempRock.halfWidth - 1), -(tempRock.halfHeight-1));
    		ctx.lineTo((tempRock.halfWidth - 1), (tempRock.halfHeight-1));
    		ctx.lineTo(-(tempRock.halfWidth - 1), (tempRock.halfHeight-1));
    		ctx.lineTo(-(tempRock.halfWidth - 1), -(tempRock.halfHeight-1));

    		ctx.stroke();
    		ctx.closePath();
    		ctx.restore();
    	}
    }

    function splitRock(scale, x, y){
    	for(var newRockctr = 0; newRockctr<2; newRockctr++){
    		var newRock = {};

    		if(scale==2){
    			newRock.scoreValue = medRockScore;
    			newRock.width = 25;
    			newRock.height = 25;
    			newRock.halfwidth = 12.5;
    			newRock.height = 12.5;
    		}
    		else{
    			newRock.scoreValue = smlRockScore;
    			newRock.width = 16;
    			newRock.height = 16;
    			newRock.halfWidth = 8;
    			newRock.halfHeight = 8;
    		}

    		newRock.scale = scale;
    		newRock.x = x;
    		newRock.y = y;
    		newRock.dx = Math.random()*3;
    		if(Math.random()<0.5) newRock.dx*=-1;
    		newRock.dy = Math.random()*3;
    		if(Math.random()<0.5) newRock.dy*=-1;
    		newRock.rotationInc = (Math.random()*5)+1;
    		if(Math.random()<0.5) newRock.rotationInc*=-1;

    		newRock.rotation = 0;
    		rocks.push(newRock);
    	}
    }

    function updateSaucers(){
    	try{
    		if(saucers.length < levelSaucerMax){
	    		if(Math.floor(Math.random()*100) <= levelSaucerOccurrenceRate){
	    			var newSaucers = {};

	    			newSaucers.width = 28;
	    			newSaucers.height = 13;
	    			newSaucers.halfWidth = 14;
	    			newSaucers.halfHeight = 6.5;
	    			newSaucers.scoreValue = saucerScore;
	    			newSaucers.fireRate = levelSaucerFireRate;
	    			newSaucers.fireDelay = levelSaucerFireDelay;
	    			newSaucers.fireDelayCount = 0;
	    			newSaucers.missileSpeed = levelSaucerMissileSpeed;
	    			newSaucers.dy = (Math.random() * 2);
	    			if(Math.floor(Math.random()*2 == 1)) newSaucers.dy *= -1;

	    			if(Math.floor(Math.random()*2) == 1){
	    				newSaucers.x = 450;
	    				newSaucers.dx = -1 * levelSaucerSpeed;
	    			}
	    			else{
	    				newSaucers.x = -50;
	    				newSaucers.dx = levelSaucerSpeed;
	    			}
	    			newSaucers.y = Math.floor(Math.random()*400);

	    			saucers.push(newSaucers);
	    		}
	    	}
			var tempSaucer = {},
				saucerLength = saucers.length-1;

			for(var saucerCtr = saucerLength; saucerCtr--;){
				tempSaucer = saucers[saucerCtr];

				tempSaucer.fireDelayCount++;

				if(Math.floor(Math.random()*100) <=tempSaucer.fireRate && 
					tempSaucer.fireDelayCount > tempSaucer.fireDelay){
					fireSaucerMissile(tempSaucer);
					tempSaucer.fireDelayCount = 0;
				}

				var remove = false;
				tempSaucer.x += tempSaucer.dx;
				tempSaucer.y += tempSaucer.dy;

				if(tempSaucer.dx > 0 && tempSaucer.x > xMax) remove = true;
				else if(tempSaucer.dx < 0 && tempSaucer.x < xMin - tempSaucer.width) remove = true;

				if( tempSaucer.y > yMax || tempSaucer.y < yMin - tempSaucer.width) tempSaucer.dy *= -1;

				if(remove){
					saucers.splice(saucerCtr, 1);
					tempSaucer = null;
				}
			}
    	}
    	catch(err){
    		console.log(err)
    	}
    }

    function renderSaucers(){
    	var tempSaucer = {};
    	var saucerLength = saucers.length-1;

    	for(var saucerCtr = saucerLength; saucerCtr--;){
    		tempSaucer = saucers[saucerCtr];

    		ctx.save();
    		ctx.setTransform(1, 0, 0, 1, 0, 0);
    		ctx.translate(tempSaucer.x, tempSaucer.y);
    		ctx.stroke = 'white';

    		ctx.beginPath();

    		ctx.moveTo(4, 0);
    		ctx.lineTo(9, 0);
    		ctx.lineTo(12, 3);
    		ctx.lineTo(13, 3);
    		ctx.moveTo(13, 4);
    		ctx.lineTo(10, 7);
    		ctx.lineTo(3, 7);
    		ctx.lineTo(1, 5);
    		ctx.lineTo(12, 5);
    		ctx.moveTo(0, 4);
    		ctx.lineTo(0, 3);
    		ctx.lineTo(13, 3);
    		ctx.moveTo(5, 1);
    		ctx.lineTo(5, 2);
    		ctx.moveTo(8, 1);
    		ctx.lineTo(8, 2);
    		ctx.moveTo(2, 2);
    		ctx.lineTo(4, 0);

    		ctx.stroke();
    		ctx.closePath();
    		ctx.restore();
    	}
    }

    function fireSaucerMissile(){
    	var newSaucersMissile = {};

    	newSaucersMissile.x = saucer.x+.5*saucer.width;
    	newSaucersMissile.y = saucer.y+.5*saucer.height;

    	newSaucersMissile.width = 2;
    	newSaucersMissile.height = 2;
    	newSaucersMissile.speed = saucer.missileSpeed;

    	var diffx = player.x-saucer.x,
    		diffy = player.y-saucer.y;

    	var radians = Math.atan2(diffy, diffx);
    	var degrees = 360*radians / (2*Math.PI);

    	newSaucersMissile.dx = saucer.missileSpeed*Math.cos(Math.PI*(degrees)/180);
    	newSaucersMissile.dy = saucer.missileSpeed*Math.sin(Math.PI*(degrees)/180);
    	newSaucersMissile.life = 160;
    	newSaucersMissile.lifeCtr = 0;
    	saucerMissiles.push(newSaucersMissile);
    }

    function updateSaucerMissiles(){
    	var tempSaucerMissile = {},
    		saucerMissileLength = saucerMissiles.length - 1;

    	for(var saucerMissileCtr = saucerMissileLength; saucerMissileCtr--;){
    		tempSaucerMissile = saucerMissiles[saucerMissileCtr];
    		tempSaucerMissile.x += tempSaucerMissile.dx;
    		tempSaucerMissile.y += tempSaucerMissile.dy;

    		if(tempSaucerMissile.x > xMax) tempSaucerMissile.x = -tempSaucerMissile.width;
    		else if(tempSaucerMissile.x < -tempSaucerMissile.width) tempSaucerMissile.x = xMax;

    		if(tempSaucerMissile.y > yMax) tempSaucerMissile.y = -tempSaucerMissile.height;
    		else if(tempSaucerMissile.y < -tempSaucerMissile.height) tempSaucerMissile.y = yMax;

    		tempSaucerMissile.lifeCtr++;
    		if(tempSaucerMissile.lifeCtr > tempSaucerMissile.life){
    			saucerMissiles.splice(saucerMissileCtr, 1);
    			tempSaucerMissile = null;
    		}
    	}
    }

    function renderSaucerMissiles(){
    	var tempSaucerMissile = {},
    		saucerMissileLength = saucerMissiles.length-1;

    	for(var saucerMissileCtr = saucerMissileLength; saucerMissileCtr--;){
    		tempSaucerMissile = saucerMissiles[saucerMissileCtr];

    		ctx.save();
    		ctx.setTransform(1, 0, 0, 1, 0, 0);

    		ctx.translate(tempSaucerMissile.x + 1, tempSaucerMissile.y + 1);
    		ctx.strokeStyle = 'white';

    		ctx.moveTo(-1, -1);
    		ctx.lineTo(1, -1);
    		ctx.lineTo(1, 1);
    		ctx.lineTo(-1, 1);
    		ctx.lineTo(-1, -1);
    		ctx.stroke();
    		ctx.closePath();
    		ctx.restore();
    	}
    }

    function updateParticles(){
    	var tempParticle = {};
    	var particleLength = particles.length-1;

    	for(var particleCtr = particleLength; particleCtr--;){
    		var remove = false;

    		tempParticle = particles[particleCtr];
    		tempParticle.x += tempParticle.dx;
    		tempParticle.y += tempParticle.dy;

    		tempParticle.lifeCtr++;

    		if(tempParticle.lifeCtr > tempParticle.life) remove = true;
    		else if((tempParticle.x>xMax) || (tempParticle.x<xMin) || (tempParticle.y>yMax) || (tempParticle.y<yMin)) remove = true;

    		if(remove){
    			particles.splice(particleCtr, 1);
    			tempParticle = null;
    		}
    	}
    }

    function renderParticles(){
    	var tempParticle ={};
		var particleLength = particles.length-1;
		for(var particleCtr = particleLength; particleCtr--;){
			tempParticle = particles[particleCtr];

			ctx.save();
			ctx.setTransform(1, 0, 0, 1, 0, 0);

			ctx.translate(tempParticle.x, tempParticle.y);
			ctx.strokeStyle = 'white';

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(1, 1);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();
		} 
    }

    function addToScore(value){
    	score+=value;
    }

    document.onkeydown = function(e) {
        e = e ? e : window.evenct;
        keyPressList[e.keyCode] = true;
    }
    document.onkeyup = function(e) {
        e = e ? e : window.evenct;
        keyPressList[e.keyCode] = false;
    }

    var frameRateCounter = new FrameRateCounter();
    switchGameState(GAME_STATE_TITLE);

    const frame_rate = 40;
    var intervalTime = 1000 / frame_rate;
    setInterval(runGame, intervalTime)
}

// FrameRateCounter obj prtotype
function FrameRateCounter() {
    this.lastFrameCount = 0;
    var dateTemp = new Date();
    this.frameLast = dateTemp.getTime();
    delete dateTemp;
    this.frameCtr = 0;
}

FrameRateCounter.prototype.countFrames = function() {
    var dateTemp = new Date();
    this.frameCtr++;

    if (dateTemp.getTime() >= this.frameLast + 1000) {
        this.lastFrameCount = this.frameCtr;
        this.frameLast = this.frameCtr;
        this.frameCtr = 0;
    }
    delete dateTemp;
}


function Rock(scale, type){
	this.scale = scale;
	if(this.scale < 1 || this.scale>3) this.scale = 1;
	this.type = type;
	this.dx = 0;
	this.dy = 0;
	this.x = 0;
	this.y = 0;
	this.rotation = 0;
	this.rotationInc = 0;
	this.scoreValue = 0;

	switch(this.scale){
		case 1:
			this.width = 50;
			this.height = 50;
			break;
		case 2:
			this.width = 25;
			this.height = 25;
			break;
		case 3:
			this.width = 16;
			this.height = 16;
			break;
	}
}

Rock.prototype.update = function(xmin, xmax, ymin, ymax){
	this.x += this.dx;
	this.y += this.dy;
	this.rotation += this.rotationInc;
	if(this.x> xmax) this.x = xmin-this.width;
	else if(this.x<xmin-this.width) this.x = xmax;

	if(this.y> ymax) this.y = ymin-this.width;
	else if(this.y<ymin-this.width) this.y = xmax;
}
Rock.prototype.draw = function(context){
	var angleInRadians = this.rotation * Math.PI / 180;
	var halfWidth = Math.floor(this.width * .5);
	var halfHeight = Math.floor(this.height * .5);
	context.save();
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.translate(this.x+halfWidth, this.y+halfHeight);
	context.rotate(angleInRadians);
	context.strokeStyle = 'white';

	context.beginPath()
	context.moveTo(-(halfWidth-1), -(halfHeight-1));
	context.lineTo(halfWidth-1, -(halfHeight-1));
	context.lineTo(halfWidth-1, halfHeight-1);
	context.lineTo(-(halfWidth-1), halfHeight-1);
	context.lineTo(-(halfWidth-1), -(halfHeight-1));

	context.stroke();
	context.closePath();
	context.restore();
}