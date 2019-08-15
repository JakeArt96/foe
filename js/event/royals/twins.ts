/*
 *
 * Define Twins (fighting entity)
 *
 */
import { Entity } from "../../entity";
import { GAME, WorldTime } from "../../GAME";
import { Gui } from "../../gui";
import { RigardFlags } from "../../loc/rigard/rigard-flags";
import { Text } from "../../text";
import { Time } from "../../time";
import { TerryFlags } from "../terry-flags";
import { TwinsFlags } from "./twins-flags";

const TwinsScenes: any = {};

export class Twins {
	public rumi: Rumi;
	public rani: Rani;
	public flags: any;
	public terryTimer: Time;

	constructor(storage?: any) {
		this.rumi = new Rumi();
		this.rani = new Rani();

		this.flags = {};
		this.flags.Met = TwinsFlags.Met.NotMet;
		this.flags.SexOpen = 0;

		this.terryTimer = new Time();

		if (storage) { this.FromStorage(storage); }
	}

	public Relation() {
		return this.rumi.Relation() + this.rani.Relation();
	}

	public Update(step: number) {
		this.rumi.Update(step);
		this.rani.Update(step);
		this.terryTimer.Dec(step);
	}

	public FromStorage(storage: any) {
		if (storage.rumi) { this.rumi.FromStorage(storage.rumi); }
		if (storage.rani) { this.rani.FromStorage(storage.rani); }
		// Load flags
		for (const flag of storage.flags) {
			this.flags[flag] = parseInt(storage.flags[flag], 10);
		}

		this.terryTimer.FromStorage(storage.Ttime);
	}

	public ToStorage() {
		const storage: any = {
		};
		storage.rumi  = this.rumi.ToStorage();
		storage.rani  = this.rani.ToStorage();
		storage.flags = this.flags;

		storage.Ttime = this.terryTimer.ToStorage();

		return storage;
	}

	// Schedule
	public IsAtLocation(location?: any) {
		return true;
	}
}

export class Rumi extends Entity {
	constructor() {
		super();
		this.ID = "rumi";
	}

	public FromStorage(storage: any) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: any = {

		};

		this.SavePersonalityStats(storage);
		this.SaveFlags(storage);

		return storage;
	}
}

export class Rani extends Entity {
	constructor() {
		super();
		this.ID = "rani";
	}

	public FromStorage(storage: any) {
		this.LoadPersonalityStats(storage);

		// Load flags
		this.LoadFlags(storage);
	}

	public ToStorage() {
		const storage: any = {

		};

		this.SavePersonalityStats(storage);
		this.SaveFlags(storage);

		return storage;
	}
}

// TODO
TwinsScenes.Interact = () => {
	const parse: any = {

	};

	Text.Clear();
	Text.Add("PLACEHOLDER", parse);
	Text.NL();
	Text.Flush();

	// [Talk]
	const options = new Array();
	options.push({ nameStr : "Talk",
		func : TwinsScenes.TalkPrompt, enabled : true,
		tooltip : "Talkie talkie.",
	});
	Gui.SetButtonsFromList(options, true, () => {
		Gui.PrintDefaultOptions(); // TODO, leave
	});
};

TwinsScenes.TalkPrompt = () => {
	const player = GAME().player;
	const rigard = GAME().rigard;
	const twins = GAME().twins;
	const terry = GAME().terry;

	const parse: any = {
		playername : player.name,
	};

	// [Thief]
	const options = new Array();
	if (rigard.Krawitz.Q >= RigardFlags.KrawitzQ.CaughtTerry) {
		options.push({ nameStr : "Thief",
			func() {
				Text.Clear();
				if (terry.flags.Saved <= TerryFlags.Saved.TalkedMiranda) {
					Text.Add("You explain to them that you have been feeling guilty about the sentence of death decreed for the vulpine thief who inadvertently took the blame for your own raid on the Krawitz estate, as well as his own crimes there. You ask if they couldn't intervene somehow - at least to lighten his sentence, if they can't arrange a pardon?", parse);
					Text.NL();
					Text.Add("<i>“Well, I appreciate the fact that he robbed Krawitz, but it’s not so simple, [playername]. I don’t think-”</i>", parse);
					Text.NL();
					Text.Add("<i>“Sis?”</i> Rani interrupts his sister, looking at her. There is an unspoken conversation between the two before Rumi turns to you.", parse);
					Text.NL();
					Text.Add("<i>“We’ll see what we can do, but no promises,”</i> Rumi says. <i>“Meet us here tomorrow.”</i>", parse);
					Text.NL();
					Text.Add("You thank them for their efforts and excuse yourself, heading back to the main room of the inn.", parse);

					twins.terryTimer = new Time(0, 0, 0, 24 - WorldTime().hour);

					terry.flags.Saved = TerryFlags.Saved.TalkedTwins1;
				} else if (terry.flags.Saved === TerryFlags.Saved.TalkedTwins1) {
					Text.Add("You asked them how it went with helping that thief.", parse);
					Text.NL();
					Text.Add("<i>“We managed to work something out, but pardoning the thief is completely out of question, and there are a few terms to this deal,”</i> Rumi says.", parse);
					Text.NL();
					Text.Add("You had expected a full-pardon to be out of even their reach, and say as much. Still, at least he has his life; what are the terms they mentioned?", parse);
					Text.NL();
					Text.Add("Rumi clears her throat. <i>“We’ve arranged for him to be released under your care for you to instruct him and ensure he offers reparations for his misdeeds, so whatever he does once out will be your responsibility.”</i>", parse);
					Text.NL();
					Text.Add("<i>“Of course we can’t expect him to just not run away once he’s free, so we had the court wizard prepare a special collar to aid you. A collar like this one,”</i> Rani adds, pointing at his neck.", parse);
					Text.NL();
					Text.Add("Rumi grins mischievously. <i>“The collar’s enchanted and will prevent him from running away or disobeying your orders, as long as you don’t order to him to do something that would purposefully harm himself.”</i>", parse);
					Text.NL();
					Text.Add("<i>“And he can’t harm you either. If he breaks one of these rules, the collar will unleash its magic and... disable him,”</i> Rani adds.", parse);
					Text.NL();
					Text.Add("<i>“We’ll let you figure out exactly how it does that,”</i> Rumi says, as the twins grin mischievously. <i>“Go to the jail in the castle grounds and present the guardsman with this letter,”</i> Rumi says, handing you a sealed message.", parse);
					Text.NL();
					Text.Add("<i>“And don’t forget to attach the collar,”</i> Rani adds, presenting you with the collar.", parse);
					Text.NL();
					Text.Add("You take the missive and the collar from the prince's hands. Tucking the letter away safely, you turn the collar around in your hands, looking it over. It certainly doesn't look as impressive as it sounds; it's nothing more than a simple leather band, with metallic tips for fixing it into place.", parse);
					Text.NL();
					Text.Add("<i>“Put this around his neck and say the activation word, 'Featherfall',”</i> Rumi says.", parse);
					Text.NL();
					Text.Add("Nodding your understanding, you carefully stow the collar away before thanking the royal twins for their efforts. That said, you make your excuses and depart.", parse);
					Text.NL();
					Text.Add("<b>Received enchanted collar!</b><br>", parse);
					Text.Add("<b>Received royal letter!</b>", parse);
					terry.flags.Saved = TerryFlags.Saved.TalkedTwins2;
				} else {
					Text.Add("PLACEHOLDER", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
					Text.NL();
					Text.Add("", parse);
				}
				Text.Flush();
				Gui.NextPrompt();
			}, enabled : twins.terryTimer.Expired(),
			tooltip : Text.Parse("Ask them if they can intervene on behalf of the thief[death].", {death: terry.flags.Saved >= TerryFlags.Saved.TalkedMiranda ? " on death row" : ""}),
		});
	}
	Gui.SetButtonsFromList(options, true, TwinsScenes.Interact);
};

export { TwinsScenes };
