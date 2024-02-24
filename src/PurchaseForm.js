import React, { useContext, useState, useEffect } from 'react';
import CurrencyContext from './CurrencyContext';
import '../src/Styles/PurchaseForm.css'
const PurchaseForm = ({ handleTableRowClick, addToHistory, setPurchaseQuantity, setPurchasePrice, compareWithSellOrderTransactions, sellQuantity, sellPrice, compareLimitOrderWithPurchaseOrders, limitOrder, matchedTransactions }) => {
  const { leftCurrency, rightCurrency } = useContext(CurrencyContext);
  const [quantity, setQuantity] = useState('');
  const [total, setTotal] = useState('');
  const [currencyValue, setCurrencyValue] = useState('');
  const [purchaseOrder, setPurchaseOrder] = useState([]);

  // Exchange rate data
  const exchangeRates = {
    usd: { rub: 91, amd: 405, gel: 2.66 },
    rub: { usd: 0.01, amd: 4.44, gel: 0.029 },
    amd: { usd: 0.0025, rub: 0.22, gel: 0.0066 },
    gel: { usd: 0.38, rub: 34.04, amd: 152.30 },
  };

  // Function to calculate currency value
  const calculateCurrencyValue = () => {
    const exchangeRate = exchangeRates[leftCurrency][rightCurrency];
    const calculatedValue = exchangeRate * (1 + Math.random() / 100); // Adding slight variation
    let fixedValue = calculatedValue.toFixed(4); // Fix to 4 decimal places initially
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
    setQuantity(e.target.value);
    calculateTotal(e.target.value, currencyValue); // Pass currencyValue as the second argument
  };


  // Function to calculate total
  const calculateTotal = (quantity, currencyValue) => {
    const parsedQuantity = parseFloat(quantity);
    const parsedCurrencyValue = parseFloat(currencyValue);
    if (!isNaN(parsedQuantity) && !isNaN(parsedCurrencyValue) && parsedCurrencyValue !== 0) {
      const totalPrice = parsedQuantity / parsedCurrencyValue;
      setTotal(totalPrice.toFixed(2)); // Assuming 2 decimal places for total
    } else {
      setTotal(''); // Reset total if quantity or currencyValue is not a valid number or currencyValue is zero
    }
  };


  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const rubValue = parseFloat(quantity); // Assuming quantity is in RUB
    const usdValue = parseFloat(total); // Assuming total is in USD

    // Check for matches with sell orders
    const hasMatch = compareWithSellOrderTransactions(sellQuantity, sellPrice, quantity, currencyValue, total);

    const purchaseDetails = {
      date: new Date().toISOString(),
      type: 'Purchase',
      price: currencyValue,
      quantity: quantity,
      total: total,
      rub: rubValue,
      usd: usdValue,
      matched: hasMatch,
    };

    setPurchaseOrder([...purchaseOrder, purchaseDetails]);
    addToHistory(purchaseDetails);
    setPurchaseQuantity(quantity);
    setPurchasePrice(currencyValue);
    setQuantity('');
    setTotal('');
    console.log('Form submitted:', purchaseDetails);
  };


  // Function to handle purchase from LimitOrderSection
  const handleSellFromLimitOrder = (price, quantity, total) => {
    const rubValue = parseFloat(quantity);
    const usdValue = parseFloat(total);
    const purchaseDetails = {
      date: new Date().toISOString(),
      type: 'Purchase',
      price: price,
      quantity: quantity,
      total: total,
      rub: rubValue,
      usd: usdValue,
    };

    setPurchaseOrder([...purchaseOrder, purchaseDetails]);
  };



  

  return (
    <div className="purchase-form-container">
      <form onSubmit={handleSubmit}>
        <p>Покупка {leftCurrency.toUpperCase()}</p>
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
        <button type="submit">Покупка</button>
      </form>
      {purchaseOrder.length > 0 && (
        <div className='unfuilfiled-purchase-transactions'>
          <h4>Заявка на покупку</h4>
          <table>
            <thead>
              <tr>
                <th>Цена</th>
                <th>{rightCurrency.toUpperCase()}</th>
                <th>{leftCurrency.toUpperCase()}</th>
              </tr>
            </thead>
            <tbody>
              {purchaseOrder.map((purchase, index) => {
                const isMatched = matchedTransactions.some(transaction =>
                  transaction.price === purchase.price &&
                  transaction.quantity === purchase.quantity &&
                  transaction.total === purchase.total
                );
                if (!isMatched) {
                  return (
                   <tr key={index}>
                      <td>{purchase.price}</td>
                      <td>{purchase.quantity}</td>
                      <td>{purchase.total}</td>
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

export default PurchaseForm;