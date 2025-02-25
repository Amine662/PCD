import React from "react";
import { FaArrowUp } from "react-icons/fa";
import { CiFacebook } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa6";
import { FiYoutube } from "react-icons/fi";
import { FaSquareXTwitter } from "react-icons/fa6";
import { PiLineVerticalThin } from "react-icons/pi";

import f from "./footer.css";

const Footer = () => {
  return (
    <>
      <div className="footer">
        <div className="back-to-top">
          <span>
            <a href="#top">
              Retour en haut page
              <FaArrowUp className="arrow"/>
            </a>
          </span>
        </div>
        <div className="first-footer">
          <span id="try">
            Vous êtes déjà plusieurs millions à nous suivre pour profiter de nos actus, conseils et bons plans !
          </span>
          <CiFacebook className="social-icon" />
          <FaSquareXTwitter className="social-icon" />
          <FaInstagram className="social-icon" />
          <FiYoutube className="social-icon" />
        </div>
        <div className="second-footer">
          <div className="list-container">
            <div>
              <ul>
                <li>
                  <div>SERVICES ET GARANTIES</div>
                  <ul>
                    <li>Garanties et assurance</li>
                    <li>Mon espace client</li>
                    <li>Mes commandes</li>
                    <li>Nos engagements RSE</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="divv">
              <ul>
                <li>
                  <div>LIVRAISON ET PAIEMENT</div>
                  <ul>
                    <li>Les modes en frais de livraison </li>
                    <li>Eco-participations et reprise</li>
                    <li>Les moyens de paiement</li>
                    <li>Paiement sécurisé</li>
                    <li>cdiscount à volonté</li>
                    <li>Paiement en plusieurs fois</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="divv">
              <ul>
                <li>
                  <div>CONTACTEZ-NOUS</div>
                  <ul>
                    <li>Contact Service Client </li>
                    <li>Contact Publicité</li>
                    <li>Cdiscount recrute </li>
                    <li>Affiliation</li>
                    <li>Notifier un contenu illicite</li>
                    <li>Cdiscount Dropshipping</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="divv">
              <ul>
                <li>
                  <div>DECOUVREZ NOTRE MARKETPLACE</div>
                  <ul>
                    <li>Vendre sur Cdiscount</li>
                    <li>Accès espace vendeur </li>
                    <li>FAQ</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="divv">
              <ul>
                <li>
                  <div>INFORMATIONS LEGALES</div>
                  <ul>
                    <li>Conditions générales de Vente</li>
                    <li>Conditions Générales d’Utilisation Marketplace </li>
                    <li>Protection de la vie privée et cookies</li>
                    <li>Référencement et classement</li>
                    <li>Mentions légales</li>
                    <li>Accessibilité numérique</li>
                    <li>Rappels de produits</li>
                    <li>Gérer mes cookies</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
