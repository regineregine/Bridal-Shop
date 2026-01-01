import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

export default function Contact() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => new Set([...prev, entry.target.id]));
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <Hero 
        title="CONTACT" 
        highlight=" US" 
        subtitle="Where inspired design, expert craftsmanship, and genuine care come together to create lasting memories."
        extraClass="py-32"
      />

      <div className="mx-auto max-w-7xl px-4 py-20">
        {/* Contact US */}
        <section 
          id="contact-section" 
          data-animate 
          className={`mb-12 card grid grid-cols-1 gap-6 lg:grid-cols-2 p-6 rounded-2xl border border-neutral-light bg-white shadow-soft transition-all duration-1000 ${
            visibleSections.has('contact-section') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 sm:text-xl">
              Contact Us
            </h3>
            <p className="mb-4 text-sm text-slate-700 sm:text-base">
              Have questions or want to schedule a fitting? Send us a message and
              we'll get back to you within 48 hours.
            </p>
            <form id="contact-form" className="space-y-4" noValidate>
              <div>
                <label htmlFor="contact-name" className="block text-slate-900 font-medium mb-1">Name <span className="text-red-500">*</span></label>
                <input id="contact-name" name="name" type="text" required minLength="2" autoComplete="name"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <p className="text-red-500 text-sm mt-1 hidden" id="contact-name-error"></p>
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-slate-900 font-medium mb-1">Email <span className="text-red-500">*</span></label>
                <input id="contact-email" name="email" type="email" required autoComplete="email" placeholder="you@email.com"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
                <p className="text-red-500 text-sm mt-1 hidden" id="contact-email-error"></p>
              </div>
              <div>
                <label htmlFor="contact-subject" className="block text-slate-900 font-medium mb-1">Subject</label>
                <input id="contact-subject" name="subject" type="text" placeholder="Subject (optional)"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400" />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-slate-900 font-medium mb-1">Message <span className="text-red-500">*</span></label>
                <textarea id="contact-message" name="message" required rows="3" placeholder="Your message (min 10 characters)"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"></textarea>
                <p className="text-red-500 text-sm mt-1 hidden" id="contact-message-error"></p>
              </div>
              <button type="submit" className="w-full bg-pink-500 text-white py-2 rounded-xl hover:bg-pink-600 transition">Send Message</button>
            </form>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-bold text-slate-900 sm:text-xl">
              Visit or write to us
            </h3>
            <div className="mb-4 text-sm text-slate-700 sm:text-base space-y-1">
              <p>Promise Atelier</p>
              <p>0321 December Avenue</p>
              <p>Philippines</p>
              <p>
                Email: <a href="mailto:info@promise.com" className="text-pink-500 hover:underline">info@promise.com</a>
              </p>
              <p>
                Phone: <a href="tel:+639123456789" className="text-pink-500 hover:underline">+63 912 345 6789</a>
              </p>
            </div>

            <div className="mt-8">
              <div className="mb-3 font-medium text-slate-900">Follow us:</div>
              <div className="flex items-center gap-4">
                {/* Social Icons Placeholders */}
                <a href="#" className="text-slate-400 hover:text-pink-500 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-pink-500 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468.99c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>

              <div className="mt-4 card p-4  rounded-xl">
                <h4 className="font-semibold text-pink-900 mb-2">Opening Hours</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span></li>
                  <li className="flex justify-between"><span>Saturday:</span> <span>10:00 AM - 4:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
