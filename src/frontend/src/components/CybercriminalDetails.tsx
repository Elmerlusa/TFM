import { useParams } from "react-router";

const CybercriminalDetails = () => {
	const { name } = useParams();

	return (
		<>
			CybercriminalDetails {name}
		</>
	);
};

export default CybercriminalDetails;
