import React from 'react';

const Shop = ({ money, toys, toiletries, foods }) => {
  return (
    <div>
      <h2>Your Balance: ${money}</h2>
      
      <h1>Toys</h1>
      <ul>
        {toys.map((toy) => (
          <li key={toy.id}>
            <h2>{toy.name}</h2>
            <p>Price: ${toy.price}</p>
            <p>Description: {toy.description}</p>
          </li>
        ))}
      </ul>

      <h1>Toiletries</h1>
      <ul>
        {toiletries.map((toiletry) => (
          <li key={toiletry.id}>
            <h2>{toiletry.name}</h2>
            <p>Price: ${toiletry.price}</p>
            <p>Description: {toiletry.description}</p>
          </li>
        ))}
      </ul>

      <h1>Foods</h1>
      <ul>
        {foods.map((food) => (
          <li key={food.id}>
            <h2>{food.name}</h2>
            <p>Price: ${food.price}</p>
            <p>Description: {food.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shop;
