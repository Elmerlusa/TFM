export const formatDate = (isoString: string) => {
	return new Date(isoString).toLocaleString(
		navigator.language,
		{ month: '2-digit', day: '2-digit', year: 'numeric' }
	);
};
