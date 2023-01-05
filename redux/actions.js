import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

//Action types
export const FETCH_USER = "FETCH_USER";
export const GET_PRODUCT = "GET_PRODUCT";

export const fetchUser = (userCol, user) => (dispatch) => {
  const q = query(userCol, where("id", "==", user.currentUser.uid));

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

export const getProducts = () => (dispatch) => {
  const productsRef = collection(db, "products");
  onSnapshot(productsRef, (snapshot) => {
    const products = [];
    snapshot.docs.forEach((doc) => {
      products.push({ ...doc.data(), docID: doc.id });
    });
    dispatch({
      type: GET_PRODUCT,
      payload: {
        products,
      },
    });
  });
};
