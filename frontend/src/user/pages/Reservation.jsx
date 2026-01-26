import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import api from '../services/api';

export default function Reservation() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    type: 'Bridal Consultation',
    guests: 1,
    notes: '',
  });

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        appointment_date: formData.date,
        appointment_time: formData.time,
        type: formData.type,
        guests: formData.guests,
        notes: formData.notes,
      };

      await api.post('/reservations', payload);
      toast.success('Thank you! Your appointment request has been received.');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        type: 'Bridal Consultation',
        guests: 1,
        notes: '',
      });
    } catch (error) {
      console.error('Error submitting reservation:', error);
      toast.error('Failed to submit reservation. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <Hero
        title="BOOK AN"
        highlight=" APPOINTMENT"
        subtitle="Schedule your private consultation with our expert stylists."
        extraClass="py-32"
      />

      <section className="py-16 px-4">
        <div
          id="reservation-form"
          data-animate
          className={`max-w-3xl mx-auto bg-white rounded-lg shadow-[0_8px_30px_rgba(210,199,229,0.12)] p-8 transition-all duration-1000 ${
            visibleSections.has('reservation-form')
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="font-Tinos text-3xl text-slate-900 mb-6 text-center">
            Reservation Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Appointment Type
                </label>
                <select
                  name="type"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option>Bridal Consultation</option>
                  <option>Bridesmaids Consultation</option>
                  <option>Accessories Styling</option>
                  <option>Alterations</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Preferred Time
                </label>
                <select
                  name="time"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.time}
                  onChange={handleChange}
                >
                  <option value="">Select Time</option>
                  <option>10:00 AM</option>
                  <option>11:30 AM</option>
                  <option>1:00 PM</option>
                  <option>2:30 PM</option>
                  <option>4:00 PM</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  max="5"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                  value={formData.guests}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                rows="4"
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-pink-500 focus:ring-pink-500"
                placeholder="Tell us about your wedding date, venue, or specific styles you're interested in..."
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="inline-block rounded-full bg-pink-500 px-12 py-3 text-base font-semibold text-white transition-colors hover:bg-pink-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Request Appointment
              </button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
