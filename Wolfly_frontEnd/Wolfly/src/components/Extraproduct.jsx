import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Black_Jacket_Front from '../Images/Black_Jacket_Front.png';
import Blue_Tshirt_Front from '../Images/Blue_Tshirt_Front.png';
import Maroon_Front from '../Images/Maroon_Front.png';

const Extraproduct = () => {
  const [data] = useState([
    {
      offer: "Get An Extra 50% Off",
      link: "",
      img: Black_Jacket_Front,
    },
    {
      offer: "40% Discount On Speakers",
      link: "",
      img: Blue_Tshirt_Front,
    },
    {
      offer: "Get An Extra 50% Off",
      link: "",
      img: Maroon_Front,
    },
  ]);

  return (
    <section className="my-0 mx-7 p-6 shadow-lg rounded-lg
      bg-gradient-to-r from-black via-gray-800 to-white text-white
      transition-colors duration-500 ease-in-out"
    >
      <div className="flex flex-wrap justify-between gap-6">
        {data.map((element, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900
              rounded-xl p-5 md:p-7 flex-1 min-w-[280px] shadow-md hover:scale-105 transform transition-transform duration-300"
          >
            <div className="md:mr-8 text-center md:text-left mb-4 md:mb-0">
              <p className="inline-block bg-teal-700 text-teal-100 px-5 py-1 rounded-full text-lg font-semibold tracking-wide">
                NEW YEAR SALE
              </p>
              <h3 className="font-bold text-2xl mt-3 mb-2">{element.offer}</h3>
              <NavLink
                to={element.link || '#'}
                target="_blank"
                className="text-sm text-teal-300 hover:underline"
              >
                SHOW NOW
              </NavLink>
            </div>

            <div className="flex justify-center">
              <img
                src={element.img}
                alt={element.offer}
                className="w-36 h-36 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Extraproduct;
