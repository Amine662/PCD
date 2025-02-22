import React from "react";
import Navbar from "./Navbar";
import Slide from "./Slide" ; 
import Offre from "./Offre";
import Categories from "./Categories";
import Footer from "./Footer";
const Home = () => {
    return (
        <div>
            <Navbar/>
            <Slide/>
            <Offre/>
            <Categories/>
            <Footer/>
        </div>
      )
}
export default Home ; 