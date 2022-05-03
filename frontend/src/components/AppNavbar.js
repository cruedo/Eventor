import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'


export default function AppNavbar() {
  const Auth = useSelector(state => state.auth.authed)
  
  return (
      <Navbar bg="dark" expand="sm" variant='dark'>
        <Container>
          <Navbar.Brand as={Link} to="/">Branding</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              { Auth ? <Nav.Link as={Link} to="/foo">Foo</Nav.Link> : "" }
              { Auth ? <Nav.Link as={Link} to="/createEvent">New Event</Nav.Link> : "" }
              <Nav.Link as={Link} to="/bar">Bar</Nav.Link>
            </Nav>
            <Nav className="ml-auto">
              { Auth ? "" : <Nav.Link as={Link} to="/login">Login</Nav.Link> }
              { Auth ? "" : <Nav.Link as={Link} to="/signup">Signup</Nav.Link> }
              { Auth ? <Nav.Link as={Link} to="/logout">Logout</Nav.Link> : ""}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}