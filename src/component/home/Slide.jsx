import React from "react";
import s from "./slide.css" ; 
import { CiCreditCard1 } from "react-icons/ci";
import { FaEuroSign } from "react-icons/fa";
import { TbTruckDelivery } from "react-icons/tb";
import { CiStar } from "react-icons/ci";
import { useNavigate, useSearchParams } from "react-router-dom";
const Slide = () => {
    const navigate = useNavigate() ; 
    return (
        <div className="all">
        <div className="slide-container"> 
            <div className="slide">
            <img alt="TV" src="https://www.cdiscount.com/other/alerte-discount-slider-pc-1620x410-pdm-2025-2-18-tos4024862129187_250219102112.png?1922ba1a-26f5-47fb-8e59-0630b6089260" height="100%&quot;" width="100%" loading="lazy"></img>
            </div>  
            <div className="slide-list">
                <div>
                <span  id="chicha1" onClick={()=>{navigate("/contact")}}><CiCreditCard1 /> Paiement en 4x </span>
                </div>
                <div>
                <span id="chicha2" onClick={()=>{navigate("/contact")}}><FaEuroSign /> Prix bas toute l'année </span>
                </div>
                <div>
                <span id="chicha3" onClick={()=>{navigate("/contact")}}><CiStar /> E-commerce engagé </span>
                </div>
                <div>
                <span id="chicha4" onClick={()=>{navigate("/contact")}}><TbTruckDelivery /> Livraison sur mesure </span>
                </div>
            </div>
            <div><h2 style={{fontSize:"30px" , fontWeight:"450" , marginTop:"3%"}}>Inspiré de vos visites</h2></div>

            <div className="box-container">
            <div className="box">Box 1</div>
            <div className="box">Box 2</div>
            <div className="box">Box 3</div>
            <div className="box">Box 4</div>
        </div>
        </div>
        </div>
      )
}
export default Slide ; 