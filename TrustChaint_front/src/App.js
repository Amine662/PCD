import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import About from './component/home/About';
import Home from './component/home/Home';
import LoginUser from './component/home/login/LoginUser';
import 'bootstrap/dist/css/bootstrap.min.css';
import Product from './component/home/Product';
import ProductDetail from './component/home/ProductDetail';
import Addtocart from './component/home/Addtocart';
import CheckoutPage from './component/home/CheckoutPage';
import Account from './component/home/Account';
import LoginSeller from './component/home/login/LoginSeller';
import LoginAdmin from './component/home/login/LoginAdmin';
import AdminDashboard from './component/home/AdminDashboard';
import AdminProfil from './component/home/AdminProfil';
import ManageUsers from './component/home/manage/ManageUsers';
import ManageProducts from './component/home/manage/ManageProducts';
import ManageOrders from './component/home/manage/ManageOrders';
import SellerDashboard from './component/home/SellerDashboard';

  function App() {
    return (
      <Router>
        <Routes>
          <Route path='/' element = {<Home/>}/>
          <Route path='/about' element = {<About/>}/>
          <Route path='/Home' element = {<Home/>}/>
          <Route path='/login' element = {<LoginUser/>}/>
          <Route path='/admin' element = {<LoginAdmin/>}/>
          <Route path='/login-seller' element = {<LoginSeller/>}/>
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/addtocart" element={<Addtocart />} />
          <Route path="/login/check" element={<CheckoutPage/>} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/profile" element={<AdminProfil />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />          
          <Route path="/admin/manage-products" element={<ManageProducts />} />          
          <Route path="/seller/manage-products" element={<ManageProducts />} />          
          <Route path="/admin/manage-orders" element={<ManageOrders />} />          
          <Route path="/seller/manage-orders" element={<ManageOrders />} />          
          <Route path="/seller-dashboard" element={<SellerDashboard />} />         
        </Routes>
      </Router>
    );
  }
  export default App;
