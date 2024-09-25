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
        setData(fetchedData); // Set the fetched data to state
      })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <Shop 
      money={data.money}
      toys={data.toys}
      toiletries={data.toiletries}
      foods={data.foods}
    />
  );
};

export default ShopPage;
