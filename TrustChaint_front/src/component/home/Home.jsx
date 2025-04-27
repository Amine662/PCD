import React from "react";
import Navbar from "./Navbar";
import Slide from "./Slide" ; 
import Offre from "./Offre";
import Categories from "./Categories";
import Footer from "./Footer";
import Chooseus from "./chooseus";
import SecureShopping from "./SecureShopping";


const Home = () => {
    return (
        <div>
            <Navbar/>
            <div className="bg-light text-center py-2 fw-semibold">
      Subscribe to <u>TrustChain Unlimited:</u> <b>€15</b> <span className="text-decoration-line-through">€29</span>/year to enjoy <u>Boost Deals</u> ✨ First order? Get €10 off! <u>Take advantage of it</u>
      </div>
            <SecureShopping/>
            <Slide/>
            <Offre/>
            <Categories/>
            <Chooseus/>
            <Footer/>
        </div>
      )
}
export default Home ; 