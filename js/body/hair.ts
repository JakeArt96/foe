
import { BodyPart } from './bodypart';
import { Stat } from '../stat';
import { RaceDesc } from './race';
import { Color } from './color';

export enum HairStyle {
	straight = 0,
	wavy     = 1,
	ponytail = 2,
	shaggy   = 3,
	curly    = 4,
	braid    = 5
};

export class Hair extends BodyPart {
	length : Stat;
	style : HairStyle;

	constructor(color : Color) {
		super(null, color);
		this.length = new Stat(5);
		this.style = HairStyle.straight;
	}
	
	ToStorage() {
		var storage = {
			race  : this.race.id.toFixed(),
			col   : this.color.toFixed(),
			len   : this.length.base.toFixed(2),
			style : this.style.toFixed()
		};
		return storage;
	}

	FromStorage(storage : any) {
		storage = storage || {};
		this.race        = (storage.race === undefined) ? this.race : RaceDesc.IdToRace[parseInt(storage.race)];
		this.color       = (storage.col === undefined) ? this.color : parseInt(storage.col);
		this.length.base = (storage.len === undefined) ? this.length.base : parseInt(storage.len);
		this.style       = (storage.style === undefined) ? this.style : parseInt(storage.style);
	}

	// TODO: Length and style
	Bald() {
		return this.length.Get() == 0;
	}
	IsLong() {
		return this.length.Get() >= 10;
	}
	IsLongerThan(x : number) {
		return this.length.Get() >= x;
	}
	Short() {
		if(this.length.Get() == 0) return "bald scalp";
		else return Color.Desc(this.color) + " hair";
	}
	Long() {
		var len = this.length.Get();
		if(len == 0) return "bald scalp";
		else {
			var color = Color.Desc(this.color);
			var style;
			switch(this.style) {
				case HairStyle.straight: style = "straight " + color + " hair"; break;
				case HairStyle.wavy:     style = "wavy " + color + " hair"; break;
				case HairStyle.ponytail: style = color + " hair, which is kept in a ponytail"; break;
				case HairStyle.shaggy:   style = "shaggy " + color + " hair"; break;
				case HairStyle.curly:    style = "curly " + color + " hair"; break;
				case HairStyle.braid:    style = color + " hair, which is kept in a braid"; break;
				default:                 style = "unkempt hair"; break;
			}
			
			if     (len < 1)
				return color + " stubble";
			else if(len < 5)
				return "short " + color + " hair";
			else if(len < 10)
				return "short " + style;
			else if(len < 20)
				return "medium length, " + style;
			else if(len < 30)
				return "shoulder-length, " + style;
			else if(len < 50)
				return "long, " + style;
			else if(len < 70)
				return "waist-length, " + style;
			else if(len < 100)
				return "ass-length, " + style;
			else if(len < 140)
				return "knee-length, " + style;
			else
				return "ground-dragging, " + style;
		}
	}

};