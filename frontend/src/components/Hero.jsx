// Hero.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero-image.png'; // Use your uploaded image

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup'); // 
  };

  return (
    <section className="w-full px-6 md:px-16 py-12 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-8">
        {/* Left Side: Text */}
        <div className="flex-1">
          <h1 className="text-[40px] leading-[1.2] font-extrabold text-black tracking-tight">
            Turn your meetings <br />
            into <br />
            <span className="text-blue-600">action – <br /> automatically.</span>
          </h1>
          <p className="text-gray-600 text-[16px] leading-[1.6] mt-4 max-w-md">
            Meetings-360 converts your media into transcripts, summarizes key points, and assigns tasks—saving you hours every week.
          </p>
          <button
            className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            onClick={handleGetStarted}
          >
            Get started
          </button>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 flex justify-center">
          <img
            src={heroImage}
            alt="Hero"
            className="w-full max-w-[400px] h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
