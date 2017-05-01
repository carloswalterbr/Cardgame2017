//Основное состояние игры
//Предоставляет движку функции, которые выполняются при загрузке, создании
//и обновлении игрового цикла 

window.playState = new Phaser.State();

playState.preload = function(){
	//Фон
	game.load.image('wood_light', 'assets/backgrounds/wood_light.png');
	game.load.image('wood_dark', 'assets/backgrounds/wood_dark.png');
	game.load.image('green', 'assets/backgrounds/green.png');
	game.load.image('black', 'assets/backgrounds/black.png');
	game.load.image('assault', 'assets/backgrounds/assault.png');
	game.load.image('brown', 'assets/backgrounds/brown.png');
	game.load.image('blue', 'assets/backgrounds/blue.png');

	// Для меню
	game.load.image('menu','assets/backgrounds/menu.png');
	game.load.image('menu_blue','assets/backgrounds/menu_blue.jpg');
	game.load.image('menu_gray','assets/backgrounds/menu_gray.gif');

	//Для тестов
	game.load.image('testParticle', 'assets/test_particle.png');

	//Кнопки
	game.load.spritesheet('button_grey_wide', 'assets/buttons/grey_wide.png', 190, 50, 4);
	game.load.spritesheet('button_grey_small', 'assets/buttons/grey_small.png', 49, 49, 4);
	game.load.spritesheet('button_orange_wide', 'assets/buttons/orange_wide.png', 190, 50, 4);
	game.load.spritesheet('button_orange_small', 'assets/buttons/orange_small.png', 49, 49, 4);

	game.load.spritesheet('icon_fullscreen', 'assets/buttons/icon_fullscreen.png', 30, 30, 2);
	game.load.image('icon_menu', 'assets/buttons/icon_menu.png');

	game.load.spritesheet('cursor_yellow', 'assets/cursors/yellow.png', 128, 128, 3);
	game.load.spritesheet('cursor_orange', 'assets/cursors/orange.png', 128, 128, 3);

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

	//Скины
	window.skinManager = new SkinManager('modern');
	skinManager.addSkins(window.skins);
};

playState.create = function(){
	window.connection = new ConnectionManager(game.initialize, game);
};

playState.update = function(){
	if(!game.created)
		return;

	cardControl.update();
	cardManager.update();
};

playState.render = function(){
	if(!game.created)
		return;

	if(game.stage.disableVisibilityChange && game.paused)
		game.paused = false;

	cardControl.updateDebug();
	fieldManager.updateDebug();
	cardManager.updateDebug();

	if(game.isInDebugMode)
		game.debug.text(game.time.fps, 2, 14, "#00ff00");
};

playState.loadUpdate = function(){
	
};

