//Assets
function preload () {
	game.load.image('table', 'assets/table.png');
	game.load.image('table4x', 'assets/table4x.png');
	game.load.image('table8x', 'assets/table8x.png');
	game.load.image('particle', 'assets/particle.png');
	game.load.image('glow', 'assets/glow.png');
	game.load.spritesheet('cardsClassic', 'assets/cards/classic.png', 390, 570, 52);
	game.load.spritesheet('cardsModern', 'assets/cards/modern.png', 140, 190, 67);
	game.load.spritesheet('suits', 'assets/particles/trails.png', 35, 35, 4);
	game.load.spritesheet('button_grey_wide', 'assets/buttons/grey_wide.png', 190, 49, 3);
}