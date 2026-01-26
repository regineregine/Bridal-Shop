import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

// Images
import size1 from '../../assets/img/size1.jpg';
import size2 from '../../assets/img/size2.jpg';
import tips from '../../assets/img/tips.jpg';

export default function SizeGuide() {
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
        title="SIZE" 
        highlight="GUIDE" 
        subtitle="Find your perfect fit with our comprehensive wedding dress sizing guide and measurement instructions."
        extraClass="py-32"
      />

      <section className="py-16 md:py-10">
        <div className="relative z-10 m-auto max-w-7xl justify-center px-4 pb-4">

          <div 
            id="intro-section" 
            data-animate 
            className={`text-center transition-all duration-1000 ${
              visibleSections.has('intro-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <section className="py-8 md:py-12">
              <div className="mx-auto">
                {/* Placeholder for image gallery if needed, or just text intro */}
              </div>
            </section>
            <p className="text-slate-700 max-w-4xl mx-auto mb-6">
              We have created our own universal sizing chart that we use against all dresses on rack in store. We do not go
              off each dress's tagged sizes. With dresses being made from all over the world, size categories are not in sync.
              We have decided to have one system and measurements for each size category, every dress is measured and placed
              in a size on our universal list.
            </p>
            <p className="text-slate-700 max-w-4xl mx-auto mb-6">
              Wedding Dresses tend to measure much smaller than everyday clothes. Whilst this may be the case for all sizes,
              size 14 and up can differ by several sizes. You need to know your measurements to know what size category you
              fall in. We have provided a size chart below to help you work out what size you fall into with our dresses.
            </p>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-pink-600 mt-0.5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-slate-700 mb-3">
                    <strong>Important Notes & Reminders:</strong>
                  </p>
                  <ul className="text-slate-700 space-y-2 list-disc list-inside">
                    <li>If your measurements fall between two sizes, we recommend choosing the larger size. It is always easier to take a dress in than to let it out.</li>
                    <li><strong>Diet & Weight Changes:</strong> If your current diet or weight is expected to change significantly by the delivery date, 
                    the dress may not fit properly. Please consider maintaining a stable weight during the ordering period or ordering closer to your event date.</li>
                    <li>Measure yourself wearing the undergarments you plan to wear with your dress for the most accurate fit.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>


          {/* How to Measure Section */}
          <div 
            id="measure-section" 
            data-animate 
            className={`mb-16 mt-12 transition-all duration-1000 ${
              visibleSections.has('measure-section') 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8">
              <h3 className="font-Tinos text-2xl text-slate-900 mb-6 text-center">How to Measure Yourself</h3>
              <p className="text-center text-slate-700 mb-8 py-4">Dresses are measured and put into their closest size category.
                Please measure yourself wearing the undergarments you plan to wear with your dress.
              </p>

              {/* Measurement Images */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img src={size1} alt="Measurement Guide 1" className="w-full h-auto" />
                </div>
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <img src={size2} alt="Measurement Guide 2" className="w-full h-auto" />
                </div>
              </div>

              {/* Simple Checklist */}
              <div className="bg-candy-cream rounded-lg p-6 mb-8">
                <h4 className="font-semibold text-slate-900 mb-4">Measurement Checklist:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li><strong>Bust:</strong> Measure around the fullest part of your bust.</li>
                  <li><strong>Waist:</strong> Measure around your natural waistline (the smallest part of your waist).</li>
                  <li><strong>Hips:</strong> Measure around the fullest part of your hips.</li>
                  <li><strong>Hollow to Hem:</strong> Measure from the hollow of your neck to the bottom of the hem (with shoes on).</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Size Chart */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8 overflow-x-auto">
              <h3 className="font-Tinos text-2xl text-slate-900 mb-6 text-center">Size Chart</h3>
              <table className="w-full text-sm text-left text-slate-700">
                <thead className="text-xs text-slate-900 uppercase bg-pink-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Size</th>
                    <th scope="col" className="px-6 py-3">Bust (in)</th>
                    <th scope="col" className="px-6 py-3">Waist (in)</th>
                    <th scope="col" className="px-6 py-3">Hips (in)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">2</td>
                    <td className="px-6 py-4">32.5</td>
                    <td className="px-6 py-4">25.5</td>
                    <td className="px-6 py-4">35.75</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">4</td>
                    <td className="px-6 py-4">33.5</td>
                    <td className="px-6 py-4">26.5</td>
                    <td className="px-6 py-4">36.75</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">6</td>
                    <td className="px-6 py-4">34.5</td>
                    <td className="px-6 py-4">27.5</td>
                    <td className="px-6 py-4">37.75</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">8</td>
                    <td className="px-6 py-4">35.5</td>
                    <td className="px-6 py-4">28.5</td>
                    <td className="px-6 py-4">38.75</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">10</td>
                    <td className="px-6 py-4">36.5</td>
                    <td className="px-6 py-4">29.5</td>
                    <td className="px-6 py-4">39.75</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">12</td>
                    <td className="px-6 py-4">38</td>
                    <td className="px-6 py-4">31</td>
                    <td className="px-6 py-4">41.25</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">14</td>
                    <td className="px-6 py-4">39.5</td>
                    <td className="px-6 py-4">32.5</td>
                    <td className="px-6 py-4">42.75</td>
                  </tr>
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-slate-900">16</td>
                    <td className="px-6 py-4">41</td>
                    <td className="px-6 py-4">34</td>
                    <td className="px-6 py-4">44.25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Height Requirements */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8">
              <h3 className="font-Tinos text-2xl text-slate-900 mb-6 text-center">Height Requirements</h3>
              <p className="text-slate-700 mb-4">
                Most of our dresses are designed for a standard height of 5'9" (including heels). If you are taller than this,
                you may need to order extra length. If you are shorter, you will likely need to have the dress hemmed.
              </p>
            </div>
          </div>

          {/* Alteration Tips */}
          <div className="mb-16">
            <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="font-Tinos text-2xl text-slate-900 mb-6">Alteration Tips</h3>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                  <li>Plan for alterations: Almost every wedding dress needs some alterations to fit perfectly.</li>
                  <li>Bring your shoes: Always bring the shoes you plan to wear to your fittings.</li>
                  <li>Bring your undergarments: Wear the undergarments you plan to wear on your wedding day.</li>
                  <li>Start early: Allow 2-3 months for alterations.</li>
                </ul>
              </div>
              <div className="rounded-lg overflow-hidden">
                <img src={tips} alt="Alteration Tips" className="w-full h-auto" />
              </div>
            </div>
          </div>


          {/* Call to Action */}
          <div className="text-center">
            <h2 className="font-Tinos text-3xl text-slate-900 mb-4">Need Help Finding Your Size?</h2>
            <p className="text-slate-700 mb-8 max-w-2xl mx-auto">
              Our stylists are here to help you find the perfect fit. Contact us for personalized advice.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-block rounded-full bg-pink-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-pink-600">
                Contact Stylist
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
