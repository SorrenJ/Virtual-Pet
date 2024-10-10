import React from 'react';

const UserFoodTable = ({ userFood, feedPet, selectedPet, handleDrop }) => {
    const onDragStart = (e, item) => {
        e.dataTransfer.setData('item', JSON.stringify({ id: item.id, type: 'food', effect: { hunger: 10 } }));
    };

    return (
        <div className="user-data" id="userFoodTable">
            <h3>Treats</h3>
            <table>
                <thead>
                    <tr>
                        <th>Count</th>
                        <th> </th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userFood.map((item) => (
                        <tr key={item.item_type_id || item.id}>
                            <td>
                                <img
                                    src={item.foodImage}
                                    alt={item.food_name}
                                    width="100"
                                    draggable="true"
                                    onDragStart={(e) => onDragStart(e, item)}
                                />
                            </td>
                            <td>{item.count}</td>
                            <td>{item.food_name}</td>
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
