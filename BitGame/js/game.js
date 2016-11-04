
function random_number_gen(min, max){
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function random_card_gen() {
	cards = Card().cards;
	num = random_number_gen(0, 7);
	for( var in cards ){
		if( num == 0 )
			return var;
		num -= 1;	
	}
}

function random_cache_gen(){
	var cache = [];
	for( i = 0; i < 5; i++){
		// check code here : access enum elements
		cache.push( random_card_gen());
	}
	return cache;
}

class Game {
	constructor() {
		this.player = new Player();
		this.comp = new Computer();
		this.turn = 0;
		this.cards = Card().cards;
	}

	play(card, index){

		if( card == this.cards.SWAP) {
			p = player.num & (1 << index);
			c = comp.num & (1 << index);
			if( p != c ) {
				if ( p != 0 ){
					this.player.num &= c;
					this.comp.num |= p;
				} else {
					this.player.num |= c;
					this.comp.num &= p;
				}
			}
		} else if ( card == this.cards.REVERSE ) {
			p = 0;
			c = 0;
			for( i = 0; i < 8; i++) {
				c *= 2;
				p *= 2;
				c |= (c&1);
				p |= (p&1);
				p /= 2;
				c /= 2;
			}
			this.player.num = p;
			this.comp.num = c;
		} else if ( card == this.cards.FLIP ) {
			p = 0;
			c = 0;
			for( i = 0; i < 8; i++) {
				if( !( this.player.num & ( 1 << i )) ){
					this.player.num |= ( 1 << i );
				} else {
					this.player.num -= ( 1 << i );
				}
				if( !( this.comp.num & ( 1 << i )) ){
					this.comp.num |= ( 1 << i );
				} else {
					this.comp.num -= ( 1 << i );
				}
			}
		} else if ( card == this.cards.SET ) {
			this.player.num |= ( 1 << index );
			this.comp.num |= ( 1 << index );
		} else if ( card == this.cards.UNSET ) {
			if( this.player.num & ( 1 << i )) {
				this.player.num -= ( 1 << i );
			}
			if( this.comp.num & ( 1 << i )) {
				this.comp.num -= ( 1 << i );
			}
		} else if( card == this.cards.XOR ){
			if( this.turn == 1 ) {
				this.player.num ^=	this.comp.num;			
			} else {
				this.comp.num ^=	this.player.num;
			}
		} else if( card == this.cards.AND ){
			if( this.turn == 1 ) {
				this.player.num &=	this.comp.num;
			} else {
				this.comp.num &=	this.player.num;	
			}
		} else if( card == this.cards.OR ){
			if( this.turn == 1 ) {
				this.player.num |=	this.comp.num;
			} else {
				this.comp.num |=	this.player.num;				
			}
		}

		this.turn ^= 1;
		
		if( this.player.num == this.player.goal )
			// player wins !!!
		if ( this.comp.num == this.comp.goal )
			// comp wins !!!

		this.update();
	}

	// change numbers, also pick a new card for the next player by delay of 5 secs or so :)
	update() {
		/// update the stand
		// pick a card from deck
		// if players turn return
		// if comp turn call its think
		if ( this.turn == 1 ) {
			think = this.comp.think(this.player.num);
			this.play(think[0], think[1]);
		}
	}
}

class Player {
	constructor(){ 
		this.cache = random_cache_gen();
		this.num = random_number_gen(0, 255);
		this.goal = random_number_gen(0, 255);
		while( this.goal == this.num ) {
			this.cur = random_number_gen(0, 255);
		}
	}

	// write a on click function for this
	choose(){
		// redirect it to play function with card and index, redundant function can remove
		// compare curr num with final num if same end game :D
	}
}

class Card {
	constructor() {
		this.cards = { FLIP, REVERSE, XOR, AND, OR, SET, SWAP, UNSET };
	}

}

class Computer extends Player {

	think( num) {
		min = 0;
		cards = Card().cards;
		card = 0;
		temp = 0;
		
		if ( this.cache.includes ( cards.XOR ))	{
			temp = 0;
			ans = num ^ this.num;
			for( i = 0; i < 8; i++) {
				if( ( (1 << i ) & this.goal) ) {
					if ( ans & (1 << i ) ) {
						temp++;
					}
				} else if ( ans & (1 << i )  == 0 ) {
					temp++;
				}
			}
			if ( temp > min ) {
				min = temp;
				card = cards.XOR;
			}
		}

		if ( this.cache.includes ( cards.OR ))	{
			temp = 0;
			ans = num | this.num;			
			for( i = 0; i < 8; i++) {
				if( ( (1 << i ) & this.goal) ) {
					if ( ans & (1 << i ) ) {
						temp++;
					}
				} else if ( ans & (1 << i )  == 0 ) {
					temp++;
				}
			}
			if ( temp > min ) {
				min = temp;
				card = cards.XOR;
			}
		}

		if ( this.cache.includes ( cards.AND ))	{
			temp = 0;
			ans = num & this.num;			
			for( i = 0; i < 8; i++) {
				if( ( (1 << i ) & this.goal) ) {
					if ( ans & (1 << i ) ) {
						temp++;
					}
				} else if ( ans & (1 << i )  == 0 ) {
					temp++;
				}
			}
			if ( temp > min ) {
				min = temp;
				card = cards.XOR;
			}
		}
		

		index = 0;
		temp = 1;

		temp_index = -1;
		temp_unset = -1;

		for( i = 0; i < 8; i++){
			if( ( (1 << i ) & this.goal) ) {
				if ( this.num & (1 << i ) ) {
					temp++;
				} else {
					temp_set = i;
				}
			} else if ( ans & (1 << i )  == 0 ) {
				temp++;
			} else {
				temp_unset = i;
			}
		}


		if( this.cache.includes ( cards.SWAP )  )	{
			if( temp > min ) {
				min = temp;
				card = cards.SWAP;
				index = temp_index;
			}
		}

		if ( this.cache.includes( cards.SET) && temp_set != -1 ) {
			if( temp > min ) {
				min = temp;
				card = cards.SET;
				index = temp_set;
			}	
		} 
		
		if ( this.cache.includes( cards.UNSET) && temp_unset != -1 ) {
			if( temp > min ) {
				min = temp;
				card = cards.UNSET;
				index = temp_unset;
			}	
		} 

		if( this.cache.includes(cards.FLIP)) {
			temp = 0;
			for( i = 0; i < 8; i++){
				if( ( (1 << i ) & this.goal) ) {
					if ( !(this.num & (1 << i )) ) {
						temp++;
					}
				} else if ( this.num & (1 << i )  != 0 ) {
					temp++;
				}
			}

			if( temp > min ) {
				min = temp;
				card = cards.FLIP;
			}
		}

		if( this.cache.includes(cards.REVERSE)) {
			temp = 0;
			p = 0;
			for( i = 0; i < 8; i++) {
				p *= 2;
				p |= (p&1);
				p /= 2;
			}

			for( i = 0; i < 8; i++ ){
				if( ( (1 << i ) & this.goal) ) {
					if ( p & (1 << i )) {
						temp++;
					}
				} else if ( p & (1 << i ) == 0 ) {
					temp++;
				}
			}

			if( temp > min ) {
				min = temp;
				card = cards.REVERSE;
			}
		}
		return [card, index];
	}
}
