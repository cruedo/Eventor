import { useState } from 'react';
import './App.css';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Bar, Foo, Home } from './components/Home';
import { Navbar, Nav, Container } from 'react-bootstrap';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import { useDispatch, useSelector } from 'react-redux'
import { updateAuth } from './features/auth'
import Logout from './components/Logout'

function App() {

  const Auth = useSelector(state => state.auth.authed)
  const dispatch = useDispatch()

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
            <Nav className="ml-auto">
              { Auth ? "" : <Nav.Link as={Link} to="/login">Login</Nav.Link> }
              { Auth ? "" : <Nav.Link as={Link} to="/bar">Signup</Nav.Link> }
              { Auth ? <Nav.Link as={Link} to="/logout">Logout</Nav.Link> : ""}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

        <button onClick={() => dispatch(updateAuth(!Auth))}>Toggle Auth</button>
        <br/>

        <Routes>
          <Route path="/" element={<Home />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/foo" element={<Foo />}/>
          </Route>
          <Route path="/bar" element={<Bar />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/events/:id" element={<EventDetail />}/>
        </Routes>
          
      </BrowserRouter>
      
    </div>
  );
}

export default App;
