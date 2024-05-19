import React, { useContext } from 'react';
import Select from 'react-select';
import CurrencyContext from './CurrencyContext';
import './Styles/CurrencyDropDown.css'
import { FaArrowRightArrowLeft } from "react-icons/fa6";

const CurrencyDropdown = () => {
  const { leftCurrency, rightCurrency, setLeftCurrency, setRightCurrency } = useContext(CurrencyContext);

  // Options for currency pairs
  const options = [
    { value: 'usd', label: 'USD' },
    { value: 'rub', label: 'RUB' },
    { value: 'gel', label: 'GEL' },
    { value: 'amd', label: 'AMD' },
  ];

  // Handle select change for left dropdown
  const handleLeftChange = (selectedOption) => {
    setLeftCurrency(selectedOption.value);
  };

  // Handle select change for right dropdown
  const handleRightChange = (selectedOption) => {
    setRightCurrency(selectedOption.value);
  };

  // Swap currencies
  const swapCurrencies = () => {
    const tempCurrency = leftCurrency;
    setLeftCurrency(rightCurrency);
    setRightCurrency(tempCurrency);
  };

  return (
   
    <div className='currency-select-main-part'>
      <p className='header-part'>RateShift-Обмен валюты</p>
      <div className='currency-select-part'>
      <Select
      className='currency-select'
        options={options}
        value={options.find(option => option.value === leftCurrency)}
        onChange={handleLeftChange}
        placeholder="Select currency 1"
      />
      <div>
        <button  className="currency-change-button"onClick={swapCurrencies}><FaArrowRightArrowLeft />
</button>

        </div>
   
      <Select
          className='currency-select'
        options={options}
        value={options.find(option => option.value === rightCurrency)}
        onChange={handleRightChange}
        placeholder="Select currency 2"
      />
         </div>
    </div>
  );
};

export default CurrencyDropdown;
