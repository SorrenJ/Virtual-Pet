import React from 'react';

function UserFoodTable({ userFood, feedPet }) {
    return (
        <div className="user-data" id="userFoodTable">
            <h2>User Food Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Food Image</th>
                        <th>Food Name</th>
                        <th>Count</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userFood.map(item => (
                        <tr key={item.item_type_id}>
                            <td>
                                <p>Image URL: {item.foodImage}</p>
                                <img src={item.foodImage} alt={item.food_name} width="100" />
                            </td>
                            <td>{item.food_name}</td>
                            <td>{item.count}</td>
                            <td>
                                <button onClick={() => feedPet(item.pet_id, item.item_type_id)} disabled={item.count <= 0}>
                                    Feed
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserFoodTable;
