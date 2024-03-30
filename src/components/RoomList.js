import React from 'react';

// eslint-disable-next-line react/prop-types
function RoomList({ rooms, onDelete, onEdit }) {
  return (
    <div>
      <h2 className="mt-8 mb-4 text-xl font-semibold">Your Rooms:</h2>
      {rooms.map(room => (
        <div key={room.id} className="bg-gray-100 p-4 rounded shadow mb-4">
          <h3 className="text-lg font-semibold mb-2">{room.roomName}</h3>
          <p>Room Type: {room.roomType}</p>
          <p>Smoking: {room.smoking ? 'Yes' : 'No'}</p>
          <p>Number of People: {room.numberOfPeople}</p>
          <p>Square Meters: {room.squareMeters}</p>
          <p>Bed Type: {room.bedType}</p>
          <div className="mt-2">
            <button onClick={() => onEdit(room.id)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2">Edit</button>
            <button onClick={() => onDelete(room.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RoomList;
