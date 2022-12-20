import * as actions from "./actions";



const initalState = {
    currentUser: {}
}


export function mainReducer(state=initalState, action){

    switch(action.type){
        case actions.FETCH_USER:
           const toReturn = {...state, currentUser: action.payload.user}
            return toReturn

        default:
            console.log("default called")
            return state
    }

}