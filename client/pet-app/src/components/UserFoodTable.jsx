import React from 'react';

const UserFoodTable = ({ userFood, feedPet, selectedPet }) => {
    
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
                        {userFood.map((item) => (
                            <tr key={item.item_type_id || item.id}>
                                <td><img src={item.foodImage} alt={item.food_name} width="100" /></td>
                                <td>{item.food_name}</td>
                                <td>{item.count}</td>
                                <td>
                                    <button
                                        onClick={() => feedPet(selectedPet?.pet_id, item.id)}
                                        disabled={item.count <= 0}
                                    >
                                        Feed
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};




export default UserFoodTable;
