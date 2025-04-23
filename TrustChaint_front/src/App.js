  import './App.css';
  import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
  import Navbar from './component/home/Navbar';
  import Contact from './component/home/Contact';
  import About from './component/home/About';
  import Shop from './component/home/Shop';
  import Home from './component/home/Home';
  import LoginSignUP from './component/home/login/LoginSignUp';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import Product from './component/home/Product';
  import ProductDetail from './component/home/ProductDetail';
  import Addtocart from './component/home/Addtocart';
  import CheckoutPage from './component/home/CheckoutPage';
  import Account from './component/home/Account';

  function App() {
    return (
      <Router>
        <Routes>
          <Route path = '/' element = {<Home/>}/>
          <Route path = '/contact' element = {<Contact/>}/>
          <Route path = '/about' element = {<About/>}/>
          <Route path = '/shop' element = {<Shop/>}/>
          <Route path = '/Home' element = {<Home/>}/>
          <Route path = '/Login' element = {<LoginSignUP/>}/>
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/addtocart" element={<Addtocart />} />
          <Route path="/check" element={<CheckoutPage/>} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Router>

    );
  }

  export default App;
