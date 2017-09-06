var Slider =function(options) {
	this.options = this.getDefaultOptions();
 
    for(var o in options){ 
        if(options.hasOwnProperty(o) && options[o] !== undefined) 
            this.options[o] = options[o]; 
    } 
	
	this.slideElements = [];
	this.slidesByName = {};
	this.content =[];
	this.group = game.add.group();
	//this.group.add(leftArrow);
	//this.group.add(rightArrow);
	//this.group.children;// все твои элементы
	var center = new Button({
	
			color: 'orange',
			size: 'huge',
			action: function(){
				
			},
			icon:'blue',
			name: 'CenterOfSlide',
			group: options.menu.base
		});

	this.content.push(center);
	this.addContent(function(){},'green');
	this.addContent( this.changeBackground('modern'),'wood');

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
			group: options.menu.base
		});

		var leftArrow = new Button({
		
			color: 'orange',
			size: 'right',
			action: this.prevSlide.bind(this),
			text: '',
			name: 'leftArrow',
			group: options.menu.base
		});
	this.slideElements.push(center);
	this.slideElements.push(leftArrow);
	this.slideElements.push(rightArrow);
	
	Phaser.Group.call(this, game, null, this.options.name);
}

Slider.prototype = Object.create(Phaser.Group.prototype);
Slider.prototype.constructor = Slider;

Slider.prototype.getDefaultOptions = function(){
	return {
		position: {
			x: 0,
			y: 0,
			alpha:0.5
		},
		margin: 60,
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
	console.log('[r[r[[r[rr[');
	this.x = position.x;
	this.y = position.y;

	this.slideElements[0].updatePosition({x: this.options.menu.background.width/2 -this.slideElements[0].width/2 ,y:this.y});
	this.slideElements[1].updatePosition({x: this.slideElements[0].x - this.options.margin ,y: this.y + this.slideElements[1].height });
	this.slideElements[2].updatePosition({x: this.slideElements[0].x + this.slideElements[0].width+20 ,y: this.y + this.slideElements[1].height });
	this.defaultPosition = this.slideElements[0].position;
	for(var i = 1; i <this.content.length; i++) {
		this.content[i].updatePosition({x: this.options.menu.background.width/2 -this.slideElements[0].width/2 ,y:this.y});
	};
	//this.slideElements[0].updatePosition({x: this.options.menu.background.width/2 -this.slideElements[0].width/2 ,y:this.y});
}	

Slider.prototype.hide = function(){
	for(var i = 0; i<this.slideElements.length;i++){
		this.slideElements[i].hide();
		if(this.content[i]) this.content[i].hide();
	}
} 
Slider.prototype.show = function(){
	for(var i = 0; i<this.slideElements.length;i++){
		this.slideElements[i].show();

	}
	this.content[0].show();
	this.count = 0;
} 
Slider.prototype.addContent = function(action,icon){
var newBut = new Button({
	position:{
	x: this.options.menu.background.width/2,
	y:this.y},
			color: 'orange',
			size: 'huge',
			action: action,
			icon:icon,
			name: 'default',
			group: this.options.menu.base
		});
newBut.hide();
this.content.push(newBut);
}
Slider.prototype.nextSlide = function(){
		
		if(this.count <this.content.length-1){
		this.currentContent.hide();
		this.nextContent.show();
		this.previousContent = this.currentContent;
		this.currentContent = this.nextContent;
		this.count++;
	    this.nextContent = this.content[this.count+1];
	}
}
Slider.prototype.prevSlide = function(){
	if(this.count!=0){
		this.currentContent.hide();
		this.previousContent.show();
		this.nextContent = this.currentContent;
		this.currentContent = this.previousContent;
		this.count--;
		if(this.count != 0)
	    this.previousContent = this.content[this.count-1];
		else this.previousContent = null;
	}
}
Slider.prototype.changeBackground = function(name){
 if(skinManager.skin.name != name){
			skinManager.setSkin(name);
		}
}