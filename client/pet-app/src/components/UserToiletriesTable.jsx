import React from 'react';

const UserToiletriesTable = ({ userToiletries, cleanPet, selectedPet }) => {

    
  return (
    <div className="user-data" id="userToiletriesTable">
<h2>Toiletries</h2>
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
                               <td>{item.count}</td>
                                <td><img src={item.toiletryImage} alt={item.toiletries_name} width="100" /></td>
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
