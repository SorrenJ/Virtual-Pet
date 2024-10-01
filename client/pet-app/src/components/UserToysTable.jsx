import React from 'react';

function UserToysTable({ userToys, playWithPet }) {
    return (
        <div className="user-data" id="userToysTable">
            <h2>User Toys Data</h2>
            <table>
                <thead>
                    <tr>
                        <th>Toy Name</th>
                        <th>Count</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {userToys.map(item => (
                        <tr key={item.item_type_id}>
                            <td>
                                <p>Image URL: {item.toyImage}</p>
                                <img src={item.toyImage} alt={item.toys_name} width="100" />
                            </td>
                            <td>{item.toys_name}</td>
                            <td>{item.count}</td>
                            <td>
                                <button onClick={() => playWithPet(item.pet_id, item.item_type_id)} disabled={item.count <= 0}>
                                    Play
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserToysTable;
