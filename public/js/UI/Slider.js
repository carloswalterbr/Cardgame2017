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
			//icon:'green',
			name: 'CenterOfSlide',
			group: options.menu.base
		});
	this.content.push(center);
	this.addContent(function(){ 
		console.log('sdsdsds');
		this.hide();});
	var currentContent = this.content[0]
	var right = new Button({

			color: 'orange',
			size: 'left',
			action: function(){
						var mover = game.add.tween(currentContent);
								mover.to({			
								x: left.position.x,
								y: left.position.y-left.height,
								alpha:0
								}, 1000);
						var nextSlide =this.checkForNextSlide();
						
						
						var mover2 = game.add.tween(nextSlide)
							mover.to({			
								x:defX,
								y: this.position.y-this.height,
								alpha:1
								}, 1000);
								mover.start();
								mover2.start();
								},
			text: '',
			name: name,
			group: options.menu.base
		});
		var left = new Button({
		
			color: 'orange',
			size: 'right',
			action: function(){
						var mover = game.add.tween(center);
							if (center.alpha ===1){
								mover.to({			
								x: left.position.x,
								y: left.position.y-left.height,
								alpha:0
								}, 1000);
							}
							if (center.alpha ===0){
								mover.to({			
								x:defX,
								y: this.position.y-this.height,
								alpha:1
								}, 1000);
							}

								mover.start();
								},
			text: '',
			name: 'name',
			group: options.menu.base
		});
	this.slideElements.push(center);
	this.slideElements.push(left);
	this.slideElements.push(right);
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
this.checkForNextSlide = function(){
	var next;
	for(var i = 0; i <this.content.length-1; i++)
							if (this.content[i] === currentContent){
								next = this.content[i+1];
								break;
							}
							return next;
}
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