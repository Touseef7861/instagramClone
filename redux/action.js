import {Add_To_Cart,Remove_From_Cart,USER_LIST} from './constants'

export function addToCart(item){
    return{
        type:Add_To_Cart,
        data:item
    }
}
export function removeFromCart(item){
    return{
        type:Remove_From_Cart,
        data:item
    }
}
export function getUserList() {
    return {
      type: USER_LIST,
    };
  }