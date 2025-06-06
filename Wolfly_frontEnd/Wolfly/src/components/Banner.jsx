import React, { useState, useEffect } from 'react';
import slider1 from '../Images/Banner/slider1.png';
import slider2 from '../Images/Banner/slider2.png';
import slider3 from '../Images/Banner/slider3.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [slider1, slider2, slider3];

const Banner = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 4000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <>
            <main className='relative w-full bg-pink-500'> {/* Changed bg-black to bg-pink-500 */}
                <section className='relative flex items-center justify-center h-96 overflow-hidden'>
                    <div className='relative w-full h-full flex items-center justify-center overflow-hidden'>
                        <div className='w-full h-full flex transition-transform duration-700 ease-in-out'
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    className='w-full h-full object-cover flex-shrink-0'
                                    alt={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <button onClick={prevSlide} className='absolute left-5 bg-black p-2 rounded-full text-white hover:bg-gray-700'>
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextSlide} className='absolute right-5 bg-black p-2 rounded-full text-white hover:bg-gray-700'>
                        <ChevronRight size={24} />
                    </button>
                </section>
            </main>
        </>
    );
}

export default Banner;
