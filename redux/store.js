
import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { mainReducer } from "./reducers";


const rootReducer = combineReducers({mainReducer});

export const Store = configureStore({reducer: rootReducer, middleware: [thunk]})

