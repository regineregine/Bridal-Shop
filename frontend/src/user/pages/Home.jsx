import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Images
import aboutImage from '../../assets/img/about-image.webp';
import ourProcess from '../../assets/img/our-process.jpg';

export default function Home() {
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Scroll animation observer
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

  const { isLoggedIn, user } = useAuth();

  return (
    <div className="bg-white">
      <Navbar />

      {/* HERO SECTION - Full Screen Background */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: 'url(/img/bg9.png)' }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 "></div>

        {/* Left Aligned Content */}
        <div className="relative z-10 flex h-full w-full flex-col items-start justify-center px-4 text-left lg:pl-24">
          {/* Main Heading */}
          <h1 className="pl-30 font-GreatVibes text-white mb-10 lg:text-9xl">
            {isLoggedIn ? (
              <>
              Wedding Dresses
              </>
            ) : (
              <>
                Welcome to <span className=" text-pink-300">Pro</span><span className=" text-pink-500">mise</span>{' '}
                
              </>
            )}
          </h1>

          {/* Subtext */}
          <p className="pl-40 font-Unna stroke-black  max-w-4xl text-lg text-white  md:text-2xl ">
            We design and curate stunning wedding dresses, blending elegance, comfort, and romance—because every bride deserves to shine on her wedding day.
          </p>

          {/* Buttons */}
          {isLoggedIn && (
            <div className="pl-70 mt-8 flex flex-col gap-4 sm:flex-row sm:gap-10 lg:mt-12">
              <a
                href="/profile"
                className="rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent sm:px-10 sm:py-4 sm:text-lg"
              >
                View Profile
              </a>
              <a
                href="/shop"
                className="rounded-full border-2 border-white bg-transparent px-8 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent sm:px-10 sm:py-4 sm:text-lg"
              >
                Shop Now
              </a>
            </div>
          )}
        </div>
      </section>

      {/* COLLECTIONS SHOWCASE */}
      <section
        id="collections-section"
        data-animate
        className={`bg-linear-to-b from-pink-50 to-white py-10 md:py-15 transition-all duration-1000 ${
          visibleSections.has('collections-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-5xl text-center mb-12">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-candy-lavender"></div>
              <h2 className="font-Tinos text-2xl leading-none tracking-widest text-slate-900 uppercase md:tracking-[0.6em] lg:tracking-[0.8em]">
                OUR COLLECTIONS
              </h2>
              <div className="h-px flex-1 bg-candy-lavender"></div>
            </div>
            <p className="font-Unna mt-6 text-base leading-7 text-slate-700 sm:text-lg md:text-xl">
              Discover our curated collections designed to make your special day
              unforgettable.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-4 lg:grid-cols-4">
            {/* Dresses Collection */}
            <Link
              to="/shop"
              state={{ selectedCategory: 'dresses' }}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-3/4 overflow-hidden bg-gray-200">
                <img
                  src="/img/d1.jpg"
                  alt="Dresses Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="font-Tinos text-2xl text-white mb-2">
                    Dresses
                  </h3>
                  <p className="text-white/90 text-sm">Elegant wedding gowns</p>
                </div>
              </div>
            </Link>

            {/* Veils Collection */}
            <Link
              to="/shop"
              state={{ selectedCategory: 'veils' }}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-3/4 overflow-hidden bg-gray-200">
                <img
                  src="/img/v1.jpg"
                  alt="Veils Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="font-Tinos text-2xl text-white mb-2">Veils</h3>
                  <p className="text-white/90 text-sm">
                    Delicate & romantic veils
                  </p>
                </div>
              </div>
            </Link>

            {/* Accessories Collection */}
            <Link
              to="/shop"
              state={{ selectedCategory: 'accessories' }}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-3/4 overflow-hidden bg-gray-200">
                <img
                  src="/img/a1.jpg"
                  alt="Accessories Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="font-Tinos text-2xl text-white mb-2">
                    Accessories
                  </h3>
                  <p className="text-white/90 text-sm">
                    Perfect finishing touches
                  </p>
                </div>
              </div>
            </Link>

            {/* Robes Collection */}
            <Link
              to="/shop"
              state={{ selectedCategory: 'robes' }}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-3/4 overflow-hidden bg-gray-200">
                <img
                  src="/img/r1.jpg"
                  alt="Robes Collection"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="font-Tinos text-2xl text-white mb-2">Robes</h3>
                  <p className="text-white/90 text-sm">
                    Luxurious bridal robes
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section
        id="brides-section"
        data-animate
        className={`grow py-16 md:py-20 transition-all duration-1000 ${
          visibleSections.has('brides-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="relative z-10 m-auto max-w-7xl justify-center py-2">
          {/* Revamped heading */}
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-candy-lavender"></div>
              <h2 className="font-Tinos text-center text-2xl leading-none tracking-widest text-slate-900 uppercase md:tracking-[0.6em] lg:tracking-[0.8em]">
                OUR BRIDES
              </h2>
              <div className="h-px flex-1 bg-candy-lavender"></div>
            </div>

            <p className="font-Unna mx-auto mt-6 mb-24 text-center text-base leading-7 text-slate-700 sm:text-lg md:text-xl">
              Promise couture aesthetics can be summed up in three words:
              feminine, flattering, and modern. Her wedding gowns are a
              magnificent assemblage of intricate beadworks and graceful
              patterns that perfectly fit the sensible romantic bride. It is of
              no surprise that Orlina is one of the sought-after wedding gown
              designers in the Philippines.
            </p>
          </div>

          <div className="group">
            <style>{`
              .reviews-swiper .swiper-button-next,
              .reviews-swiper .swiper-button-prev {
                opacity: 0;
                transition: opacity 0.3s ease;
                color: #ec4899; /* Tailwind pink-500 */
                --swiper-navigation-color: #ec4899;
              }
              .group:hover .reviews-swiper .swiper-button-next,
              .group:hover .reviews-swiper .swiper-button-prev {
                opacity: 1;
                color: #ec4899;
                --swiper-navigation-color: #ec4899;
              }
            `}</style>
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1.2}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              navigation={true}
              breakpoints={{
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 24,
                },
                768: {
                  slidesPerView: 2.5,
                  spaceBetween: 24,
                },
                1024: {
                  slidesPerView: 3.5,
                  spaceBetween: 24,
                },
              }}
              className="reviews-swiper pb-12"
            >
              {/* Item 1 */}
              <SwiperSlide>
                <figure role="listitem">
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/pp-3.jpg"
                      alt="Gwynne M."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Gwynne M.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "I knew the Elmi was everything I wanted, but I was
                      nervous to order online. I did it anyway and was blown
                      away."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 2 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/p-5.webp"
                      alt="Brianna F.K."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Brianna F.K.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "The quality is INSANE. The glitter was perfect, boning
                      and structure were top tier in the corset."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 3 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/pp-7.jpg"
                      alt="Brittany F."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Brittany F.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "I just wanna say a big thank you to everyone who made our
                      big day so incredible."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 4 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/d11.jpg"
                      alt="Camille R."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold font-Tinos text-slate-900">
                      Camille R.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "The staff was incredible and the dress was perfect."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 5 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/d10.jpg"
                      alt="Samantha P."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Samantha P.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "Absolutely beautiful gown and top notch service."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 6 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/d13.jpg"
                      alt="Samantha P."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Samantha P.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "Absolutely beautiful gown and top notch service."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 7 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/d14.jpg"
                      alt="Samantha P."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Samantha P.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "Absolutely beautiful gown and top notch service."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 8 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/d15.jpg"
                      alt="Samantha P."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Samantha P.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "Absolutely beautiful gown and top notch service."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>

              {/* Item 9 */}
              <SwiperSlide>
                <figure>
                  <div className="aspect-3/4 overflow-hidden rounded-lg bg-white">
                    <img
                      src="/img/d16.jpg"
                      alt="Samantha P."
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-center">
                    <div className="font-semibold text-slate-900">
                      Samantha P.
                    </div>
                    <blockquote className="mt-2 min-h-14 text-sm text-slate-700 sm:min-h-12">
                      "Absolutely beautiful gown and top notch service."
                    </blockquote>
                  </figcaption>
                </figure>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      {/* Story & Image */}
      <section
        id="story-section"
        data-animate
        className={`py-16 md:py-20 bg-slate-900 transition-all duration-1000 ${
          visibleSections.has('story-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl bg-slate-900">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {/* Left: text panel */}
              <div className="flex items-center justify-center md:justify-start">
                <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left">
                  <h2 className="font-Tinos mt-2 text-4xl text-white sm:text-5xl">
                    OUR STORY
                  </h2>
                  <p className="font-Unna mt-6 text-xl text-gray-300">
                    Promise was founded to bring beautifully crafted wedding
                    attire to couples who want timeless elegance with modern
                    comfort. We blend artisanal techniques with carefully chosen
                    fabrics, focusing on fit, detail and sustainable practices.
                    Our mission is to make every couple feel confident and
                    celebrated.
                  </p>
                  <a
                    href="/contact"
                    aria-label="Learn more about our trunk show"
                    className="mt-8 inline-block rounded-md border border-white px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 focus:outline-none"
                  >
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Right: image panel */}
              <div className="relative">
                <div className="overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(2,6,23,0.15)]">
                  <div className="aspect-3/4 md:aspect-3/4">
                    <img
                      src={aboutImage}
                      alt="Brides trying on dresses at a trunk show"
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROCESS (Blog-style card) */}
      <section
        id="process-section"
        data-animate
        className={`bg-candy-cream py-16 md:py-20 transition-all duration-1000 ${
          visibleSections.has('process-section')
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
              {/* Left image with double border frame */}
              <div className="flex justify-center md:col-span-4 md:justify-start">
                <div className="border border-slate-700 p-2">
                  <div className="border border-slate-700">
                    <img
                      src={ourProcess}
                      alt="Detailed bodice of a wedding gown on a mannequin"
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right content */}
              <div className="md:col-span-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-Tinos text-2xl text-slate-800 sm:text-3xl md:text-4xl">
                    OUR PROCESS
                  </h3>
                </div>
                <hr className="mt-2 border-slate-300" />
                <p className="font-unna mt-6 leading-7 text-slate-700">
                  From initial design sketches to the final fitting, our process
                  centers on collaboration. We consult closely with you to
                  select fabrics, refine silhouettes, and ensure your dress or
                  suit reflects your vision. Small production runs allow for
                  careful quality control at every stage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Go Shopping Button */}
      <div className="m-6 flex justify-center sm:m-8">
        <a
          href="/shop"
          className="inline-block rounded-full transition-colors hover:bg-pink-400 bg-pink-200 px-8 py-4 text-base font-Unna-bold text-black focus:outline-none sm:px-10 sm:py-5 sm:text-lg"
        >
          SHOP NOW
        </a>
      </div>

      <Footer />
    </div>
  );
}
