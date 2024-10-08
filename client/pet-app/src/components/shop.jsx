// Shop.js
import '../styles/shop.scss';

const Shop = ({ money, toys, toiletries, foods, onBuy, onAddMoney }) => {
  return (
    <div className='shop'>
      <div className='shopkeeper-container'>
        <h2 className='shopkeeper-text'>
          Welcome to my little shop...
          <div>I hope you can find what you need.</div>
        </h2>
        <img
          src="https://res.cloudinary.com/deszclhtq/image/upload/v1728147784/Shopkeeper_Neutral_grmlj6.png"
          alt="shopkeeper"
          className='shopkeeper'
        />
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
                />
                <button onClick={() => onBuy(toy.id, 'toys', toy.price)}>Buy</button>
              </div>
            ))}
          </div>
          <div className='items-row'>
            {toys.slice(3).map((toy) => (
              <div key={toy.id} className='toys tooltip'>
                <h2>{toy.name}</h2>
                <div className="tooltiptext">
                Price: ${toy.price}{toy.description}<br />
                {toy.description}
                </div>
                <img
                  src={toy.toy_image}
                  alt={toy.name}
                  width="150"
                  height="150"
                />
                <button onClick={() => onBuy(toy.id, 'toys', toy.price)}>Buy</button>
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
                />
                <button onClick={() => onBuy(toiletry.id, 'toiletries', toiletry.price)}>Buy</button>
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
                />
                <button onClick={() => onBuy(toiletry.id, 'toiletries', toiletry.price)}>Buy</button>
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
                />
                <button onClick={() => onBuy(food.id, 'foods', food.price)}>Buy</button>
              </div>
            ))}
          </div>
          <div className='items-row'>
            {foods.slice(3).map((food) => (
              <div key={food.id} className='foods tooltip'>
                <h2>{food.name}</h2>
                <div className="tooltiptext">
                Price: ${food.price}
                <br />
                {food.description}
                </div>
                <img
                  src={food.food_image}
                  alt={food.name}
                  width="150"
                  height="150"
                />
                <button onClick={() => onBuy(food.id, 'foods', food.price)}>Buy</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
