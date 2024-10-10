import React, { useState } from 'react';
import '../styles/shop.scss';

const Shop = ({ money, toys, toiletries, foods, onBuy, onAddMoney }) => {
  // State to track shopkeeper's mood
  const [shopkeeperMood, setShopkeeperMood] = useState({
    image: "https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Neutral_grmlj6.png",
    text: "Welcome to my little shop... I hope you can find what you need."
  });

  const handleBuy = (itemId, category, price) => {
    // Check if the user has enough money
    if (money < price) {
      // Change the shopkeeper's mood to angry
      setShopkeeperMood({
        image: "https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Murderous_bk3frq.png",
        text: "Are you trying to scam me?"
      });

      // Set a timer to revert the mood back to neutral after 8 seconds
      setTimeout(() => {
        setShopkeeperMood({
          image: "https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Neutral_grmlj6.png",
          text: "Welcome to my little shop... I hope you can find what you need."
        });
      }, 8000); // 8000 milliseconds = 8 seconds
      return; // Exit the function if not enough money
    }

    // Call the onBuy function if there is enough money
    onBuy(itemId, category, price);

    // Change the shopkeeper's mood after a purchase
    setShopkeeperMood({
      image: "https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Happy_u6qjwq.png",
      text: "Thank you for your business!" // You can change this text if desired
    });

    // Set a timer to revert the mood back to neutral after 8 seconds
    setTimeout(() => {
      setShopkeeperMood({
        image: "https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Neutral_grmlj6.png",
        text: "Welcome to my little shop... I hope you can find what you need."
      });
    }, 8000); // 8000 milliseconds = 8 seconds
  };

  // Handle the drag start event
  const handleDragStart = (event, itemId, category, price) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ itemId, category, price }));
  };

  // Handle the drop event
  const handleDrop = (event) => {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const { itemId, category, price } = JSON.parse(data);
    
    // Call the handleBuy function
    handleBuy(itemId, category, price);
  };

  // Prevent default behavior for drag over
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className='shop'>
      <div className='shopkeeper-container' onDrop={handleDrop} onDragOver={handleDragOver}>
      <div className='shopkeeper-wrapper'>
        <h2 className='shopkeeper-text'>
          {shopkeeperMood.text}
        </h2>
        <img
          src={shopkeeperMood.image}
          alt="shopkeeper"
          className='shopkeeper'
        />
        <div className="moving-clouds"> </div>
        <div className="moving-clouds"> </div>
      
        <div className="moving-clouds"> </div>
      </div>  
      </div>
      <div className='items-container'>
        <h2 className='money'>Your Balance: ${money}</h2>

        {/* Toys Section */}
        <div className='toys-container category-container'>
          <h1 className='text-3xl font-bold'>Toys</h1>
          <div className='items-row'>
            {toys.slice(0, 3).map((toy) => (
              <div key={toy.id} className='toys tooltip'>
                <h2>{toy.name}</h2>
                <div className="tooltiptext">
                  Price: ${toy.price}<br />
                  {toy.description}
                </div>
                <img
                  src={toy.toy_image}
                  alt={toy.name}
                  width="150"
                  height="150"
                  draggable
                  onDragStart={(e) => handleDragStart(e, toy.id, 'toys', toy.price)}
                />
                <button onClick={() => handleBuy(toy.id, 'toys', toy.price)}>Buy</button>
              </div>
            ))}
          </div>
          <div className='items-row'>
            {toys.slice(3).map((toy) => (
              <div key={toy.id} className='toys tooltip'>
                <h2>{toy.name}</h2>
                <div className="tooltiptext">
                  Price: ${toy.price}<br />
                  {toy.description}
                </div>
                <img
                  src={toy.toy_image}
                  alt={toy.name}
                  width="150"
                  height="150"
                  draggable
                  onDragStart={(e) => handleDragStart(e, toy.id, 'toys', toy.price)}
                />
                <button onClick={() => handleBuy(toy.id, 'toys', toy.price)}>Buy</button>
              </div>
            ))}
          </div>
        </div>

        {/* Toiletries Section */}
        <div className='toiletries-container category-container'>
          <h1 className='text-3xl font-bold'>Toiletries</h1>
          <div className='items-row'>
            {toiletries.slice(0, 3).map((toiletry) => (
              <div key={toiletry.id} className='toiletries tooltip'>
                <h2>{toiletry.name}</h2>
                <div className="tooltiptext">
                  Price: ${toiletry.price}<br />
                  {toiletry.description}
                </div>
                <img
                  src={toiletry.toiletry_image}
                  alt={toiletry.name}
                  width="150"
                  height="150"
                  draggable
                  onDragStart={(e) => handleDragStart(e, toiletry.id, 'toiletries', toiletry.price)}
                />
                <button onClick={() => handleBuy(toiletry.id, 'toiletries', toiletry.price)}>Buy</button>
              </div>
            ))}
          </div>
          <div className='items-row'>
            {toiletries.slice(3).map((toiletry) => (
              <div key={toiletry.id} className='toiletries tooltip'>
                <h2>{toiletry.name}</h2>
                <div className="tooltiptext">
                  Price: ${toiletry.price}<br />
                  {toiletry.description}
                </div>
                <img
                  src={toiletry.toiletry_image}
                  alt={toiletry.name}
                  width="150"
                  height="150"
                  draggable
                  onDragStart={(e) => handleDragStart(e, toiletry.id, 'toiletries', toiletry.price)}
                />
                <button onClick={() => handleBuy(toiletry.id, 'toiletries', toiletry.price)}>Buy</button>
              </div>
            ))}
          </div>
        </div>

        {/* Foods Section */}
        <div className='foods-container category-container'>
          <h1 className='text-3xl font-bold'>Foods</h1>
          <div className='items-row'>
            {foods.slice(0, 3).map((food) => (
              <div key={food.id} className='foods tooltip'>
                <h2>{food.name}</h2>
                <div className="tooltiptext">
                  Price: ${food.price}<br />
                  {food.description}
                </div>
                <img
                  src={food.food_image}
                  alt={food.name}
                  width="150"
                  height="150"
                  draggable
                  onDragStart={(e) => handleDragStart(e, food.id, 'foods', food.price)}
                />
                <button onClick={() => handleBuy(food.id, 'foods', food.price)}>Buy</button>
              </div>
            ))}
          </div>
          <div className='items-row'>
            {foods.slice(3).map((food) => (
              <div key={food.id} className='foods tooltip'>
                <h2>{food.name}</h2>
                <div className="tooltiptext">
                  Price: ${food.price}<br />
                  {food.description}
                </div>
                <img
                  src={food.food_image}
                  alt={food.name}
                  width="150"
                  height="150"
                  draggable
                  onDragStart={(e) => handleDragStart(e, food.id, 'foods', food.price)}
                />
                <button onClick={() => handleBuy(food.id, 'foods', food.price)}>Buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
