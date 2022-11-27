import { initializeApp } from "@firebase/app";
import {getAuth} from "@firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyAw_-OFoQJMwpGv0ybXGvzydI_gdwMMHWA",
  authDomain: "ebili-f8d13.firebaseapp.com",
  projectId: "ebili-f8d13",
  storageBucket: "ebili-f8d13.appspot.com",
  messagingSenderId: "172369382261",
  appId: "1:172369382261:web:a0cbe453697315b095e13c"
};



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {auth};
