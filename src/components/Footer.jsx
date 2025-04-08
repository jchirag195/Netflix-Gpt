import React from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaWhatsapp, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 px-4 md:px-16">
      <div className="max-w-6xl mx-auto">
        
        {/* Netflix Logo and Copyright */}
        <div className="text-center mb-6">
          <h1 className="text-red-600 text-3xl font-bold">NETFLIX</h1>
          <p className="text-gray-500">© 2025 All rights reserved</p>
        </div>

        {/* Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          {/* Useful Links */}
          <div>
            <h2 className="text-white text-lg mb-2">Useful Links</h2>
            <ul className="text-gray-400 space-y-2">
              <li>Home</li>
              <li>FAQ</li>
              <li>Account</li>
              <li>Privacy Policy</li>
              <li>Help Center</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h2 className="text-white text-lg mb-2">Contact Us</h2>
            <div className="flex justify-center md:justify-start gap-4 text-white text-2xl">
              <a href="https://www.instagram.com/chirag_joshi__18" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="hover:text-pink-500" />
              </a>
              <a href="https://www.linkedin.com/in/chirag-joshi-🚀-034730281/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="hover:text-blue-500" />
              </a>
              <a href="https://github.com/jchirag195/Netflix-Gpt" target="_blank" rel="noopener noreferrer">
                <FaGithub className="hover:text-gray-300" />
              </a>
              <a href="mailto:jchirag195@gmail.com">
                <FaEnvelope className="hover:text-red-500" />
              </a>
              <a href="https://wa.me/8511599964" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="hover:text-green-500" />
              </a>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div>
            <h2 className="text-white text-lg mb-2">Subscribe for Updates</h2>
            <div className="flex items-center border border-gray-600 rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-black text-white px-4 py-2 w-full outline-none"
              />
              <button className="bg-red-600 px-4 py-2 text-white hover:bg-red-700">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Final Note */}
        <div className="text-sm text-center mt-6 text-gray-500">
          <p>Made with <span className="text-red-600">❤️</span> by <span className="text-white font-semibold">Chirag</span></p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
