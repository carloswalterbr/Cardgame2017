var server;
var isInDebugMode = true;

var EurecaClientSetup = function() {
	//create an instance of eureca.io client

	var client = new Eureca.Client();
	
	client.ready(function (proxy) {		
		server = proxy;
		create();
	});
	
	
	//methods defined under "exports" namespace become available in the server side
	
	client.exports.setId = function(id) 
	{
		window.myId = id;
	}	
	client.exports.meetOpponents = function(opponents){
		//console.log(opponents);
		//for(var oi in opponents){
		//	new Card(opponents[oi].id);
		//}
		
	}
	client.exports.recievePossibleActions = function(actions){		
		if(isInDebugMode)
			console.log(actions)
	}
	client.exports.recieveAction = function(action){
		if(action.type == 'CARDS'){
			for(var cid in cards){
				if(cards.hasOwnProperty(cid)){
					cards[cid].base.removeAll(true);
				}
			}
			cards = {};
			cardsGroup.removeAll(true);
		}		
		if(action.cid){
			if(cards[action.cid]){
				cards[action.cid].setValue(action.suit, action.value);
				//cardsGroup.align(Math.floor(screenWidth / cards[action.cid].sprite.width), -1, cards[action.cid].sprite.width, cards[action.cid].sprite.height);
				cards[action.cid].glow.visible = action.suit || action.suit === 0;
				cards[action.cid].glowOff.start()
				cardsGroup.bringToTop(cards[action.cid].base)
			}
			else{
				var options = {
					id: action.cid,
					suit: action.suit,
					value: action.value
				}
				cards[action.cid] = new Card(options);
			}
		}
		else if(action.cards){
			for(var ci in action.cards){
				var c = action.cards[ci];
				if(cards[c.cid]){
					cards[c.cid].setValue(c.suit, c.value);
					//cardsGroup.align(Math.floor(screenWidth / cards[c.cid].sprite.width), -1, cards[c.cid].sprite.width, cards[c.cid].sprite.height);
					cards[c.cid].glow.visible = c.suit || c.suit === 0;
					cards[c.cid].glowOff.start()
					cardsGroup.bringToTop(cards[c.cid].base)
				}
				else{
					var options = {
						id: c.cid,
						suit: c.suit,
						value: c.value
					}
					cards[c.cid] = new Card(options);
				}
			}
			if(action.numDiscarded){
				for (var i = 0; i < action.numDiscarded; i++) {
					var id = 'discarded_'+i;
					var options = {
						id: id
					}
					cards[id] = new Card(options);
				}
			}
			if(action.type == 'CARDS')
				cardsGroup.align(Math.floor(screenWidth / 170), -1, 170, 220, Phaser.CENTER);
		}
		else if(action.type == 'DISCARD'){
			for(var i in action.ids){
				var cid = action.ids[i];
				if(cards[cid]){
					cards[cid].kill();
					delete cards[cid];
				}
			}
		} 
		else if(action.type == 'TAKE' && action.ids){
			for(var i in action.ids){
				var cid = action.ids[i];
				if(cards[cid]){
					cards[cid].setValue(null,0);
				}
			}
		}
		if(isInDebugMode)
			console.log(action)
	}
	client.exports.recieveNotification = function(note, actions){
		if(isInDebugMode)
			console.log(note, actions)
	}
	client.exports.handleLateness = function(){
		if(isInDebugMode)
			console.log('Too late');
	}
	return client;
}