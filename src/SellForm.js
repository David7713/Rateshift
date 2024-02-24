import React, { useContext, useState, useEffect } from 'react';
import CurrencyContext from './CurrencyContext';
import '../src/Styles/SellForm.css'

const SellForm = ({ addToHistory, compareWithPurchaseOrderTransactions, purchaseQuantity, purchasePrice, setSellPrice, setSellQuantity, matchedTransactions, selectedPurchaseOrder }) => {


  const { leftCurrency, rightCurrency } = useContext(CurrencyContext);
  const [quantity, setQuantity] = useState('');
  const [total, setTotal] = useState('');
  const [currencyValue, setCurrencyValue] = useState(0);
  const [sellOrder, setSellOrder] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);

  const exchangeRates = {
    usd: { rub: 91.03, amd: 402, gel: 2.36 },
    rub: { usd: 0.011, amd: 4.41, gel: 0.026 },
    amd: { usd: 0.0022, rub: 0.19, gel: 0.0063 },
    gel: { usd: 0.35, rub: 34.01, amd: 152.27 },
  };

  useEffect(() => {
    if (selectedPurchaseOrder) {
      setSellPrice(selectedPurchaseOrder.price);
      setSellQuantity(selectedPurchaseOrder.quantity);
      setTotal(selectedPurchaseOrder.total);
    }
  }, [selectedPurchaseOrder]);

  const calculateCurrencyValue = () => {
    const exchangeRate = exchangeRates[leftCurrency][rightCurrency];
    const variation = Math.random();
    const calculatedValue = exchangeRate + variation;
    let fixedValue = Math.abs(calculatedValue).toFixed(4); // Fix to 4 decimal places initially
    if (leftCurrency === 'usd' && rightCurrency === 'rub') {
      // If it's USD-RUB pair, fix to 2 decimal places
      fixedValue = parseFloat(fixedValue).toFixed(2);
    }
    setCurrencyValue(fixedValue); // Set the calculated and fixed currency value
  };

  useEffect(() => {
    calculateCurrencyValue();
  }, [leftCurrency, rightCurrency]);

  const handleQuantityChange = (e) => {
    const inputValue = e.target.value;
    if (inputValue >= 0) {
      setQuantity(inputValue);
      calculateTotal(currencyValue, inputValue);
    }
  };

  const calculateTotal = (currencyValue, quantity) => {
    const parsedPrice = parseFloat(currencyValue);
    const parsedQuantity = parseFloat(quantity);
    if (!isNaN(parsedPrice) && !isNaN(parsedQuantity) && parsedQuantity !== 0) {
      const totalPrice = parsedQuantity / parsedPrice;
      setTotal(totalPrice.toFixed(2));
    } else {
      setTotal('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rubValue = parseFloat(quantity);
    const usdValue = parseFloat(total);
    const sellDetails = {
      date: new Date().toISOString(),
      type: 'Sell',
      price: currencyValue,
      quantity: quantity,
      total: total,
      rub: rubValue,
      usd: usdValue,
      matched: false,
    };

    compareWithPurchaseOrderTransactions(purchaseQuantity, purchasePrice, quantity, currencyValue, total);

    setSellOrder([...sellOrder, sellDetails]);
    addToHistory(sellDetails);
    setSellQuantity(quantity);
    setSellPrice(currencyValue);
    setQuantity('');
    setTotal('');
    console.log('Form submitted:', sellDetails);
  };

  return (
    <div className="sell-form-container">
      <form onSubmit={handleSubmit}>
        <p>Продажа {leftCurrency.toUpperCase()}</p>
        <div>
          <label htmlFor="price">Цена ({leftCurrency.toUpperCase()}):</label>
          <input
            type="text"
            id="price"
            value={`${currencyValue}`}
            readOnly
          />
        </div>
        <div>
          <label htmlFor="quantity">Количество ({rightCurrency.toUpperCase()}):</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            required
          />
        </div>
        <div>
          <label htmlFor="total">Итого {leftCurrency.toUpperCase()}:</label>
          <input
            type="text"
            id="total"
            value={total}
            readOnly
          />
        </div>
        <button type="submit">Продажа</button>
      </form>
      {sellOrder.length > 0 && (
        <div className='unfuilfiled-sell-transactions'>
          <h4>Заявка на продажу </h4>
          <table>
            <tr>
              <th>Цена</th>
              <th>{rightCurrency.toUpperCase()}</th>
              <th>{leftCurrency.toUpperCase()}</th>
            </tr>
            <tbody>
              {sellOrder.map((sell, index) => {
                const isMatched = matchedTransactions.some(transaction =>
                  transaction.price === sell.price &&
                  transaction.quantity === sell.quantity &&
                  transaction.total === sell.total
                );

                if (!isMatched) {
                  return (
                    <tr key={index}>
                      <td>{sell.price}</td>
                      <td>{sell.quantity}</td>
                      <td>{sell.total}</td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellForm;
