import { useState } from 'react';
import './App.css';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Bar, Foo, Home } from './components/Home';
import { Navbar, Nav, Container } from 'react-bootstrap';

function App() {

  const [Auth, setAuth] = useState(false)

  function PrivateRoute() {
    return Auth ? <Outlet /> : <Navigate to="/" />
  }

  return (
    <div className="App">
      <BrowserRouter>

      <Navbar bg="dark" expand="sm" variant='dark'>
        <Container>
          <Navbar.Brand as={Link} to="/">Branding</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              { Auth ? <Nav.Link as={Link} to="/foo">Foo</Nav.Link> : "" }
              <Nav.Link as={Link} to="/bar">Bar</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

        <button onClick={() => setAuth(!Auth)}>Toggle Auth</button>
        <br/>

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/foo" element={<Foo />}/>
          </Route>
          <Route path="/bar" element={<Bar />}/>
        </Routes>
          
      </BrowserRouter>
      
    </div>
  );
}

export default App;
