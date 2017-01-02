var utils = require('../serverjs/utils')
var randomNames = ['Lynda','Eldridge','Shanita','Mickie','Eileen','Hiedi','Shavonne','Leola','Arlena','Marilynn','Shawnna','Alanna','Armando','Julieann','Alyson','Rutha','Wilber','Marty','Tyrone','Mammie','Shalon','Faith','Mi','Denese','Flora','Josphine','Christa','Sharonda','Sofia','Collene','Marlyn','Herma','Mac','Marybelle','Casimira','Nicholle','Ervin','Evia','Noriko','Yung','Devona','Kenny','Aliza','Stacey','Toni','Brigette','Lorri','Bernetta','Sonja','Margaretta'];
var fakeDescisionTimer = 1000;

var Player = function(remote){
	this.id = 'player_' + utils.generateID();
	this.type = 'player';

	this.remote = remote;

	this.opponents = [];

	var nameIndex = Math.floor(Math.random()*randomNames.length);
	this.name = randomNames[nameIndex];
	randomNames.splice(nameIndex,1);

	this.hands = {};
	this.hands[this.id] = []

	this.deck = [];
	this.cards = {};

	this.field = {};

	for (var i = 0; i <= 6; i++) {
		this.field['FIELD'+i] = {
			attack: null,
			defense: null
		}
	}

	this.game = null;
}

Player.prototype.meetOpponents = function(opponents){
	for (var opponentN in opponents) {
		var opponent = opponents[opponentN];
		if(opponent.id == this.id) 
			continue;
		this.hands[opponent.id] = [];
	}
}

Player.prototype.recieveDeck = function(deck){
	for(var ci in deck){
		var card = deck[ci];
		this.cards[card.id] = card;
		this.deck.push(this.cards[card.id]);	
	}
	this.trumpSuit = this.deck[this.deck.length - 1].suit;
}

Player.prototype.recieveCards = function(deals){
	for (var dealN in deals) {
		var deal = deals[dealN];
		//var cardIndexInDeck = this.deck.map( (card) => {return card.id} ).indexOf(deal.cid);
		//~cardIndexInDeck && this.deck.splice(cardIndexInDeck, 1);
		this.deck.shift();
		this.cards[deal.cid].value = deal.value || null;
		this.cards[deal.cid].suit = deal.suit || null;
		this.cards[deal.cid].position = deal.pid;
		this.hands[deal.pid].push(deal.cid);
	}
	if(this.remote)
		this.remote.recieveCards(deals);
	//this.logState();
	setTimeout(() => {this.sendResponse()},Math.random()*fakeDescisionTimer)
}

Player.prototype.recieveMinTrumpCards = function(cards, winner){
	setTimeout(() => {this.sendResponse()},Math.random()*fakeDescisionTimer)
}

Player.prototype.recieveValidActions = function(actions){
	var randomIndex
	if(actions.length > 1 && (actions[actions.length - 1].type == 'TAKE' || actions[actions.length - 1].type == 'SKIP'))
		randomIndex = Math.floor(Math.random()*(actions.length-1))
	else
		randomIndex = Math.floor(Math.random()*actions.length);
	var action = actions[randomIndex];
	this.sendResponse(action);
}

Player.prototype.recieveAction = function(pid, action){
	if(this.remote)
		this.remote.recieveAction(pid, action);
	setTimeout(() => {this.sendResponse()},Math.random()*fakeDescisionTimer)
}

Player.prototype.handleLateness = function(){

}

Player.prototype.sendResponse = function(action){
	if(!this.game){
		utils.log(this.id, 'No game has been assigned');
		return
	}
	this.game.recieveResponse(this, action ? action : null);
}

Player.prototype.logState = function(){
	utils.log('\n', this.id);

	utils.log('Deck');
	this.deck.map( (card) => utils.log(card) )
	utils.log('Hand');
	this.hands[this.id].map( (cid) => utils.log(this.cards[cid]) )

	utils.log('\nAll cards');
	for(var cid in this.cards){
		if(this.cards.hasOwnProperty(cid)){
			var card = this.cards[cid];
			var value = card.value;
			var suit = card.suit;
			utils.log(cid, value, suit, card.position);
		}
	}
}

exports.Player = Player;