import React, { useState, useEffect } from 'react';
import Shop from '../components/shop'; // Import the Shop component

const ShopPage = () => {
  const [data, setData] = useState({
    money: 0,
    toys: [],
    toiletries: [],
    foods: []
  });

  useEffect(() => {
    // Fetch data from your backend API
    fetch('http://localhost:5000/shop') 
      .then(response => response.json())
      .then(fetchedData => {
        // Ensure money is treated as a number
        fetchedData.money = Number(fetchedData.money);
        setData(fetchedData); // Set the fetched data to state
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  const handleBuy = async (itemId, itemType, itemPrice) => {
    const itemCount = 1; // Set to 1 for now; you can enhance this to allow quantity selection
    const userId = 1; // Replace with actual user ID from your context or state

    try {
      const response = await fetch('http://localhost:5000/buy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemId, itemType, itemCount }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Notify the user of a successful purchase
        // Update local state to reflect changes, ensuring money is treated as a number
        setData(prevData => ({
          ...prevData,
          money: prevData.money - Number(itemPrice) // Deduct money from local state
        }));
      } else {
        alert(result.error); // Notify the user of an error
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
    }
  };

  const handleAddMoney = async () => {
    const userId = 1; // Replace with actual user ID from your context or state

    try {
      const response = await fetch('http://localhost:5000/add-money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, amount: 100 }), // Add $100
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message); // Notify the user of a successful addition
        // Update local state to reflect changes, ensuring money is treated as a number
        setData(prevData => ({
          ...prevData,
          money: prevData.money + 100 // Add money to local state
        }));
      } else {
        alert(result.error); // Notify the user of an error
      }
    } catch (error) {
      console.error('Error adding money:', error);
    }
  };

  return (
<div>
    <div className="links">
    <h3>Explore More:</h3>
    <a href="/">Go home</a>
    <a href="/adopt">Adopt a Pet</a>
    <a href="/shop">Visit the Shop</a>  
  </div>


    <Shop 
      money={data.money}
      toys={data.toys}
      toiletries={data.toiletries}
      foods={data.foods}
      onBuy={handleBuy} // Pass the buy function to Shop component
      onAddMoney={handleAddMoney} // Pass the add money function to Shop component
    />

</div>
  );
};

export default ShopPage;
