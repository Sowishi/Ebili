import { getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";

//Action types
export const FETCH_USER = "FETCH_USER";

export const fetchUser = (userCol, user) => (dispatch) => {
  const q = query(userCol, where("id", "==", user.currentUser.uid));

  //   onSnapshot(q, (snapshot) => {
  //     const users = [];
  //     snapshot.docs.forEach((doc) => {
  //       users.push({ ...doc.data(), docID: doc.id });
  //     });
  //   });

  getDocs(q)
    .then((snapshot) => {
      const users = [];
      snapshot.docs.forEach((doc) => {
        users.push({ ...doc.data(), docID: doc.id });
      });
      return users;
    })
    .then((users) => {
      dispatch({
        type: FETCH_USER,
        payload: {
          user: users[0],
        },
      });
    });
};
