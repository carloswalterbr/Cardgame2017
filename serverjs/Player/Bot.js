/*
	Серверные боты
*/

'use strict';

const
	generateId = require('../generateId'),
	Log = require('../logger'),
	Player = require('./Player');


class Bot extends Player{
	constructor(randomNames){
		super(null, null, null, false);
		this.id = 'bot_' + generateId();
		this.log = Log(module, this.id);
		this.type = 'bot';
		this.connected = true;

		let nameIndex = Math.floor(Math.random()*randomNames.length);
		if(randomNames.length){
			this.name = randomNames[nameIndex];
			randomNames.splice(nameIndex,1);
		}
		else{
			this.name = this.id;
		}
	}

	getDescisionTime(){
		if(!this.game){
			return 0;
		}
		let fakeTime = 1,
			minTime = this.game.fakeDescisionTimer || 0;
		return Math.random()*fakeTime + minTime;
	}

	recieveGameInfo(info){
		if(!info.noResponse){
			this.sendDelayedResponse();
		}
	}

	recieveDeals(deals){
		this.sendDelayedResponse();
	}

	recieveValidActions(actions){
		setTimeout(() => {  
            console.log(actions);
            this.sendResponse(this.chooseBestAction(actions));
		}, this.getDescisionTime());
	}

	recieveCompleteAction(action){
		if(!action.noResponse){
			this.sendDelayedResponse();
		}
	}

	recieveNotification(action){
		if(action.actions){
			var ai = (this.game && this.game.isTest || this.queue && this.queue.type == 'botmatch') ? 0 : 1;
			this.sendDelayedResponse(action.actions[ai]);
		}			
	}

	sendDelayedResponse(action){
		setTimeout(() => {
			this.sendResponse(action);
		}, this.getDescisionTime());
	}
    
    chooseBestAction(actions){
        /**
        * Метод, возвращающий наиболее выгодное для бота действие.
        */  
        if (this.defineGameStage() === 'EARLY_GAME'){
                return this.chooseEarlyGameAction(actions);
        }
        
        return this.chooseEarlyGameAction(actions);
    }
    
    chooseEarlyGameAction(actions){
        let transferAction = this.findTransferAction(actions);
        
        if ((transferAction) && this.isTransferBeneficial('EARLY_GAME', transferAction)){
            return transferAction;
        }
        
        let lowestCardAction = this.findLowestCardAction(actions);
        
        switch (this.defineTurnType(actions)){
            case 'ATTACK':
                return lowestCardAction;
            
            case 'SUPPORT':
                if (lowestCardAction){
                    if ((lowestCardAction.cvalue < 11) && (lowestCardAction.csuit !== this.game.cards.trumpSuit)){
                        return lowestCardAction;
                    }
                }
                
                return this.findPassAction(actions);
                
            case 'DEFENSE':
                if (lowestCardAction){
                    return lowestCardAction;
                }
                
                return this.findTakeAction(actions);
        }
    }

    chooseLateGameAction(actions){
        let transferAction = this.findTransferAction(actions);
        
        if ((transferAction) && this.isTransferBeneficial('EARLY_GAME', transferAction)){
            return transferAction;
        }
        
        switch (this.defineActionType(actions)){
            case 'ATTACK':
            
            case 'SUPPORT':
                
            case 'DEFENSE':
        }
    }
    
    findLowestCardAction(actions){
        /** 
        * Метод, возврающий наименьшую карту из тех, которыми можно походить.
        */  
        var lowestCardAction = {
            cvalue: Infinity
        };
    
        for (let i = 0; i < actions.length; i++){
            if ((actions.type === 'TAKE') || (actions.type === 'TRANSFER') 
                || (actions.type === 'PASS')){
                continue;
            }
                
            
            if (actions[i].cvalue < lowestCardAction.cvalue){
                /**
                * Если текущая карта меньше минимальной, то делаем текущую минимальной, если:
                * Минимальная карта козырная или
                * Минимальная и текущая карты не козырные
                */
                lowestCardAction = (lowestCardAction.cvalue === Infinity) ? actions[i] : 
                (lowestCardAction.csuit === this.game.cards.trumpSuit) ? actions[i] :
                (actions[i].csuit === this.game.cards.trumpSuit) ? lowestCardAction : actions[i];
            }
        }
                
        if (lowestCardAction.cvalue !== Infinity){
            /**
            * Если наиболее выгодное действие было найдено, 
            * то метод возвращает его
            */
            return lowestCardAction;
        }
    }
    
    findTransferAction(actions){
        /**
        * Метод, возвращающий действие типа 'TRANSFER', если такое есть. Иначе возвращается undefined.
        */
        for (let i = 0; i < actions.length; i++){
            if (actions[i].type === 'TRANSFER'){
                return actions[i];
            }
        }
    }
    
    findPassAction(actions){
       /**
        * Метод, возвращающий действие типа 'PASS', если такое есть. Иначе возвращается undefined.
        */
        for (let i = 0; i < actions.length; i++){
            if (actions[i].type === 'PASS'){
                return actions[i];
            }
        } 
    }
    
    findTakeAction(actions){
        /**
        * Метод, возвращающий действие типа 'TAKE', если такое есть. Иначе возвращается undefined.
        */
        for (let i = 0; i < actions.length; i++){
            if (actions[i].type === 'TAKE'){
                return actions[i];
            }
        } 
    }
    
    defineTurnType(actions){
        /**
        * Метод, определяющий тип действия, которое нужно совершить боту.
        */
        if ((actions[0].type === 'DEFENSE') || (actions[0].type === 'TAKE')){
            return 'DEFENSE';
        }
        
        for (let i = 0; i < actions.length; i++){
            if (actions[i].type === 'PASS'){
                return 'SUPPORT';
            }
        }
        return 'ATTACK';
    }
    
    defineGameStage(){
        /**
        * Метод, определяющий стадию игры.
        */
        let gameStages = ['EARLY_GAME', 'END_GAME'];
        
        if (this.game.deck.length < 10){
            return gameStages[1];
        }
        
        return gameStages[0];
    }
    
    findAllCardsOnTheTable(){
        /**
        * Метод, возвращающий все карты на столе.
        */
        let cards = [];
        
        for (let i = 0; i < this.game.table.length; i++){
            if (this.game.table[i].attack !== null){
                cards.push(this.game.table[i].attack);
            }
            
            if (this.game.table[i].defense !== null){
                cards.push(this.game.table[i].defense);
            }
        }
        
        return cards;
    }
    
    findAttackCardsOnTheTable(){
        /**
        * Метод, возвращающий карты атакующих на столе.
        */
        let cards = [];
        
        for (let i = 0; i < this.game.table.length; i++){
            if (this.game.table[i].attack !== null){
                cards.push(this.game.table[i].attack);
            }
        }
        
        return cards;
    }
    
    findDefenseCardsOnTheTable(){
        /**
        * Метод, возвращающий карты защищающегося на столе.
        */
        let cards = [];
        
        for (let i = 0; i < this.game.table.length; i++){
            if (this.game.table[i].defense !== null){
                cards.push(this.game.table[i].defense);
            }
        }
        
        return cards;
    }
    
    isTransferBeneficial(gameStage, transferAction){
        /**
        * Метод, определяющий эффективность перевода.
        */
        
        /**
        * В начале игры перевод выгоден, если бот не переводит козырем или козырем, меньшем 5.
        */
        if ((gameStage === 'EARLY_GAME') && ((transferAction.csuit !== this.game.cards.trumpSuit) || (transferAction.cvalue < 5))){
            return true;
        }
        
        /**
        * В конце игры перевод выгоден, если бот не переводит козырем или козырем, меньшем J.
        */
        if ((gameStage === 'END_GAME') && ((transferAction.csuit !== this.game.cards.trumpSuit) || (transferAction.cvalue < 11) ) ){
            return true;
        }
        
        return false;
    }

}

module.exports = Bot;