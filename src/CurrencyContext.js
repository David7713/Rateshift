import React, { createContext, useState } from 'react';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [leftCurrency, setLeftCurrency] = useState('usd');
  const [rightCurrency, setRightCurrency] = useState('rub');

  return (
    <CurrencyContext.Provider value={{ leftCurrency, rightCurrency, setLeftCurrency, setRightCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
