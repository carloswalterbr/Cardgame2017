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
	this.addContent(this.changeBackground.bind(this,'modern'),'blue');
	this.addContent(this.changeBackground.bind(this,'uno'),'green');
	this.addContent(this.changeBackground.bind(this,'classic'),'wood');

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
		icon:null
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

	content.updatePosition({
		x: left.width + margin,
		y: 0
	});
	left.updatePosition({
		x: 0,
		y: content.height/2 - left.height/2
	});
	right.updatePosition({
		x: left.width + content.width + margin*2,
		y: content.height/2 - left.height/2
	});
	for(var i = 1; i < this.content.length; i++) {
		this.content[i].updatePosition({
			x: content.x,
			y: content.y
		});
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
	this.content[0].show();
	this.count = 0;
};

Slider.prototype.addContent = function(action,icon){
	var newBut = new Button({
		color: 'orange',
		size: 'huge',
		action: action,
		icon:icon,
		name: 'default',
		group: this
	});
	newBut.hide();
	this.content.push(newBut);
};

Slider.prototype.nextSlide = function(){
		
	if(this.count < this.content.length-1){
		this.leftArrow.enable();
		this.currentContent.hide();
		this.nextContent.show();
		this.previousContent = this.currentContent;
		this.currentContent = this.nextContent;
		this.count++;
		this.nextContent = this.content[this.count+1];

	}
	else{
		this.rightArrow.disable();
	}

};

Slider.prototype.prevSlide = function(){
	if(this.count !== 0){
		this.rightArrow.enable();
		this.currentContent.hide();
		this.previousContent.show();
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
	else{
		this.leftArrow.disable();
	}
};

Slider.prototype.changeBackground = function(name){
	if(skinManager.skin.name != name){
			skinManager.setSkin(name);
		}
};

Slider.prototype.cursorIsOver = function(){
	return this.leftArrow.cursorIsOver() || this.rightArrow.cursorIsOver() || this.currentContent.cursorIsOver && this.currentContent.cursorIsOver();
}