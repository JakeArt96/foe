/*
 * 
 * Define Miranda
 * 
 */
import { Entity } from '../entity';
import { JobDesc, Jobs } from '../job';
import { Time } from '../time';
import { Images } from '../assets';
import { Items } from '../items';
import { Color } from '../body/color';
import { Race } from '../body/race';
import { WorldTime, TimeStep, GAME, NAV, WORLD } from '../GAME';
import { Text } from '../text';
import { Gui } from '../gui';
import { MirandaFlags } from './miranda-flags';
import { Party } from '../party';

export class Miranda extends Entity {
	snitchTimer : Time;

	constructor(storage? : any) {
		super();

		this.ID = "miranda";
		
		// Character stats
		this.name = "Miranda";
		
		this.avatar.combat = Images.miranda;
		
		this.currentJob = Jobs.Bruiser;
		this.jobs["Fighter"]   = new JobDesc(Jobs.Fighter);
		this.jobs["Fighter"].level = 3;
		this.jobs["Bruiser"]   = new JobDesc(Jobs.Bruiser);
		
		this.maxHp.base        = 100;
		this.maxSp.base        = 10;
		this.maxLust.base      = 50; this.maxLust.growth      = 6;
		// Main stats
		this.strength.base     = 23; this.strength.growth     = 1.7;
		this.stamina.base      = 19; this.stamina.growth      = 1.4;
		this.dexterity.base    = 19; this.dexterity.growth    = 1.1;
		this.intelligence.base = 12; this.intelligence.growth = 1;
		this.spirit.base       = 11; this.spirit.growth       = 1.2;
		this.libido.base       = 24; this.libido.growth       = 1.5;
		this.charisma.base     = 14; this.charisma.growth     = 1.1;
		
		this.level    = 8;
		this.sexlevel = 3;
		this.SetExpToLevel();
		
		this.body.DefHerm(true);
		this.FirstBreastRow().size.base = 12.5;
		this.Butt().buttSize.base = 7;
		this.FirstCock().length.base = 28;
		this.FirstCock().thickness.base = 6;
		this.FirstVag().virgin = false;
		this.Butt().virgin = false;
		this.Balls().size.base = 6;
		this.Balls().cumProduction.base = 4;
		this.body.SetRace(Race.Dog);
		this.SetSkinColor(Color.black);
		this.SetHairColor(Color.blue);
		this.SetEyeColor(Color.green);
		this.body.height.base      = 180;
		this.body.weigth.base      = 75;
		
		this.weaponSlot   = Items.Weapons.GreatSword;
		this.topArmorSlot = Items.Armor.WatchChest;
		
		this.Equip();
		this.SetLevelBonus();
		this.RestFull();
		
		this.flags["Met"]      = MirandaFlags.Met.NotMet;
		this.flags["Talk"]     = 0; // bitmask
		this.flags["Herm"]     = 0; // Know she is a herm
		this.flags["Attitude"] = MirandaFlags.Attitude.Neutral;
		this.flags["Thief"]    = 0;
		this.flags["RotGuard"] = 0;
		this.flags["Forest"]   = 0;
		this.flags["Floor"]    = 0;
		
		this.flags["Snitch"]   = 0;
		this.snitchTimer = new Time();
		
		this.flags["Footjob"]  = 0;
		
		this.flags["Bruiser"]  = MirandaFlags.Bruiser.No;
		this.flags["trainSex"] = 0;
		//Peasants' gate antics
		this.flags["gBJ"]      = 0;
		this.flags["gAnal"]    = 0;
		this.flags["gBribe"]   = 0;

		this.flags["public"]   = 0;
		this.flags["Dates"]    = 0;
		this.flags["bgRot"]    = 0;
		this.flags["bgRotMax"] = 0;
		this.flags["ssRot"]    = 0;
		this.flags["ssRotMax"] = 0;
		this.flags["dLock"]    = 0;
		this.flags["domCellar"] = 0; //player dom
		this.flags["subCellar"] = 0; //player sub
		
		if(storage) this.FromStorage(storage);
	}

	//TODO
	IsFollower() {
		return false; //Met? Questline?
	}

	Met() {
		return this.flags["Met"] >= MirandaFlags.Met.Met;
	}

	Attitude() {
		return this.flags["Attitude"];
	}

	Nice() {
		return this.flags["Attitude"] >= MirandaFlags.Attitude.Neutral;
	}
	Nasty() {
		return this.flags["Attitude"] < MirandaFlags.Attitude.Neutral;
	}

	FromStorage(storage : any) {
		this.LoadCombatStats(storage);
		this.LoadPersonalityStats(storage);
		this.LoadJobs(storage);
		this.LoadEquipment(storage);
		this.body.FromStorage(storage.body);
		
		// Load flags
		this.LoadFlags(storage);
		this.LoadSexFlags(storage);
		
		this.snitchTimer.FromStorage(storage.Stime);
		
		this.RecallAbilities();
		this.SetLevelBonus();
		this.Equip();
	}

	ToStorage() {
		var storage : any = {};
		
		this.SaveCombatStats(storage);
		this.SavePersonalityStats(storage);
		this.SaveJobs(storage);
		this.SaveEquipment(storage);
		this.SaveBodyPartial(storage, {ass: true, vag: true, balls: true});
		
		// Save flags
		this.SaveFlags(storage);
		this.SaveSexFlags(storage);
		
		storage.Stime = this.snitchTimer.ToStorage();
		
		return storage;
	}

	Update(step : number) {
		super.Update(step);
		this.snitchTimer.Dec(step);
	}

	// Party interaction
	Interact(switchSpot : boolean) {
		let rigard = GAME().rigard;
		let miranda = GAME().miranda;

		Text.Clear();
		var that = miranda;
		
		that.PrintDescription();
		Text.Flush();
		
		var options = new Array();
		options.push({ nameStr: "Release",
			func : function() {
				Text.Clear();
				Text.Add("[Placeholder] Miranda masturbates fiercely, cumming buckets.");
				
				TimeStep({minute : 10});
				
				that.OrgasmCum();
				Text.Flush();
				Gui.NextPrompt(function() {
					that.Interact(switchSpot);
				});
			}, enabled : true,
			tooltip : "Pleasure yourself."
		});
		//Equip, stats, job, switch
		that.InteractDefault(options, switchSpot, !rigard.UnderLockdown(), true, !rigard.UnderLockdown(), true);
		
		Gui.SetButtonsFromList(options, true, NAV().PartyInteraction);
	}

	// Schedule
	IsAtLocation(location? : any) {
		let party : Party = GAME().party;
		let miranda = GAME().miranda;
		let world = WORLD();

		if(party.InParty(miranda)) return false;
		if(!miranda.snitchTimer.Expired()) return false;
		location = location || party.location;
		if(WorldTime().hour >= 7 && WorldTime().hour < 19) {
			//Work
			if(WorldTime().day % 3 == 0)
				return (location == world.loc.Rigard.Barracks.common);
			else if(WorldTime().day % 3 == 1)
				return (location == world.loc.Plains.Gate) || (location == world.loc.Rigard.Gate);
			else
				return (location == world.loc.Rigard.Slums.gate);
		}
		else if(WorldTime().hour >= 19 || WorldTime().hour < 2)
			return (location == world.loc.Rigard.Tavern.common);
		else
			return (location == world.loc.Rigard.Residential.miranda);
	}

	OnPatrol() {
		let party : Party = GAME().party;
		if(party.InParty(this))
			return false;
		else
			return (WorldTime().hour >= 7 && WorldTime().hour < 17);
	}

	FuckedTerry() {
		return false; //TODO
	}

}
