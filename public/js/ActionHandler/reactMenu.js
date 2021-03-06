/* exported reactMenu */
var reactMenu = {

	QUEUE_LIST: function(action){
		ui.menus.browser.recieveList(action);
	},

	QUEUE_INACTIVE: function(){
		ui.feed.newMessage('Failed to join game', 2000);
		ui.menus.browser.refresh();
		game.clearLocationHash();
	},

	QUEUE_FULL: function(){
		ui.feed.newMessage('Game already started', 2000);
		ui.menus.browser.refresh();
		game.clearLocationHash();
	},

	QUEUE_INVALID: function(){
		ui.feed.newMessage('Invalid game settings', 2000);
		ui.menus.creator.fadeIn();
	}
};