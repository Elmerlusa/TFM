import { faChartLine, faCrosshairs, faLock, faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";
import '../assets/css/MyNavbar.css';

const MyNavbar = () => {
	const links = [
		{ path: '/ciberataques', text: 'ciberataques', icon: faCrosshairs },
		{ path: '/cibercriminales', text: 'cibercriminales', icon: faUserSecret },
		{ path: '/estadisticas', text: 'estadísticas', icon: faChartLine },
	];

	return (
		<>
			<Navbar expand="sm" bg="dark" variant="dark" className="px-4">
				<Container fluid>
					<Navbar.Brand className="fs-2 fw-bold mx-2">
						<FontAwesomeIcon icon={faLock} className="me-2"></FontAwesomeIcon>
						RansomWatch
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="navbar-nav" />
					<Navbar.Collapse id="navbar-nav">
						<Nav className="ms-auto">
							{links.map(link => (
								<NavLink key={link.path} to={link.path} 
									className="p-2 link-underline link-underline-opacity-0 text-white rounded mx-1 navlink">
									<FontAwesomeIcon icon={link.icon} className="me-2" ></FontAwesomeIcon>
									{link.text.toUpperCase()}
								</NavLink>
							))}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>
	);
};

export default MyNavbar;
