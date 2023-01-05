import * as actions from "./actions";



const initalState = {
    currentUser: {}
}


export function mainReducer(state=initalState, action){

    switch(action.type){
        case actions.FETCH_USER:
           return {...state, currentUser: action.payload.user}

        case actions.GET_PRODUCT:
            return {...state, products: action.payload.products}

        default:
            console.log("default called")
            return state
    }

}