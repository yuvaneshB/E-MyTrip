import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, Mail, Phone, ShieldCheck, Award, Headphones, BadgeCheck 
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { motion, useReducedMotion } from 'framer-motion';

const HomeFooter = () => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <footer className="w-full bg-[#0b1329] text-slate-300 font-sans border-t border-slate-800/60 relative overflow-hidden" aria-label="ExploreMyTrip Footer">
      {/* Background soft glow accents */}
      <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 pt-16 pb-12 relative z-10"
      >
        {/* Main 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Company */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="inline-block" aria-label="ExploreMyTrip Home">
              <img src={logo} alt="ExploreMyTrip Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              ExploreMyTrip helps travelers discover unforgettable destinations, book memorable experiences, and travel with confidence across the world.
            </p>
            <ul className="space-y-3 pt-2 text-xs" aria-label="Contact Information">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                <span>Chennai, Tamil Nadu, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
                <a href="mailto:support@exploremytrip.com" className="hover:text-blue-400 transition-colors duration-250">
                  support@exploremytrip.com
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" aria-hidden="true" />
                <a href="tel:+91XXXXX XXXXX" className="hover:text-blue-400 transition-colors duration-250">
                  +91 XXXXX XXXXX
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col space-y-4 md:pl-4 lg:pl-8">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-xs font-medium" aria-label="Quick Links Navigation">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors duration-200 block py-0.5">Home</Link>
              </li>
              <li>
                <Link to="/tours" className="hover:text-blue-400 transition-colors duration-200 block py-0.5">Explore Tours</Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-blue-400 transition-colors duration-200 block py-0.5">Destinations</Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-blue-400 transition-colors duration-200 block py-0.5">My Bookings</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-blue-400 transition-colors duration-200 block py-0.5">Wishlist</Link>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed block py-0.5" title="Under Development">About Us</span>
              </li>
              <li>
                <span className="text-slate-500 cursor-not-allowed block py-0.5" title="Under Development">Contact Us</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Travel Services */}
          <div className="flex flex-col space-y-4 lg:pl-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Travel Services</h3>
            <ul className="space-y-2.5 text-xs font-medium" aria-label="Travel Services Information">
              {[
                'Domestic Tours',
                'International Tours',
                'Adventure Trips',
                'Family Packages',
                'Honeymoon Packages',
                'Luxury Vacations',
                'Travel Insurance',
                'Visa Assistance'
              ].map((service) => (
                <li key={service}>
                  <span className="text-slate-400 hover:text-white transition-colors duration-200 block py-0.5 cursor-default">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5 text-xs font-medium" aria-label="Customer Support Links">
              {[
                'Help Center',
                'Customer Support',
                'FAQs',
                'Terms & Conditions',
                'Privacy Policy',
                'Cancellation Policy',
                'Refund Policy'
              ].map((item) => (
                <li key={item}>
                  <span className="text-slate-500 cursor-not-allowed block py-0.5" title="Under Development">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Mid Footer Section: Trust Badges, Socials, Payments */}
        <div className="pt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          
          {/* Trust Badges */}
          <div className="flex flex-wrap gap-4 justify-start items-center" aria-label="Trust Badges">
            <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/50 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/50 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
              <Award className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
              <span>Trusted Travel Partner</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/50 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
              <Headphones className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
              <span>24×7 Support</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/50 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
              <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0" aria-hidden="true" />
              <span>Verified Operators</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex justify-start lg:justify-center items-center space-x-5" aria-label="Social Media Connections">
            {/* Facebook */}
            <a
              href="#"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Visit our Facebook page"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Visit our Instagram page"
            >
              <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            {/* X (Twitter) */}
            <a
              href="#"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Visit our X (Twitter) page"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a
              href="#"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Visit our LinkedIn page"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a
              href="#"
              className="text-slate-400 hover:text-blue-500 transition-colors duration-200"
              aria-label="Visit our YouTube page"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.53 3.5 12 3.5 12 3.5s-7.53 0-9.388.555A3.002 3.002 0 0 0 .502 6.163C0 8.07 0 12 0 12s0 3.93.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.47 20.5 12 20.5 12 20.5s7.53 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.93 24 12 24 12s0-3.93-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:justify-end" aria-label="Accepted Payment Methods">
            <span className="text-xs font-semibold text-slate-400 tracking-wider text-left lg:text-right">WE ACCEPT</span>
            <div className="flex flex-wrap items-center gap-3">
              {/* Visa */}
              <div className="bg-slate-900/60 border border-slate-800 px-2.5 py-1.5 rounded-md flex items-center justify-center h-8" title="Visa">
                <svg className="h-3.5 w-auto text-white fill-current" viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M37.9 2.5l-6 26.6h-5.8L20.2 6.8c-.5-1.9-1.9-3.3-3.6-4L9.8 2.5h-.2v.5c1.4.3 2.9.8 4.2 1.6s2 1.8 2.3 3.3l4.7 18.2h6.1L36.2 2.5zM76.9 8.8c.1-2-.7-3.9-2.2-5-2.2-1.6-5.8-2.3-9.5-2v.6c2 .5 3.9 1.4 5.3 2.8 1.1 1.1 1.7 2.6 1.6 4.2 0 4-5.3 4.9-5.3 7.8 0 2.2 1.8 4.1 4.7 4.1 2.3 0 4.5-.6 6.3-1.8l.6-.4-.8-3.9-.6.4c-1.4.9-3.1 1.4-4.8 1.4-1.6.1-2.9-.8-2.9-2 0-3.3 5.3-3.9 5.3-8.2zM52.8 2.5l-6 26.6h5.8l6-26.6zM99.8 2.5c-.8-.2-2-.3-3.1-.3-3.5 0-6.1 1.7-6.2 5.1-.1 2.4 1.8 3.8 3.2 4.6 1.5.8 2 1.3 2 2 0 1.1-1.2 1.6-2.3 1.6-1.7 0-3.1-.5-4.4-1.2l-.7-.4-.8 4.9c1.3.6 2.8.9 4.3.9 3.7 0 6.1-1.8 6.1-4.7.1-2-1.1-3.6-3.7-4.8-1.5-.7-2.4-1.3-2.4-2.1 0-.7.7-1.4 2.2-1.4 1.3-.1 2.6.3 3.7.9l.5.3z" />
                </svg>
              </div>
              {/* MasterCard */}
              <div className="bg-slate-900/60 border border-slate-800 px-2.5 py-1.5 rounded-md flex items-center justify-center h-8" title="MasterCard">
                <svg className="h-4.5 w-auto" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="35" cy="30" r="25" fill="#EB001B" opacity="0.9" />
                  <circle cx="65" cy="30" r="25" fill="#F79E1B" opacity="0.9" />
                  <path d="M50 12.8a24.9 24.9 0 0 1 9.4 17.2 24.9 24.9 0 0 1-9.4 17.2 24.9 24.9 0 0 1-9.4-17.2A24.9 24.9 0 0 1 50 12.8z" fill="#FF5F00" />
                </svg>
              </div>
              {/* RuPay */}
              <div className="bg-slate-900/60 border border-slate-800 px-2.5 py-1.5 rounded-md flex items-center justify-center h-8 text-[11px] font-black tracking-tighter text-white select-none" title="RuPay">
                <span className="text-[#3273b5]">Ru</span><span className="text-[#e26724]">Pay</span>
              </div>
              {/* UPI */}
              <div className="bg-slate-900/60 border border-slate-800 px-2.5 py-1.5 rounded-md flex items-center justify-center h-8 text-[10px] font-extrabold italic text-white tracking-tight select-none" title="UPI">
                <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">UPI</span>
              </div>
              {/* Razorpay */}
              <div className="bg-slate-900/60 border border-slate-800 px-2.5 py-1.5 rounded-md flex items-center justify-center h-8 text-[9px] font-bold text-white tracking-widest select-none" title="Razorpay">
                <span className="text-sky-400">RAZOR</span>PAY
              </div>
            </div>
          </div>

        </div>



      </motion.div>
    </footer>
  );
};

export default HomeFooter;
