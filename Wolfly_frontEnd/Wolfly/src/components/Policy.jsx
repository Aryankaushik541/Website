import React, { useState } from 'react';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import SyncIcon from '@mui/icons-material/Sync';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Policy = () => {
  const [data] = useState([
    {
      icon: LocalShippingIcon,
      first_para: "Worldwide Shipping",
      second_para: "Order Above $100",
    },
    {
      icon: SyncIcon,
      first_para: "Easy 30 Day Returns",
      second_para: "Back Returns In 7 Days",
    },
    {
      icon: MonetizationOnIcon,
      first_para: "Money Back Guarantee",
      second_para: "Guarantee Within 30-Days",
    },
    {
      icon: HeadphonesIcon,
      first_para: "Easy Online Support",
      second_para: "24/7 Any Time Support",
    }
  ]);

  return (
    <section className="my-5 mx-7 p-8 shadow-lg rounded-lg
      bg-gradient-to-r from-black via-gray-800 to-white text-white
      transition-colors duration-500 ease-in-out
      flex justify-between flex-wrap md:flex-row flex-col gap-6"
    >
      {data.map((element, index) => {
        const Icon = element.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-6 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900
              rounded-xl p-6 flex-1 min-w-[220px] hover:scale-105 transform transition-transform duration-300 shadow-md"
          >
            <div className="text-teal-400 text-5xl">
              <Icon fontSize="inherit" />
            </div>

            <div>
              <p className="text-xl font-semibold">{element.first_para}</p>
              <p className="text-sm text-gray-300">{element.second_para}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Policy;
