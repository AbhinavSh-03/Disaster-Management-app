// src/hooks/useNotifications.js
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"; // Adjust path based on your setup
import { toast } from "react-hot-toast";

export const useNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = [];
      snapshot.docChanges().forEach(change => {
        if (change.type === "added") {
          const data = change.doc.data();
          newNotifications.push({ id: change.doc.id, ...data });

          // Show toast
          toast(`${data.title}: ${data.message}`);
        }
      });

      setNotifications((prev) => [...newNotifications, ...prev]);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { notifications };
};
