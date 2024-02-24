import React, { useState, useContext } from 'react';
import CurrencyContext from './CurrencyContext'; // Import the CurrencyContext
import '../src/Styles/LimitOrderSection.css'



const LimitOrderSection = ({ compareLimitOrderWithPurchaseOrders, compareLimitOrderWithSellOrders }) => {

  const { leftCurrency, rightCurrency } = useContext(CurrencyContext); // Obtain currency context
  const [price, setPrice] = useState('');
  const [limit, setLimit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [total, setTotal] = useState('');



  const handlePriceChange = (e) => {
    setPrice(e.target.value);
    calculateTotal(e.target.value, quantity);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
    calculateTotal(price, e.target.value);
  };


  const calculateTotal = (price, quantity) => {
    const parsedPrice = parseFloat(price);
    const parsedQuantity = parseFloat(quantity);
    if (!isNaN(parsedPrice) && !isNaN(parsedQuantity) && parsedQuantity !== 0) {
      const totalPrice = parsedQuantity / parsedPrice; // Corrected calculation
      setTotal(totalPrice.toFixed(2)); // Assuming 2 decimal places for total
    } else {
      setTotal(''); // Reset total if quantity or price is not a valid number or quantity is zero
    }
  };
  const handlePurchase = (e) => {
    e.preventDefault();
    const limitOrder = { price, limit, quantity, total };
    const message = compareLimitOrderWithSellOrders(limitOrder); // Compare with sell orders

    console.log('Purchase order submitted:', limitOrder);
  };

  const handleSell = (e) => {
    e.preventDefault();
    const limitOrder = { price, limit, quantity, total };
    const message = compareLimitOrderWithPurchaseOrders(limitOrder); // Compare with purchase orders

    console.log('Sell order submitted:', limitOrder);
  };
  return (
    <div className="limit-order-container">
      <h2>Лимитная Заявка</h2>
      <form>
        <div>
          <label htmlFor="price">Цена ({leftCurrency.toUpperCase()}):</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={handlePriceChange}
            placeholder="Enter price"
            required
          />
        </div>
        <div>
          <label htmlFor="limit">Лимит ({leftCurrency.toUpperCase()}):</label>
          <input
            type="text"
            id="limit"
            value={limit}
            onChange={handleLimitChange}

            required
          />
        </div>
        <div>
          <label htmlFor="quantity">Количество ({rightCurrency.toUpperCase()}):</label> {/* Display the right currency */}
          <input
            type="text"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}

            required
          />
        </div>
        <div>
          <label htmlFor="total">Итого ({leftCurrency.toUpperCase()}):</label>
          <input
            type="text"
            id="total"
            value={total}
            readOnly
          />
        </div>
        <button type="submit" onClick={handleSell}>Покупка</button>
        <button type="submit" onClick={handlePurchase}>Продажа</button>
      </form>
    </div>
  );
};

export default LimitOrderSection