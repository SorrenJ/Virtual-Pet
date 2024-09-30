const Shop = ({ money, toys, toiletries, foods, onBuy, onAddMoney }) => {
  return (
    <div>
      <h2>Your Balance: ${money}</h2>
      <button onClick={onAddMoney}>Add $100</button>

      <h1>Toys</h1>
      <ul>
        {toys.map((toy) => (
          <li key={toy.id}>
            <h2>{toy.name}</h2>
            <p>Price: ${toy.price}</p>
            <p>Description: {toy.description}</p>
            <p><img src={toy.toy_image} alt={toy.name} width="150" height="150" /></p>
            <button onClick={() => onBuy(toy.id, 'toys', toy.price)}>Buy</button>
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
            <p><img src={toiletry.toiletry_image} alt={toiletry.name} width="150" height="150" /></p>
            <button onClick={() => onBuy(toiletry.id, 'toiletries', toiletry.price)}>Buy</button>
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
            <p><img src={food.food_image} alt={food.name} width="150" height="150" /></p>
            <button onClick={() => onBuy(food.id, 'foods', food.price)}>Buy</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shop;
