import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

export default function RefundPolicy() {
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
        title="REFUND" 
        highlight="POLICY" 
        subtitle="Our comprehensive refund and cancellation policy for wedding dress orders."
        extraClass="py-32"
      />

      <div className="mx-auto max-w-4xl px-4 py-16">
        <div 
          id="policy-intro" 
          data-animate 
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.has('policy-intro') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8 mb-8">
            <h2 className="font-Tinos text-3xl text-slate-900 mb-4">Refund & Cancellation Policy</h2>
            <p className="text-slate-700 mb-4">
              At Promise Atelier, we understand that planning a wedding involves many details and sometimes plans change. 
              This policy outlines our refund and cancellation procedures for wedding dress orders.
            </p>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
              <p className="text-slate-700">
                <strong>Quick Summary:</strong> Cancellations are allowed up to <strong>45 days before the event date</strong> or 
                <strong> before production begins</strong>, whichever comes first. After this period, all orders are non-refundable.
              </p>
            </div>
          </div>
        </div>

        <div 
          id="policy-stages" 
          data-animate 
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.has('policy-stages') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8">
            <h3 className="font-Tinos text-2xl text-slate-900 mb-6">Policy by Stage</h3>
            
            <div className="space-y-6">
              {/* Stage 1 */}
              <div className="border-l-4 border-green-500 pl-6 py-4 bg-green-50 rounded-r-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  1️⃣ Before Production Starts
                </h4>
                <p className="text-slate-700 mb-2">
                  <strong>Timeframe:</strong> 30-45 days before event or before production begins
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>Refund:</strong> Full refund minus admin/design fee (10-20%)
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Reason:</strong> No materials cut yet. This is the safest time to cancel with minimal financial impact.
                </p>
              </div>

              {/* Stage 2 */}
              <div className="border-l-4 border-yellow-500 pl-6 py-4 bg-yellow-50 rounded-r-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  2️⃣ After Production Starts
                </h4>
                <p className="text-slate-700 mb-2">
                  <strong>Refund:</strong> ❌ No refund
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>Option:</strong> Store credit only (at shop's discretion)
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Reason:</strong> Custom work already done. Materials have been cut specifically for your order.
                </p>
              </div>

              {/* Stage 3 */}
              <div className="border-l-4 border-orange-500 pl-6 py-4 bg-orange-50 rounded-r-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  3️⃣ After Fitting / Alteration Stage
                </h4>
                <p className="text-slate-700 mb-2">
                  <strong>Refund:</strong> ❌ No refund, no exchange
                </p>
                <p className="text-sm text-slate-600">
                  <strong>Reason:</strong> Dress is fully customized to your measurements. Alterations are labor-heavy and non-reusable.
                </p>
              </div>

              {/* Stage 4 */}
              <div className="border-l-4 border-red-500 pl-6 py-4 bg-red-50 rounded-r-lg">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  4️⃣ After Delivery Completed
                </h4>
                <p className="text-slate-700 mb-2">
                  <strong>Refund:</strong> ❌ No refund
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>Exceptions:</strong>
                </p>
                <ul className="text-sm text-slate-600 list-disc list-inside ml-4 space-y-1">
                  <li>Wrong size due to shop error</li>
                  <li>Major defect (not fit preference)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div 
          id="policy-details" 
          data-animate 
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.has('policy-details') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8">
            <h3 className="font-Tinos text-2xl text-slate-900 mb-6">Important Details</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Diet & Body Change Clause</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-slate-700">
                    Custom wedding dresses are created based on the measurements provided at the time of order. 
                    Changes in body size due to diet, fitness, pregnancy, or health conditions after production begins 
                    are <strong>not eligible for refunds or remakes</strong>.
                  </p>
                  <p className="text-slate-700 mt-2">
                    We recommend maintaining a stable weight during the ordering period or ordering closer to your event date 
                    if significant weight changes are expected.
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Production Timeline</h4>
                <p className="text-slate-700 mb-2">
                  Production typically begins 30-60 days before your event date, depending on the complexity of the dress. 
                  We will notify you when production begins, and this marks the cutoff point for full refunds.
                </p>
                <p className="text-slate-700">
                  If you need to cancel, please contact us as soon as possible to determine which stage your order is in.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Refund Processing</h4>
                <p className="text-slate-700 mb-2">
                  Approved refunds will be processed to the original payment method within 5-7 business days. 
                  Admin/design fees (10-20%) are non-refundable and cover the initial consultation, design work, and order processing.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-3">Store Credit</h4>
                <p className="text-slate-700 mb-2">
                  In some cases, store credit may be offered for orders cancelled after production begins. 
                  This is at the discretion of Promise Atelier and will be evaluated on a case-by-case basis.
                </p>
                <p className="text-slate-700">
                  Store credit is valid for 12 months from the date of issue and can be used toward any product or service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div 
          id="policy-contact" 
          data-animate 
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.has('policy-contact') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-pink-50 border border-pink-200 rounded-lg p-8 text-center">
            <h3 className="font-Tinos text-2xl text-slate-900 mb-4">Questions or Concerns?</h3>
            <p className="text-slate-700 mb-6">
              If you have any questions about our refund policy or need to discuss a cancellation, 
              please don't hesitate to contact us. We're here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-block rounded-full bg-pink-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-pink-600"
              >
                Contact Us
              </Link>
              <Link
                to="/shop"
                className="inline-block rounded-full border-2 border-pink-500 px-8 py-3 text-base font-semibold text-pink-500 transition-colors hover:bg-pink-50"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        <div 
          id="policy-table" 
          data-animate 
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.has('policy-table') 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8 overflow-x-auto">
            <h3 className="font-Tinos text-2xl text-slate-900 mb-6 text-center">Policy Summary Table</h3>
            <table className="w-full text-sm text-left text-slate-700">
              <thead className="text-xs text-slate-900 uppercase bg-pink-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Stage</th>
                  <th scope="col" className="px-6 py-3">Timeframe</th>
                  <th scope="col" className="px-6 py-3">Refund Policy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-slate-900">Before production</td>
                  <td className="px-6 py-4">30-45 days prior</td>
                  <td className="px-6 py-4">Partial refund (minus 10-20% fee)</td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-slate-900">After production starts</td>
                  <td className="px-6 py-4">Production begun</td>
                  <td className="px-6 py-4">No refund</td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-slate-900">After fitting/alteration</td>
                  <td className="px-6 py-4">Alterations completed</td>
                  <td className="px-6 py-4">No refund</td>
                </tr>
                <tr className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-slate-900">After delivery</td>
                  <td className="px-6 py-4">Dress delivered</td>
                  <td className="px-6 py-4">No refund (except defects)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

