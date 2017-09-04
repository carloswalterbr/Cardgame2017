var Slider =function(options) {
	this.options = this.getDefaultOptions();
	for(var o in options){
		if(options.hasOwnProperty(o) && options[o] !== undefined)
			this.options[o] = options[o];
	}
	this.slideElements = [];
	this.slidesByName = {};
	this.content =[];
	
	var center = new Button({
	
			color: 'orange',
			size: 'huge',
			action: function(){
				this.hide();
			},
			icon:'green',
			name: 'CenterOfSlide',
			group: options.menu.base
		});

	this.content.push(center);

	this.addContent(function(){ 
		console.log('sdsdsds');
		this.hide();},'menu');
	this.count = 1;
	this.previousContent = null;
	this.currentContent = this.content[this.count-1];
	this.nextContent = this.content[this.count];
	var rightArrow = new Button({

			color: 'orange',
			size: 'left',
			action: this.nextSlide.bind(this),
			text: '',
			name: name,
			group: options.menu.base
		});
		var leftArrow = new Button({
		
			color: 'orange',
			size: 'right',
			action: function(){},
			text: '',
			name: 'name',
			group: options.menu.base
		});
	this.slideElements.push(center);
	this.slideElements.push(leftArrow);
	this.slideElements.push(rightArrow);
	this.content.push(center);
	this.width = this.slideElements[0].width;
	this.height = this.slideElements[0].height;
	for (var i = 1; i < this.slideElements.length; i++) {
		if(this.slideElements[i].height > this.height) {
			this.height = this.slideElements[i].height;
		}
		this.width +=this.slideElements[i].width+this.margin;
	}
	var defX = this.options.menu.background.width/2 -this.slideElements[0].width/2;



}

Slider.prototype.getDefaultOptions = function(){
	return {
		position: {
			x: 0,
			y: 0,
			alpha:0.5
		},
		margin: 60,
		name: 'default',
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
		this.content[i].updatePosition({x: this.slideElements[0].x + this.slideElements[0].width+20 ,y: this.y});
	};
	this.slideElements[0].updatePosition({x: this.options.menu.background.width/2 -this.slideElements[0].width/2 ,y:this.y});
}	

Slider.prototype.hide = function(){
	for(var i = 0; i<this.slideElements.length;i++){
		this.slideElements[i].hide();
	}
} 
Slider.prototype.show = function(){
	for(var i = 0; i<this.slideElements.length;i++){
		this.slideElements[i].show();
	}
} 
Slider.prototype.addContent = function(action,icon){
var newBut = new Button({
			position:{
				x:this.x,
				y:this.y
			},
			color: 'orange',
			size: 'huge',
			action: action,
			icon:icon,
			name: 'default',
			group: this.options.menu.base
		});
newBut.visible = false;
this.content.push(newBut);
}
Slider.prototype.nextSlide = function(){
		this.currentContent.visible = false;
		this.nextContent.visible = true;
		this.previousContent = this.currentContent;
		this.currentContent = this.nextContent;
		if(this.content.length<count-1){
			this.nextContent = null;
		}
		else this.nextContent = this.content[count++];
}
this.prevSlide = function(){
							
}