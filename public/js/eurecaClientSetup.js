var server;

var EurecaClientSetup = function() {
	//create an instance of eureca.io client

	var client = new Eureca.Client();
	
	client.ready(function (proxy) {		
		server = proxy;
	});
	
	
	//methods defined under "exports" namespace become available in the server side
	
	client.exports.setId = function(id) 
	{
		window.myId = id;
		create();
	}	
	client.exports.meetOpponents = function(opponents){
		console.log(opponents);
		//for(var oi in opponents){
		//	new Card(opponents[oi].id);
		//}
		
	}
	client.exports.recievePossibleActions = function(actions){		
		console.log(actions)
	}
	client.exports.recieveAction = function(action){		
		if(action.cid){
			if(cards[action.cid]){
				cards[action.cid].setValue(action.suit, action.value);
				cardsGroup.align(Math.floor(screenWidth / cards[action.cid].sprite.width), -1, cards[action.cid].sprite.width, cards[action.cid].sprite.height);
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
					cardsGroup.align(Math.floor(screenWidth / cards[c.cid].sprite.width), -1, cards[c.cid].sprite.width, cards[c.cid].sprite.height);
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
		console.log(action)
	}
	client.exports.handleLateness = function(){
		console.log('Too late');
	}
}
