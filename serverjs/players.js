var utils = require('./utils')

var Player = function(remote, connid, name){
	this.id = 'player_' + utils.generateId();
	this.type = 'player';

	this.remote = remote;
	this.connid = connid;

	if(this.remote){
		this.remote.setId(this.id);
		this.connected = true;
	}

	this.name = name || this.id;

	this.game = null;
}

Player.prototype.meetOpponents = function(opponents){
	if(this.remote)
		this.remote.meetOpponents(opponents);
}

Player.prototype.recieveCards = function(cards, trumpSuit, numDiscarded){
	var action = {
		type: 'CARDS',
		cards: []
	}
	if(trumpSuit || trumpSuit === 0)
		action.trumpSuit = trumpSuit;

	if(numDiscarded || numDiscarded === 0)
		action.numDiscarded = numDiscarded;	

	for(var ci in cards){
		action.cards.push(cards[ci])
	}
	if(this.remote)
		this.remote.recieveAction(action);
}

Player.prototype.recieveDeals = function(deals){
	var action = {
		type: 'DRAW',
		cards: []
	}
	for(var ci in deals){
		action.cards.push(deals[ci])
	}
	if(this.remote)
		this.remote.recieveAction(action);
}

Player.prototype.recieveMinTrumpCards = function(cards, winner){
	var action = {
		type: 'TRUMP_CARDS',
		cards: cards,
		pid: winner
	}
	if(this.remote)
		this.remote.recieveAction(action);
}

Player.prototype.recieveValidActions = function(actions){
	if(this.remote)
		this.remote.recievePossibleActions(actions);
}

Player.prototype.recieveAction = function(action){
	if(this.remote)
		this.remote.recieveAction(action);
}

Player.prototype.recieveNotification = function(note, actions){
	if(this.remote)
		this.remote.recieveNotification(note, actions);
}

Player.prototype.handleLateness = function(){
	if(this.remote)
		this.remote.handleLateness();
}

Player.prototype.sendResponse = function(action){
	if(!this.game){
		utils.log(this.id, 'No game has been assigned');
		return
	}
	this.game.recieveResponse(this, action ? action : null);
}

exports.Player = Player;