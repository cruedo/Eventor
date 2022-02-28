import './App.css';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { Bar, Foo, Home } from './components/Home';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import { useDispatch, useSelector } from 'react-redux'
import { updateAuth } from './features/auth'
import Logout from './components/Logout'
import AppNavbar from './components/AppNavbar';

function App() {

  const Auth = useSelector(state => state.auth.authed)
  const dispatch = useDispatch()

  function PrivateRoute() {
    return Auth ? <Outlet /> : <Navigate to="/" />
  }

  return (
    <div className="">
      <BrowserRouter>

        <AppNavbar />

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
