import React from 'react';

const UserToiletriesTable = ({ userToiletries, cleanPet, selectedPet, handleDrop }) => {
    const onDragStart = (e, item) => {
        e.dataTransfer.setData('item', JSON.stringify({ id: item.id, type: 'toiletry', effect: { cleanliness: 10 } }));
    };

    return (
        <div className="user-data" id="userToiletriesTable">
            <h3>Toiletries</h3>
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
                    {userToiletries.map((item) => (
                        <tr key={item.item_type_id || item.id}>
                            <td>
                                <img
                                    src={item.toiletryImage}
                                    alt={item.toiletries_name}
                                    width="100"
                                    draggable="true"
                                    onDragStart={(e) => onDragStart(e, item)}
                                />
                            </td>
                            <td>{item.count}</td>
                            <td>{item.toiletries_name}</td>
                            <td>
                                <button
                                    onClick={() => cleanPet(selectedPet?.pet_id, item.id)}
                                    disabled={item.count <= 0}
                                >
                                    Clean
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserToiletriesTable;
