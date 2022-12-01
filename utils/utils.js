import { userCol, db } from "../firebaseConfig";
import { getDocs, query, where, updateDoc, doc } from "firebase/firestore";

const fetchUserData = (userUID) => {
    const q = query(userCol, where("id", "==", userUID));

    getDocs(q)
      .then((snapshot) => {
        const users = [];
        snapshot.docs.forEach((doc) => {
          users.push({ ...doc.data(), docID: doc.id });
        });
        return users[0]
      })
      .catch((e) => {
        console.log(e);
      });
  };


  export {fetchUserData}