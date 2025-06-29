export const formatIsoStringDate = (isoString: string) => {
	return new Date(isoString).toLocaleString(
		navigator.language,
		{ month: '2-digit', day: '2-digit', year: 'numeric' }
	);
};

export const formatDate = (date: Date) => {
	return new Date(date).toLocaleString(
		navigator.language,
		{ month: '2-digit', day: '2-digit', year: 'numeric' }
	);
};

export const formatCurrency = (value: number, multiplier: string, unit: string): string => {
	return `${value}${multiplier} ${unit}`;
};
