import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './component/home/Navbar';
import Contact from './component/home/Contact';
import About from './component/home/About';
import Shop from './component/home/Shop';
import Home from './component/home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path = '/' element = {<Home/>}/>
        <Route path = '/contact' element = {<Contact/>}/>
        <Route path = '/about' element = {<About/>}/>
        <Route path = '/shop' element = {<Shop/>}/>
        <Route path = '/Home' element = {<Home/>}/>
        
      </Routes>
    </Router>

  );
}

export default App;
