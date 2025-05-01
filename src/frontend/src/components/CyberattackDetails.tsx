import { useParams } from "react-router";

const CyberattackDetails = () => {
	const { id } = useParams();

	return (
		<>
			CyberattackDetails {id}
		</>
	);
};

export default CyberattackDetails;
