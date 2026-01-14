import React from "react";
import "../css/Footer.css";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Health Articles</li>
            <li>Health Stories</li>
            <li>Diseases & Conditions</li>
            <li>Ayurveda</li>
            <li>All Medicines</li>
            <li>All Brands</li>
            <li>Need Help</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Social</h4>
          <div className="footer-socials">
            <FaInstagram />
            <FaFacebookF />
            <FaYoutube />
            <FaLinkedinIn />
          </div>

          <h4>Legal</h4>
          <ul>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Editorial Policy</li>
            <li>Returns & Cancellations</li>
          </ul>
        </div>
        <div className="footer-col hide-mobile">
          <h4>Subscribe</h4>
          <p>
            Claim your complimentary health and fitness tips subscription and stay updated on our latest promotions.
          </p>
          <div className="subscribe-box">
            <input type="email" placeholder="Enter your email ID" />
            <button>Subscribe</button>
          </div>

          <div className="footer-address">
            <h4>Registered Office Address</h4>
            <p>
              <strong>Intellihealth Solutions Pvt. Ltd.</strong><br />
              Office Unit no. 1, 2, 5, & 7, 6th Floor, Urmi Corporate Park Solaris,
              Saki Vihar Rd, Opp. L&T Flyover, Mumbai, Maharashtra 400072.<br />
              <strong>CIN:</strong> U62099MH2019PTC320566<br />
              <strong>Telephone:</strong> <span className="highlight">0987654321</span>
            </p>
            <h4>Grievance Officer</h4>
            <p>
              <strong>Name:</strong> Swapnil Ramteke<br />
              <strong>Email:</strong>{" "}
              <span className="highlight">swapnilramteke004@gmail.com</span>
            </p>
          </div>
        </div>
        <div className="footer-col hide-mobile">
          <h4>Download Apnameds</h4>
          <p>
            Get easy access to medicine refills and health information. Download now to take control of your health.
          </p>
          <div className="app-buttons">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
              alt="Google Play"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
            />
          </div>

          <h4>Contact Us</h4>
          <p>
            swapnilramteke004@gmail.com <br />
            0987654321 <br />
            Available 8:00 am - 10:00 pm
            <br />
            v4.0.2
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <div>© 2025 - Apnameds | All rights reserved.</div>
        <div className="payment-icons">
          <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="Visa" />
          <img src="https://cdn-icons-png.flaticon.com/512/349/349230.png" alt="Mastercard" />
          <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" alt="Paytm" />
          <img src="https://cdn-icons-png.flaticon.com/512/349/349236.png" alt="Netbanking" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
