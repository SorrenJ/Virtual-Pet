import React from 'react';

const UserToysTable = ({ userToys, playWithPet, selectedPet }) => {
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
          {userToys.map((item) => (
            <tr key={item.item_type_id}>
              <td>
                <img src={item.toy_image} alt={item.toys_name} width="100" />
              </td>
              <td>{item.toys_name}</td>
              <td>{item.count}</td>
              <td>
                <button
                  onClick={() => playWithPet(selectedPet.pet_id, item.item_type_id)}
                  disabled={item.count <= 0}
                >
                  Play
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserToysTable;
