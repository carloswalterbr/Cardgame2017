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

	this.slideElements = [];
	this.slidesByName = {};
	this.content = [];
	this.addContent(this.changeBackground.bind(this,'modern'),'blue');
	this.addContent(this.changeBackground.bind(this,'uno'),'green');
	this.addContent(this.changeBackground.bind(this,'classic'),'wood');

	this.count = 0;
	this.previousContent = null;
	this.currentContent = this.content[this.count];
	this.nextContent = this.content[this.count+1];

	var rightArrow = new Button({

		color: 'orange',
		size: 'left',
		action: this.nextSlide.bind(this),
		text: '',
		name: 'rightArrow',
		group: this
	});

	var leftArrow = new Button({
	
		color: 'orange',
		size: 'right',
		action: this.prevSlide.bind(this),
		text: '',
		name: 'leftArrow',
		group: this
	});
	this.slideElements.push(this.content[0]);
	this.slideElements.push(leftArrow);
	this.slideElements.push(rightArrow);
	
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
	var center = this.slideElements[0];
	var left = this.slideElements[1];
	var right = this.slideElements[2];
	var margin = this.options.margin;

	center.updatePosition({
		x: left.width + margin,
		y: 0
	});
	left.updatePosition({
		x: 0,
		y: content.height/2 - left.height/2
	});
	right.updatePosition({
		x: left.width + center.width + margin*2,
		y: content.height/2 - left.height/2
	});
	for(var i = 1; i < this.content.length; i++) {
		this.content[i].updatePosition({
			x: center.x,
			y: center.y
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
	for(var i = 0; i<this.slideElements.length;i++){
		this.slideElements[i].show();
	}
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
		this.currentContent.hide();
		this.nextContent.show();
		this.previousContent = this.currentContent;
		this.currentContent = this.nextContent;
		this.count++;
		this.nextContent = this.content[this.count+1];
	}
};

Slider.prototype.prevSlide = function(){
	if(this.count !== 0){
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
};

Slider.prototype.changeBackground = function(name){
	if(skinManager.skin.name != name){
			skinManager.setSkin(name);
		}
};
