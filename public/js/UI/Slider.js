var Slider =function(options) {
	this.options = this.getDefaultOptions();
 
    for(var o in options){ 
        if(options.hasOwnProperty(o) && options[o] !== undefined) 
            this.options[o] = options[o]; 
    } 
	
	Phaser.Group.call(this, game, null, this.options.name);
	if(this.options.base){
		this.options.base.add(this);
	}
	else{
		game.add.existing(this);
	}

	this.slidesByName = {};
	this.content = [];
	
	this.addButtonContent(this.changeBackground.bind(this,'uno'),'green');
	this.addButtonContent(this.changeBackground.bind(this,'classic'),'wood');
	this.addTextContent('change');
	this.addTextContent('casual');
	this.addButtonContent(this.changeBackground.bind(this,'modern'),'blue');

	this.maxHeight = this.content[0].height;
	this.maxWidth = this.content[0].width;
	for(i = 1; i< this.content.length;i++){
		if(this.content[i].width > this.maxWidth)
			this.maxWidth = this.content[i].width;
		if(this.content[i].height > this.maxHeight)
			this.maxHeight= this.content[i].height;
	}
	this.count = 0;
	this.previousContent = null;
	this.currentContent = this.content[this.count];
	this.nextContent = this.content[this.count+1];

	this.rightArrow = new Button({
		color: 'orange',
		size: 'left',
		action: this.nextSlide.bind(this),
		name: 'rightArrow',
		group: this
	});

	this.leftArrow = new Button({	
		color: 'orange',
		size: 'right',
		action: this.prevSlide.bind(this),
		name: 'leftArrow',
		group: this
	});
	
};

Slider.prototype = Object.create(Phaser.Group.prototype);
Slider.prototype.constructor = Slider;

Slider.prototype.getDefaultOptions = function(){
	return {
		position: {
			x: 0,
			y: 0,
			alpha:0.5
		},
		margin: 10,
		name: null,
		color: ui.colors.orange,
		elementColor: 'orange',
		textColor: 'white',
		menu: null,
		icon:null,
		font: '28px Exo'
	};
};

Slider.prototype.updatePosition = function(position){
	if(position)
		this.defaultPosition = position;
	else
		position = this.defaultPosition;
	if(typeof position == 'function')
		position = position(this.width, this.height);
	this.x = position.x;
	this.y = position.y;

	var content = this.content[0];
	var left = this.leftArrow;
	var right = this.rightArrow;
	var margin = this.options.margin;
	
	
	if(content instanceof Phaser.Text){
		content.x = left.width + margin;
		content.y = this.maxHeight/2 - left.height/2;
		}
	else{
		content.updatePosition({
			x: left.width + margin,
			y: 0
		});
		}
	left.updatePosition({
		x: 0,
		y: this.maxHeight/2 - left.height/2
	});
	right.updatePosition({
		x: left.width + this.maxWidth + margin*2,
		y: this.maxHeight/2 - left.height/2
	});
	for(var i = 1; i < this.content.length; i++) {
		if(this.content[i] instanceof Phaser.Text){
			this.content[i].x= content.x,
			this.content[i].y= this.maxHeight/2 - left.height/2
		continue;
	}
	else{
		this.content[i].updatePosition({
			x: left.width + margin,
			y: 0
		});
	}
	}
	
};

Slider.prototype.hide = function(){
	this.children.forEach(function(c){		
		if(c.hide){
			c.hide();
		}
		else{
			c.visible = false;
		}
	});
};

Slider.prototype.show = function(){
	this.leftArrow.show();
	this.rightArrow.show();
	if(this.content[0] instanceof Phaser.Text){
		this.content[0].visible = true;
		console.log('wewewew');
	}
	else{
	this.content[0].show();
	}
	this.count = 0;
	this.rightArrow.inputEnabled = true;
	this.leftArrow.inputEnabled = false;
};

Slider.prototype.addButtonContent = function(action,icon){
	var newBut = new Button({
		color: 'orange',
		size: 'huge',
		action: action,
		icon:icon,
		name: 'default',
		context: 'button',
		group: this
	});
	newBut.hide();
	this.content.push(newBut);
};
Slider.prototype.addTextContent = function (text) {
	var style = { font: this.options.font, fill: 'white', align: 'center' };
	var text = game.make.text(this.centerX, this.centerY, text, style);

	text.maxWidth = 100;
	this.add(text);
	this.content.push(text);
}

Slider.prototype.nextSlide = function(){
		
	if(this.count < this.content.length-1){
		if(!this.leftArrow.inputEnabled){
			this.leftArrow.inputEnabled = true;
		}
		if(this.currentContent instanceof Phaser.Text){
			this.currentContent.visible = false;
		}
		else{
			this.currentContent.hide();
		}
		if(this.nextContent instanceof Phaser.Text){
			this.nextContent.visible = true;
		}
		else{
			this.nextContent.show();
		}
		this.previousContent = this.currentContent;
		this.currentContent = this.nextContent;
		this.count++;
		this.nextContent = this.content[this.count+1];

	}
	else this.rightArrow.inputEnabled = false;

};

Slider.prototype.prevSlide = function(){
	if(this.count !== 0){
		if(!this.rightArrow.inputEnabled){
			this.rightArrow.inputEnabled = true;
		}
		if(this.currentContent instanceof Phaser.Text){
			this.currentContent.visible = false;
		}
		else{
			this.currentContent.hide();
		}
		if(this.previousContent instanceof Phaser.Text){
			this.previousContent.visible = true;
		}
		else{
			this.previousContent.show();
		}
		this.nextContent = this.currentContent;
		this.currentContent = this.previousContent;
		this.count--;
		if(this.count !== 0){
	    	this.previousContent = this.content[this.count-1];
		}
		else{
			this.previousContent = null;
		}
	}
	else this.leftArrow.inputEnabled = false;
};

Slider.prototype.changeBackground = function(name){
	if(skinManager.skin.name != name){
			skinManager.setSkin(name);
		}
};

Slider.prototype.cursorIsOver = function(){
	return this.leftArrow.cursorIsOver() || this.rightArrow.cursorIsOver() || this.currentContent.cursorIsOver && this.currentContent.cursorIsOver();
}