import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "react-bootstrap";

const MyFooter = () => {
	return (
		<footer className="py-4 text-center" style={{ backgroundColor: '#161b22', borderTop: '1px solid #30363d' }}>
        <Container>
          <p className="mb-0">
			<FontAwesomeIcon icon={faLock} className="me-2" />
            RansomWatch
          </p>
        </Container>
      </footer>
	)
};

export default MyFooter;
