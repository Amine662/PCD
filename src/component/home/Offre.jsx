import React from "react";
import o from "./offre.css" ;
import { useNavigate } from "react-router-dom";
const Offre = () => {
    const navigate = useNavigate() ;
    return (
        <div className="lm3alem">
            <div className="first-list">
            <div><h2 style={{fontSize:"30px" , fontWeight:"450" , marginTop:"3%" , marginLeft:"3%"}}> Nos offres du moment </h2></div>
                <nav className="offlist">
                      <ul>
                                   <li><span onClick={()=>{
                                        navigate("/contact")}}> Promo </span></li>
                                    <li>Voyages</li>
                                    <li><span onClick={()=>{
                                        navigate("/contact")}}> Forfait Mobile </span></li>
                                    <li><span onClick={()=>{
                                        navigate("/contact")}}> Reconditionné </span></li>
                                    <li><span onClick={()=>{
                                        navigate("/contact")}}> Paiment 10x </span></li>
                                    <li><span onClick={()=>{
                                        navigate("/contact")}}> Programme de fidélité </span></li>
                                    
                                </ul>
                            </nav>
                        </div>
                        <div className="offbox-container">
    {Array.from({ length: 12 }, (_, index) => (
        <div className="offrebox" key={index}>Box {index + 1}</div>
    ))}
</div></div>
      )
}
export default Offre ; 