import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router";

const MyNavbar = () => {
	const links = [
		{ path: '/ciberataques', text: 'ciberataques' },
		{ path: '/cibercriminales', text: 'cibercriminales' },
		{ path: '/estadisticas', text: 'estadísticas' },
	];

	return (
		<>
			<Navbar expand="sm" bg="primary" data-bs-theme="dark">
				<Container fluid>
					<Navbar.Toggle aria-controls="navbar-nav" />
					<Navbar.Collapse id="navbar-nav">
						<Nav className="m-auto">
							{links.map(link => (
								<NavLink key={link.path} to={link.path} className="p-2 link-underline link-underline-opacity-0">
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
