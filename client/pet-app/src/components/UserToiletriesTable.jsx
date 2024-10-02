import React from 'react';

const UserToiletriesTable = ({ userToiletries, cleanPet, selectedPet }) => {

    
  return (
    <div className="user-data" id="userToiletriesTable">
      <h2>User Toiletries Data</h2>
      <table>
        <thead>
          <tr>
            <th>Toiletries Name</th>
            <th>Count</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userToiletries.map((item) => (
            <tr key={item.item_type_id}>
              <td>
                <img src={item.toiletry_image} alt={item.toiletries_name} width="100" />
              </td>
              <td>{item.toiletries_name}</td>
              <td>{item.count}</td>
              <td>
                <button
                  onClick={() => cleanPet(selectedPet.pet_id, item.item_type_id)}
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
