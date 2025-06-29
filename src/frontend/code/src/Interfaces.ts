export interface ICybercriminalAbstract {
	name: string,
	attackCount: number,
	lastAttackAt: Date,
};

interface ILeakSize {
	value: number,
	unit: string,
}

export interface ICyberattackAbstract {
	id: string,
	cybercriminalName: string,
	targetName: string,
	leakSize: ILeakSize,
	detectedAt: Date,
};

export interface ICybercriminalGroupedInfo {
	name: string,
	telegrams: string[],
	wallets: string[],
	onions: string[],
	emails: string[],
}

export interface ICybercriminalDetails {
	info: ICybercriminalGroupedInfo,
	stats: Istats,
	attacks: ICyberattackAbstract[],
};

interface IRevenue {
	value: number,
	mulitplier: string,
	unit: string
}

export interface ITarget {
	name: string,
	website: string,
	size: number,
	revenue: IRevenue,
	region: string,
	sector: string,
};

export interface ICybercriminalInfo {
	name: string,
	telegram: string,
	wallet: string,
	onion: string,
	email: string,
}

export interface IDisclosures {
	completed: number,
	total: number,
}

export interface ICyberattackDetails {
	id: string,
	cybercriminal: ICybercriminalInfo,
	disclosures: IDisclosures,
	leakSize: ILeakSize,
	leakFiles: number,
	target: ITarget,
	detectedAt: Date,
	notifiedAt: Date,
	description: string,
	downtimeHours: number,
	reputationalImpact: string,
};

export interface Istats {
	attackCount: number,
	totalDisclosures: number,
	totalLeakSize: ILeakSize,
	totalLeakFiles: number,
	targetCounts: Record<string, number>,
	sectorCounts: Record<string, number>,
	regionCounts: Record<string, number>,
	cybercriminalCounts: Record<string, number>,
	detectedAtCounts: Record<string, number>,

	// numGroups: number,
	// totalAttacksThreeMonths: number
};
