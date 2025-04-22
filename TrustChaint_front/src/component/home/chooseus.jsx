import React from 'react';
import { GiPadlock } from "react-icons/gi";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { CiCreditCard1 } from "react-icons/ci";
import { IoFlashSharp } from "react-icons/io5";
import './chooseus.css'; // Assuming you have a CSS file for styles

const Chooseus = () => {
  return (
    <>
      <section className="py-5 bg-light">
        <div className="container px-4">
          <div className="text-center mb-5">
            <h2 className="h2 fw-bold text-dark mb-3">Why Choose Us?</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
              TrustChain combines the best of e-commerce with blockchain technology for a secure, transparent shopping experience.
            </p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: <GiPadlock size={40} />,
                title: 'Secure Transactions',
                description:
                  'Every purchase is secured with blockchain technology, providing an immutable record and eliminating fraud risks.',
              },
              {
                icon: <MdOutlineVerifiedUser size={40} />,
                title: 'Transparency',
                description:
                  'Track your orders on the blockchain, providing complete visibility and verification for all your purchases.',
              },
              {
                icon: <CiCreditCard1 size={40} />,
                title: 'Multiple Payment Options',
                description:
                  'Choose between traditional payment methods or cryptocurrencies for maximum flexibility and convenience.',
              },
              {
                icon: <IoFlashSharp size={40} />,
                title: 'Fast & Reliable',
                description:
                  "Quick order processing and delivery tracking, with notifications at every step of your order's journey.",
              },
            ].map((feature, index) => (
              <div className="col-12 col-sm-6 col-md-3" key={index}>
                <div className="chooseus-box bg-dark text-warning rounded text-center py-4 px-3 h-100">
                  <div className="mb-3">{feature.icon}</div>
                  <h5 className="text-light mb-2 fw-semibold fs-6">{feature.title}</h5>
                  <p className="text-light mb-0 small">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Chooseus;
