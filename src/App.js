import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, set } from "firebase/database";
// 🔥 Replace with your Firebase config
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


export default function CottagePlanner() {
  const [menu, setMenu] = useState([]);
  const [item, setItem] = useState("");
  const [person, setPerson] = useState("");
  const [assignments, setAssignments] = useState({});

  // 🔄 Real-time sync
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
    const menuRef = ref(db, "cottage/menu");
    push(menuRef, item);
    setItem("");
  };

  const assignPerson = (food) => {
    if (!person) return;
    const assignRef = ref(db, `cottage/assignments/${food}`);
    set(assignRef, person);
    setPerson("");
  };

  return (
    <div className="p-6 grid gap-6 md:grid-cols-2">
      <Card className="rounded-2xl shadow">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">🍔 Cottage Menu (Live)</h2>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Add food item (e.g. BBQ Chicken)"
              value={item}
              onChange={(e) => setItem(e.target.value)}
            />
            <Button onClick={addMenuItem}>Add</Button>
          </div>
          <ul className="space-y-2">
            {menu.map((food, index) => (
              <li key={index} className="flex justify-between items-center border p-2 rounded-xl">
                <span>{food}</span>
                <Button size="sm" onClick={() => assignPerson(food)}>
                  Assign
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-4">🛒 Who Buys What (Live)</h2>
          <Input
            placeholder="Enter your name"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            className="mb-4"
          />
          <ul className="space-y-2">
            {menu.map((food, index) => (
              <li key={index} className="border p-2 rounded-xl">
                <strong>{food}</strong> → {assignments[food] || "Not assigned"}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
