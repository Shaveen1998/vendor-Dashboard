import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { auth, db, storage } from "../Config/firebase";
import { addDoc, collection, doc, serverTimestamp, setDoc, getDoc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import RoomList from './RoomList';

function RoomForm() {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);
  const current = JSON.parse(localStorage.getItem("vendor")) || null;
  const vendorDetails = JSON.parse(localStorage.getItem("vendorFormData")) || null;
  const [showForm, setShowForm] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [roomType, setRoomType] = useState('');
  const [smoking, setSmoking] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [squareMeters, setSquareMeters] = useState('');
  const [bedType, setBedType] = useState('');
  const[price,setPrice] = useState();
  const [rooms, setRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const navigate = useNavigate()

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      const vendorId = vendorDetails.vendorId;
      try {
        if (vendorId) {
          // If vendorId is set, fetch rooms for that vendor only
          const q = query(collection(db, "hotel-rooms"), where("vendorId", "==", vendorId));
          const roomListSnapshot = await getDocs(q);
          const updatedRooms = roomListSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRooms(updatedRooms);
        } else {
          // Fetch all rooms if vendorId is not set
          const roomListSnapshot = await getDocs(collection(db, "hotel-rooms"));
          const updatedRooms = roomListSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRooms(updatedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };
    fetchRooms();
  }, []);

  // const handleAdd = async (e) => {
  //   e.preventDefault();
  //   try{
  //     await setDoc(doc(db, "users", current.uid), {
  //       ...data,
  //       timeStamp: serverTimestamp(),
  //     });

  //     const docSnapshot = await getDoc(doc(db, "users", current.uid));
  //     if (docSnapshot.exists()) {
  //       const addedData = docSnapshot.data();
  //       console.log("Document data:", addedData);
  //     } else {
  //       console.log("Document doesn't exist");
  //     }
  //     navigate("/profile")
  //   }
  //   catch(error){
  //     console.log(error);
  //   }
  // };

  const handleDelete = async (id) => {
    const vendorId = vendorDetails.vendorId;
    try {
      // Delete the room document from Firestore using its ID
      await deleteDoc(doc(db, 'hotel-rooms', id));

      // Fetch the updated list of rooms from Firestore and update the local state
      const q = query(collection(db, "hotel-rooms"), where("vendorId", "==", vendorId));
      const roomListSnapshot = await getDocs(q);
      const updatedRooms = roomListSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(updatedRooms);
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (roomId) => {
    setShowForm(true);
    setEditingRoomId(roomId); // Open the edit form for the selected room
    const room = rooms.find(room => room.id === roomId);
    if (room) {
      setRoomName(room.roomName);
      setRoomType(room.roomType);
      setSmoking(room.smoking);
      setNumberOfPeople(room.numberOfPeople);
      setSquareMeters(room.squareMeters);
      setBedType(room.bedType);
      setPrice(room.price);
    }
  };

  const handleCancelEdit = () => {
    setEditingRoomId(null); // Close the edit form
    // Clear the form fields
    setRoomName('');
    setRoomType('');
    setSmoking(false);
    setNumberOfPeople('');
    setSquareMeters('');
    setBedType('');
    setPrice('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Set vendorId from vendorDetails
    const vendorId = vendorDetails.vendorId;
  
    try {
      // Create a new room object with all the form data
      const newRoom = {
        vendorId,
        roomName,
        roomType,
        smoking,
        numberOfPeople,
        squareMeters,
        bedType,
        price,
        timeStamp: serverTimestamp(), // Add a timestamp
      };
  
      if (editingRoomId) {
        // If editing an existing room, update its data in Firestore
        await setDoc(doc(db, "hotel-rooms", editingRoomId), newRoom);
      } else {
        // If adding a new room, add it to the "hotel-rooms" collection in Firestore
        await addDoc(collection(db, "hotel-rooms"), newRoom);
      }

      // Clear the form fields after successful submission
      setRoomName('');
      setRoomType('');
      setSmoking(false);
      setNumberOfPeople('');
      setSquareMeters('');
      setBedType('');
      setPrice('');
  
      // Optionally, fetch the updated list of rooms from Firestore and update the local state
      // This step is necessary if you want to display the updated room list immediately after saving
      // Fetch the updated list of rooms from Firestore and update the local state
      const q = query(collection(db, "hotel-rooms"), where("vendorId", "==", vendorId));
      const roomListSnapshot = await getDocs(q);
      const updatedRooms = roomListSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(updatedRooms);
  
      // Hide the form after submission
      setShowForm(false);
      setEditingRoomId(null);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };


  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={toggleForm}
      >
        Add a Room
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
            <input
              type="hidden"
              id="vendorId"
              value={vendorDetails.vendorId}
            />   
            <label htmlFor="roomName" className="block text-gray-700 text-sm font-bold mb-2">Custom Room Name:</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="roomType" className="block text-gray-700 text-sm font-bold mb-2">Room Type:</label>
            <select
              id="roomType"
              name="roomType"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select room type</option>
              <option value="standard">Superior</option>
              <option value="deluxe">Deluxe</option>
              <option value="suite">Standard</option>
            </select>
          </div>
          <label htmlFor="roomName" className="block text-gray-700 text-sm font-bold mb-2">Number of rooms available in this type</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox text-blue-500 h-5 w-5"
                checked={smoking}
                onChange={(e) => setSmoking(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Smoking Room</span>
            </label>
          </div>
          <div className="mb-4">
            <label htmlFor="numberOfPeople" className="block text-gray-700 text-sm font-bold mb-2">Number of People:</label>
            <input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Price(per night):</label>
            <div>
              <label htmlFor="">Half board: </label>
              <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />

              <label htmlFor="">Full board: </label>
                  <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />


              <label htmlFor="">Bread and Breakfast</label>
                <input
                type="number"
                id="price"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />

            <label htmlFor="">Room Only </label>
              <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            </div>
            
          </div>
          <div className="mb-4">
            <label htmlFor="squareMeters" className="block text-gray-700 text-sm font-bold mb-2">Square Meters:</label>
            <input
              type="number"
              id="squareMeters"
              name="squareMeters"
              value={squareMeters}
              onChange={(e) => setSquareMeters(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bedType" className="block text-gray-700 text-sm font-bold mb-2">Bed Type:</label>
            <select
              id="bedType"
              name="bedType"
              value={bedType}
              onChange={(e) => setBedType(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Select bed type</option>
              <option value="twin">Twin Bed</option>
              <option value="single">Single Bed</option>
              <option value="double">Double Bed</option>
              <option value="master">Master Bed</option>
            </select>
          </div>

        {/* Amenities */}
        <div className="mb-4">
                    <label className="block font-bold mb-2">Amenities:</label>
                    <div>
                        <input type="checkbox" value="Free WiFi" /> Free WiFi <br />
                        <input type="checkbox" value="Air Conditioning" /> Air Conditioning <br />
                        <input type="checkbox" value="Swimming Pool" /> Television <br />
                        <input type="checkbox" value="Free WiFi" /> Room Service <br />
                        <input type="checkbox" value="Air Conditioning" /> Pet-Friendly <br />
                        <input type="checkbox" value="Swimming Pool" /> Non-smoking Rooms <br />
                        <input type="checkbox" value="Swimming Pool" /> Bath Tub <br />
                        <input type="checkbox" value="Free WiFi" /> Jacuzzi <br />
                        <input type="checkbox" value="Air Conditioning" />Bath robes <br />
                        <input type="checkbox" value="Swimming Pool" /> View <br />
                       

                        {/* Include other amenities similarly */}
                    </div>
                </div>

            <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Room photos input box:</label>
          </div>
                

          <div className="mb-6">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      )}
       {rooms.length > 0 && <RoomList rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />}
    </div>
  );
}

export default RoomForm;
