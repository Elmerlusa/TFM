export interface ICybercriminalAbstract {
	name: string,
	lastAttackAt: Date,
	totalAttacks: number,
};

export interface ICyberattackAbstract {
	id: number,
	detectedAt: Date,
	type: string,
	targetName: string,
	cybercriminalName: string,
};

export interface ICategoryCount {
	[category: string]: number
}

export interface ICybercriminalStats {
	attacksByRegion: ICategoryCount,
	attacksBySector: ICategoryCount,
	attacksByTarget: ICategoryCount,
	attacksByType: ICategoryCount,
	totalAttacks: number,
}

export interface ICybercriminalDetails {
	id: string,
	name: string,
	onion: string,
	telegram: string,
	emails: string[],
	wallets: string[],
	stats: ICybercriminalStats,
	attacks: ICyberattackAbstract[],
};

export interface ITarget {
	name: string,
	sector: string,
	cnae: number,
	contact: string,
	regions: string[],
	country: string,
	addresses: string[],
	email: string,
};

export interface ICyberattackDetails {
	id: number,
	detectedAt: Date,
	notifiedAt: Date,
	type: string,
	description: string,
	clientsAffected: number,
	recordsAffected: number,
	reputationalImpact: string,
	dowtimeHours: number,
	target: ITarget,
	cybercriminalName: string,
	cybercriminal: ICybercriminalDetails,
};

export interface IGlobalStats {
	id: string,
	attacksByGroup: ICategoryCount,
	attacksByRegion: ICategoryCount,
	attacksBySector: ICategoryCount,
	attacksByTarget: ICategoryCount,
	attacksByType: ICategoryCount,
	attacksByDate: ICategoryCount,
	numGroups: number,
	totalAttacks: number,
	totalAttacksThreeMonths: number
};
