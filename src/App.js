import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function App() {
  const [menu, setMenu] = useState([]);
  const [item, setItem] = useState("");
  const [person, setPerson] = useState("");
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    const menuRef = ref(db, "cottage/menu");
    const assignRef = ref(db, "cottage/assignments");

    onValue(menuRef, (snapshot) => {
      const data = snapshot.val() || {};
      setMenu(Object.values(data));
    });

    onValue(assignRef, (snapshot) => {
      setAssignments(snapshot.val() || {});
    });
  }, []);

  const addMenuItem = () => {
    if (!item) return;
    push(ref(db, "cottage/menu"), item);
    setItem("");
  };

  const assignPerson = (food) => {
    if (!person) return;
    set(ref(db, `cottage/assignments/${food}`), person);
    setPerson("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🍔 Cottage Menu</h2>

      <input
        placeholder="Add food item"
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <button onClick={addMenuItem}>Add</button>

      <ul>
        {menu.map((food, index) => (
          <li key={index}>
            {food}
            <button onClick={() => assignPerson(food)}> Assign</button>
          </li>
        ))}
      </ul>

      <h2>🛒 Who Buys What</h2>

      <input
        placeholder="Enter name"
        value={person}
        onChange={(e) => setPerson(e.target.value)}
      />

      <ul>
        {menu.map((food, index) => (
          <li key={index}>
            <strong>{food}</strong> → {assignments[food] || "Not assigned"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
