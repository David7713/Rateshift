import React, { useState } from 'react';
import './App.css';

import CurrencyDropdown from './CurrencyDropdown'
import PurchaseForm from './PurchaseForm'
import SellForm from './SellForm'
import CurrencyChart from './CurrencyChart'
import { CurrencyProvider } from './CurrencyContext';
import LimitOrderSection from './LimitOrderSection'


const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [purchasePrice, setPurchasePrice] = useState(0); 
  const [purchaseQuantity, setPurchaseQuantity] = useState(0); 
  const [sellPrice, setSellPrice] = useState(0); 
  const [sellQuantity, setSellQuantity] = useState(0);
  const [limitOrder, setLimitOrder] = useState(null); 
  const [matchedTransactions, setMatchedTransactions] = useState([]); 
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState(null);








  const handlePurchaseOrderSelection = (purchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
  };

  
  const addToHistory = (transaction) => {
  const formattedDateWithMilliseconds = new Date().toISOString(); // Get the current date and time in ISO format
const formattedDate = formattedDateWithMilliseconds.slice(0, -5); // Remove the last five characters (milliseconds and Z)
    const newTransaction = { ...transaction, date: formattedDate, matched: false }; 
    setTransactions([...transactions, newTransaction]);
  };





const compareWithPurchaseOrderTransactions = (purchaseQuantity, purchasePrice, sellQuantity, sellPrice, sellTotal) => {
  const sellQuantityNumber = parseFloat(sellQuantity);
  const sellPriceNumber = parseFloat(sellPrice);

  const pastPurchaseOrders = transactions.filter(order => order.type === 'Purchase');

  const hasPartialMatchHigherQuantity = pastPurchaseOrders.some(order => {
    const orderQuantity = parseFloat(order.quantity);
    const orderPrice = parseFloat(order.price);
    return orderQuantity > sellQuantityNumber && orderPrice === sellPriceNumber;
  });

  if (hasPartialMatchHigherQuantity) {
    const oppositeTransaction = pastPurchaseOrders.find(order => {
      const orderQuantity = parseFloat(order.quantity);
      const orderPrice = parseFloat(order.price);
      return orderQuantity > sellQuantityNumber && orderPrice === sellPriceNumber;
    });

    setMatchedTransactions(prevMatchedTransactions => [
      ...prevMatchedTransactions,
      { 
        ...oppositeTransaction,
        type: "Sell",
        quantity: sellQuantityNumber,
        total:(sellQuantityNumber / sellPriceNumber).toFixed(2) 
      }
    ]);
    alert("Поздравляем! Произошло частичное совпадение. Количество покупки больше, чем количество продажи, и цены совпадают");
  } 
  
  const hasPartialMatchLowerQuantity = pastPurchaseOrders.some(order => {
    const orderQuantity = parseFloat(order.quantity);
    const orderPrice = parseFloat(order.price);
    return orderQuantity < sellQuantityNumber && orderPrice === sellPriceNumber;
  });

  if (hasPartialMatchLowerQuantity) {
    const oppositeTransaction = pastPurchaseOrders.find(order => {
      const orderQuantity = parseFloat(order.quantity);
      const orderPrice = parseFloat(order.price);
      return orderQuantity < sellQuantityNumber && orderPrice === sellPriceNumber;
    });

    setMatchedTransactions(prevMatchedTransactions => [
      ...prevMatchedTransactions,
      { 
        ...oppositeTransaction,
        type: "Sell",
        quantity: oppositeTransaction.quantity,
        total:(oppositeTransaction.quantity / oppositeTransaction.price).toFixed(2) // Calculated based on purchaseQuantityNumber and purchasePriceNumber
      }
    ]);
    alert("Поздравляем! Произошло частичное совпадение. Количество покупки меньше, чем количество продажи, и цены совпадают.");
  } 
  
  else {
    const fullyMatchingPurchaseOrder = pastPurchaseOrders.find(order => {
      const orderQuantity = parseFloat(order.quantity);
      const orderPrice = parseFloat(order.price);
      return orderQuantity === sellQuantityNumber && Math.abs(orderPrice - sellPriceNumber) < 0.001;
    });

    if (fullyMatchingPurchaseOrder) {
      setMatchedTransactions(prevMatchedTransactions => [...prevMatchedTransactions, fullyMatchingPurchaseOrder]);
      alert("Поздравляем! Заказ полностью соответствует заказу на покупку по цене и количеству");
    } else {
      alert("Извините, не найден соответствующий заказ на покупку");
      return;
    }
  }
};






const compareWithSellOrderTransactions = (sellQuantity, sellPrice, purchaseQuantity, purchasePrice, sellTotal) => {
  const purchaseQuantityNumber = parseFloat(purchaseQuantity);
  const purchasePriceNumber = parseFloat(purchasePrice);

  const pastSellOrders = transactions.filter(order => order.type === 'Sell');

  const hasPartialMatch = pastSellOrders.some(sellOrder => {
    const orderQuantity = parseFloat(sellOrder.quantity);
    const orderPrice = parseFloat(sellOrder.price);
    return orderQuantity > purchaseQuantityNumber && orderPrice === purchasePriceNumber;
  });

  if (hasPartialMatch) {
    const oppositeTransaction = pastSellOrders.find(sellOrder => {
      const orderQuantity = parseFloat(sellOrder.quantity);
      const orderPrice = parseFloat(sellOrder.price);
      return orderQuantity > purchaseQuantityNumber && orderPrice === purchasePriceNumber;
    });

    setMatchedTransactions(prevMatchedTransactions => [
      ...prevMatchedTransactions,
      { 
        ...oppositeTransaction,
        type: "Purchase",
        quantity: purchaseQuantityNumber,
        total:( purchaseQuantityNumber / purchasePriceNumber).toFixed(2) 
      }
    ]);
    alert("Поздравляем! Произошло частичное совпадение. Количество продажи больше, чем количество в заказе на покупку, и цены совпадают.");
    
  }  
  
  const hasPartialMatchLowerQuantity = pastSellOrders.some(sellOrder => {
    const orderQuantity = parseFloat(sellOrder.quantity);
    const orderPrice = parseFloat(sellOrder.price);
    return orderQuantity < purchaseQuantityNumber && orderPrice === purchasePriceNumber;
  });

  if (hasPartialMatchLowerQuantity) {
    const oppositeTransaction = pastSellOrders.find(sellOrder => {
      const orderQuantity = parseFloat(sellOrder.quantity);
      const orderPrice = parseFloat(sellOrder.price);
      return orderQuantity < purchaseQuantityNumber && orderPrice === purchasePriceNumber;
    });

    setMatchedTransactions(prevMatchedTransactions => [
      ...prevMatchedTransactions,
      { 
        ...oppositeTransaction,
        type: "Purchase",
        quantity: oppositeTransaction.quantity,
        total:( oppositeTransaction.quantity / oppositeTransaction.price).toFixed(2) // Calculated based on oppositeTransaction quantity and price
      }
    ]);
    alert("Поздравляю! Произошло частичное совпадение. Количество продажи больше, чем количество в заказе на покупку, и цены совпадают");
    
  }  
  

  
  else {
    const fullyMatchingSellOrder = pastSellOrders.find(order => {
      const orderQuantity = parseFloat(order.quantity);
      const orderPrice = parseFloat(order.price);
      return orderQuantity === purchaseQuantityNumber && Math.abs(orderPrice - purchasePriceNumber) < 0.001;
    });

    if (fullyMatchingSellOrder) {
      setMatchedTransactions(prevMatchedTransactions => [...prevMatchedTransactions, fullyMatchingSellOrder]);
      alert("Поздравляем! Заказ полностью соответствует ордеру на продажу по цене и количеству");
      
    } else {
      alert("Извините, не найден соответствующий ордер на продажу");
      return;
    }
  }
};










  const compareLimitOrderWithSellOrders = (limitOrder) => {
    let remainingQuantity = limitOrder.quantity;
  
    // Check if there's a fully matching purchase order based on price and quantity
    const fullyMatchingPurchaseOrder = transactions.find(purchase => (
      purchase.type === 'Purchase' &&
      purchase.price === limitOrder.price &&
      purchase.quantity === limitOrder.quantity
    ));
  
    if (fullyMatchingPurchaseOrder) {
      // Execute the order fully
      alert("Поздравляем! Лимитный ордер полностью соответствует ордеру на покупку по цене и количеству");
      return;
    }
  
    // Check for partially matching purchase orders based on limit price and quantity
    const matchingPurchaseOrderWithLimit = transactions.find(purchase => (
      purchase.type === 'Purchase' &&
      purchase.price === limitOrder.limit &&
      purchase.quantity >= remainingQuantity
    ));
  
    if (matchingPurchaseOrderWithLimit) {
      // Execute the order partially
      remainingQuantity = 0;
      alert("Поздравляю! Лимитный ордер частично соответствует ордеру на покупку по лимитной цене и количеству");
      return;
    }
  
    // Check for partially matching purchase orders based on price and quantity
    const matchingPurchaseOrderWithPrice = transactions.find(purchase => (
      purchase.type === 'Purchase' &&
      purchase.price === limitOrder.price &&
      purchase.quantity >= remainingQuantity
    ));
  
    if (matchingPurchaseOrderWithPrice) {
      // Execute the order partially
      alert("Поздравляем! Лимитный ордер частично соответствует ордеру на покупку по цене и количеству.");
      return;
    }
  
    // Check if required quantity exceeds order quantity
    if (remainingQuantity > 0) {
      alert("Ошибка: Требуемое количество превышает количество в заказе");
      return;
    }
  
    // No matching purchase order found
    alert("Извините, не найден соответствующий ордер на покупку");
  };








  const compareLimitOrderWithPurchaseOrders = (limitOrder) => {
    let remainingQuantity = limitOrder.quantity;
  
    // Check if there's a fully matching sell order based on price and quantity
    const fullyMatchingSellOrder = transactions.find(sell => (
      sell.type === 'Sell' &&
      sell.price === limitOrder.price &&
      sell.quantity === limitOrder.quantity
    ));
  
    if (fullyMatchingSellOrder) {
      // Execute the order fully
      alert("Поздравляем! Лимитный ордер полностью соответствует ордеру на продажу по цене и количеству");
      return;
    }
  
    // Check for partially matching sell orders based on limit price and quantity
    const matchingSellOrderWithLimit = transactions.find(sell => (
      sell.type === 'Sell' &&
      sell.price === limitOrder.limit &&
      sell.quantity >= remainingQuantity
    ));
  
    if (matchingSellOrderWithLimit) {
      // Execute the order partially
      remainingQuantity = 0;
      alert("Поздравляем! Лимитный ордер частично соответствует ордеру на продажу по лимитной цене и количеству");
      return;
    }
  
    // Check for partially matching sell orders based on price and quantity
    const matchingSellOrderWithPrice = transactions.find(sell => (
      sell.type === 'Sell' &&
      sell.price === limitOrder.price &&
      sell.quantity >= remainingQuantity
    ));
  
    if (matchingSellOrderWithPrice) {
      // Execute the order partially
      alert("Поздравляем! Лимитный ордер частично соответствует ордеру на продажу по цене и количеству");
      return;
    }
  
    // Check if required quantity exceeds order quantity
    if (remainingQuantity > 0) {
      alert("Требуемое количество превышает количество в заказе");
      return;
    }
  
    // No matching sell order found
    alert("Извините, не найден соответствующий ордер на продажу");
  };


  

  

  return (
    <CurrencyProvider>
      <div>
        <CurrencyDropdown />
        <CurrencyChart matchedTransactions={matchedTransactions}></CurrencyChart>
       <div className='form-sections'>
        <PurchaseForm addToHistory={addToHistory} setPurchaseQuantity={setPurchaseQuantity} setPurchasePrice={setPurchasePrice}  compareWithSellOrderTransactions={compareWithSellOrderTransactions}
        sellQuantity={sellQuantity}
        sellPrice={sellPrice}
        matchedTransactions={matchedTransactions}
        onPurchaseOrderSelect={handlePurchaseOrderSelection} 

        />
          <LimitOrderSection
           compareLimitOrderWithPurchaseOrders={compareLimitOrderWithPurchaseOrders}
            compareLimitOrderWithSellOrders={compareLimitOrderWithSellOrders} 


          
          />
         <SellForm addToHistory={addToHistory}
          compareWithPurchaseOrderTransactions={compareWithPurchaseOrderTransactions} 
          purchaseQuantity={purchaseQuantity} purchasePrice={purchasePrice}
         setSellPrice={setSellPrice}
         setSellQuantity={setSellQuantity}
         matchedTransactions={matchedTransactions}
         selectedPurchaseOrder={selectedPurchaseOrder}
         
         />
    </div>

{/* Display matched transactions in a table */}
<div className='matched-transactions-container'>
  <h2>Торговая история</h2>
  {matchedTransactions.length > 0 ? (
    <table>
      <thead>
        <tr>
          <th>Дата</th>
          <th>Тип</th>
          <th>Цена</th>
          <th>Кол-во</th>
          <th>Итого</th>
        </tr>
      </thead>
      <tbody>
        {matchedTransactions.map((transaction, index) => (
          <tr key={index}>
            <td>{transaction.date}</td>
            <td>{transaction.type}</td>
            <td>{transaction.price}</td>
            <td>{transaction.quantity}</td>
            <td>{transaction.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>Пока нет никакой торговой истории</p>
  )}
</div>
      </div>
    </CurrencyProvider>
  );
};

export default App;