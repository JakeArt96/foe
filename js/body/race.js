
// Contains references to descriptors
Race = {};

function RaceDesc(name, id, opts, superclass) {
	opts = opts || {};
	this.name = name || 'RACE';
	this.superclass = superclass;
	
	this.desc       = opts.desc || [];
	this.descMale   = opts.descMale || [];
	this.descFemale = opts.descFemale || [];
	
	this.id = id;
	RaceDesc.Num++;
	RaceDesc.IdToRace[this.id] = this;
}
// Contains a set of Id,RaceDesc pairs
RaceDesc.IdToRace = {};
RaceDesc.Num = 0;

RaceDesc.prototype.Desc = function(gender) {
	var desc = this.desc;
	if(_.isNumber(gender)) {
		if(gender == Gender.male)
			desc.concat(this.descMale);
		else
			desc.concat(this.descFemale);
	}
	if(this.superclass) desc.concat(this.superclass.Desc(gender));
	return desc;
}

RaceDesc.prototype.short = function(gender) {
	var desc = _.sample(this.Desc(gender));
	return desc ? desc.noun : ("ERROR in " + this.name + ".short()");
}
RaceDesc.prototype.Short = function(gender) {
	var desc = _.sample(this.Desc(gender));
	return desc ? _.capitalize(desc.noun) : ("ERROR in " + this.name + ".Short()");
}
RaceDesc.prototype.ashort = function(gender) {
	var desc = _.sample(this.Desc(gender));
	return desc ? (desc.a + " " + desc.noun) : ("ERROR in " + this.name + ".ashort()");
}

RaceDesc.prototype.Quantifier = function(aAn, gender) {
	var quantify = this.quantify;
	if(_.isNumber(gender)) {
		if(gender == Gender.male)
			quantify.concat(this.quantifyMale);
		else
			quantify.concat(this.quantifyFemale);
	}
	if(this.superclass) quantify.concat(this.superclass.Quantifier(aAn, gender));
	return quantify;
}

RaceDesc.prototype.qshort = function(gender) {
	var desc = _.sample(this.Quantifier(gender));
	return desc ? desc.noun : ("ERROR in " + this.name + ".qshort()");
}
RaceDesc.prototype.qShort = function(gender) {
	var desc = _.sample(this.Quantifier(gender));
	return desc ? _.capitalize(desc.noun) : ("ERROR in " + this.name + ".qShort()");
}
RaceDesc.prototype.aqshort = function(gender) {
	var desc = _.sample(this.Quantifier(gender));
	return desc ? (desc.a + " " + desc.noun) : ("ERROR in " + this.name + ".aqshort()");
}

//{a:"", noun:""}
Race.Human = new RaceDesc("human", 0, {
	desc: [{a:"a", noun:"human"}],
	descMale: [{a:"a", noun:"man"}],
	descFemale: [{a:"a", noun:"woman"}],
	quantify: [{a:"a", noun:"human"}],
	quantifyMale: [{a:"a", noun:"male"}],
	quantifyFemale: [{a:"a", noun:"female"}]
});
Race.Horse = new RaceDesc("horse", 1, {
	desc: [{a:"a", noun:"horse"}, {a:"an", noun:"equine"}],
	descMale: [{a:"a", noun:"stallion"}],
	descFemale: [{a:"a", noun:"mare"}],
	quantify: [{a:"an", noun:"equine"}]
});
Race.Feline = new RaceDesc("feline", 2, {
	desc: [{a:"a", noun:"cat"}, {a:"a", noun:"feline"}],
	descMale: [{a:"a", noun:"tom"}],
	descFemale: [{a:"a", noun:"pussy"}],
	quantify: [{a:"a", noun:"feline"}]
});
Race.Tiger = new RaceDesc("tiger", 25, {
	desc: [{a:"a", noun:"tiger"}],
	descFemale: [{a:"a", noun:"tigress"}],
	quantify: [{a:"a", noun:"tigrine"}]
}, Race.Feline);
Race.Panther = new RaceDesc("panther", 26, {
	desc: [{a:"a", noun:"panther"}],
	descFemale: [{a:"a", noun:"panthress"}],
	quantify: [{a:"a", noun:"pantherine"}]
}, Race.Feline);
Race.Jaguar = new RaceDesc("jaguar", 27, {
	desc: [{a:"a", noun:"jaguar"}]
}, Race.Feline);
Race.Puma = new RaceDesc("puma", 28, {
	desc: [{a:"a", noun:"puma"}]
}, Race.Feline);
Race.Lynx = new RaceDesc("lynx", 29, {
	desc: [{a:"a", noun:"lynx"}]
}, Race.Feline);
Race.Lion = new RaceDesc("lion", 30, {
	descMale: [{a:"a", noun:"lion"}],
	descFemale: [{a:"a", noun:"lioness"}],
}, Race.Feline);
Race.Canine = new RaceDesc("canine", 31, {
	desc: [{a:"a", noun:"canine"}, {a:"a", noun:"canid"}],
	descFemale: [{a:"a", noun:"bitch"}],
	quantify: [{a:"a", noun:"canine"}, {a:"a", noun:"canid"}]
});
Race.Dog = new RaceDesc("dog", 3, {
	desc: [{a:"a", noun:"dog"}]
}, Race.Canine);
Race.Fox = new RaceDesc("fox", 4, {
	desc: [{a:"a", noun:"fox"}],
	descFemale: [{a:"a", noun:"vixen"}],
	quantify: [{a:"a", noun:"vulpine"}],
	quantifyFemale: [{a:"a", noun:"foxy"}]
}, Race.Canine);
Race.Wolf = new RaceDesc("wolf", 15, {
	desc: [{a:"a", noun:"wolf"}],
	descFemale: [{a:"a", noun:"she-wolf"}],
	quantify: [{a:"a", noun:"lupine"}]
}, Race.Canine);
Race.Jackal = new RaceDesc("jackal", 24, {
	desc: [{a:"a", noun:"jackal"}],
	descMale: [{a:"a", noun:"anubis"}],
	descFemale: [{a:"a", noun:"jackaless"}]
}, Race.Canine);
Race.Reptile = new RaceDesc("reptile", 32, {
	desc: [{a:"a", noun:"reptile"}],
	quantify: [{a:"a", noun:"reptilian"}]
});
Race.Snake = new RaceDesc("snake", 21, {
	desc: [{a:"a", noun:"snake"}, {a:"a", noun:"serpent"}, {a:"a", noun:"naga"}],
	quantify: [{a:"a", noun:"serpentine"}, {a:"a", noun:"naga"}]
}, Race.Reptile);
Race.Lizard = new RaceDesc("lizard", 5, {
	desc: [{a:"a", noun:"lizard"}]
}, Race.Reptile);
Race.Dragon = new RaceDesc("dragon", 8, {
	desc: [{a:"a", noun:"dragon"}],
	descMale: [{a:"a", noun:"drake"}],
	descFemale: [{a:"a", noun:"dragoness"}],
	quantify: [{a:"a", noun:"draconic"}]
}, Race.Reptile);
Race.Avian = new RaceDesc("avian", 16, {
	desc: [{a:"an", noun:"avian"}, {a:"a", noun:"bird"}],
	quantify: [{a:"an", noun:"avian"}]
});
Race.Insect = new RaceDesc("insect", 23, {
	desc: [{a:"an", noun:"insect"}],
	quantify: [{a:"an", noun:"insectoid"}]
});
Race.Moth = new RaceDesc("moth", 17, {
	desc: [{a:"a", noun:"moth"}]
}, Race.Insect);
Race.Gol = new RaceDesc("gol", 33, {
	desc: [{a:"a", noun:"Gol"}]
}, Race.Insect);
Race.Cow = new RaceDesc("cow", 14, {
	desc: [{a:"a", noun:"bovine"}],
	descMale: [{a:"a", noun:"cow"}],
	descFemale: [{a:"a", noun:"bull"}],
	quantify: [{a:"a", noun:"bovine"}]
});
Race.Goat = new RaceDesc("goat", 13, {
	desc: [{a:"a", noun:"goat"}, {a:"a", noun:"caprine"}],
	descMale: [{a:"a", noun:"doe"}],
	descFemale: [{a:"a", noun:"buck"}],
	quantify: [{a:"a", noun:"caprine"}]
});
Race.Satyr = new RaceDesc("satyr", 11, {
	desc: [{a:"a", noun:"satyr"}, {a:"a", noun:"faun"}],
	quantify: [{a:"a", noun:"satyr"}, {a:"a", noun:"faun"}]
}, Race.Goat);
Race.Sheep = new RaceDesc("sheep", 12, {
	desc: [{a:"a", noun:"sheep"}, {a:"an", noun:"ovine"}],
	descMale: [{a:"a", noun:"ram"}],
	descFemale: [{a:"a", noun:"ewe"}],
	quantify: [{a:"an", noun:"ovine"}]
});
Race.Elf = new RaceDesc("elf", 10, {
	desc: [{a:"an", noun:"elf"}],
	quantify: [{a:"an", noun:"elven"}, {a:"an", noun:"elfin"}, {a:"an", noun:"elvish"}]
});
Race.Demon = new RaceDesc("demon", 7, {
	desc: [{a:"a", noun:"demon"}],
	descMale: [{a:"an", noun:"incubus"}],
	descFemale: [{a:"a", noun:"demoness"}, {a:"a", noun:"succubus"}],
	quantify: [{a:"a", noun:"demonic"}, {a:"an", noun:"infernal"}]
});
Race.Arachnid = new RaceDesc("arachnid", 34, {
	desc: [{a:"an", noun:"arachnid"}],
	quantify: [{a:"an", noun:"arachnoid"}, {a:"an", noun:"arachnine"}]
});
Race.Spider = new RaceDesc("spider", 35, {
	desc: [{a:"a", noun:"spider"}]
}, Race.Arachnid);
Race.Scorpion = new RaceDesc("scorpion", 18, {
	desc: [{a:"a", noun:"scorpion"}]
}, Race.Arachnid);
Race.Rabbit = new RaceDesc("rabbit", 6, {
	desc: [{a:"a", noun:"rabbit"}, {a:"a", noun:"bunny"}, {a:"a", noun:"lapin"}],
	descMale: [{a:"a", noun:"jack"}],
	descFemale: [{a:"a", noun:"jill"}],
	quantify: [{a:"a", noun:"leporine"}, {a:"a", noun:"lapine"}]
});
Race.Dryad = new RaceDesc("dryad", 9, {
	desc: [{a:"a", noun:"dryad"}, {a:"a", noun:"fawn"}],
	quantify: [{a:"a", noun:"dryad"}, {a:"a", noun:"fawn"}]
});
Race.Ferret = new RaceDesc("ferret", 36, {
	desc: [{a:"a", noun:"ferret"}],
	quantify: [{a:"a", noun:"musteline"}]
});
Race.Musteline = new RaceDesc("musteline", 37, {
	quantify: [{a:"a", noun:"musteline"}]
});
Race.Ferret = new RaceDesc("ferret", 19, {
	desc: [{a:"a", noun:"ferret"}]
}, Race.Musteline);
Race.Badger = new RaceDesc("badger", 38, {
	desc: [{a:"a", noun:"badger"}]
}, Race.Musteline);
Race.Plant = new RaceDesc("plant", 20, {
	desc: [{a:"a", noun:"plant"}],
	quantify: [{a:"a", noun:"floral"}]
});
Race.Goo = new RaceDesc("goo", 22, {
	desc: [{a:"a", noun:"goo"}],
	quantify: [{a:"a", noun:"gelatinous"}]
});
