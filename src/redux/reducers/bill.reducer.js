import e from "cors";
import { BillTypes } from "../types";


const initialState = {
    bill: [],
    isLoading: false,
    isError: false,
};

const BillReducer = (state = initialState, action) => {
    console.log(action);
    switch (action.type) {
        case BillTypes.BILL_ADD_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case BillTypes.BILL_DELETE_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case BillTypes.BILL_EDIT_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case BillTypes.BILL_ADDED:
            return {
                ...state,
                isLoading: false,
                isError: false,
            };
        case BillTypes.BILL_DELETED:
            return {
                ...state,
                isLoading: false,
                isError: false,
            };
        case BillTypes.BILL_ERROR:
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case BillTypes.BILL_READ:
            return {
                ...state,
                bill: action.data,
                isLoading: false,
                isError: false,
            };
        default:
            return state;
    }
};

export default BillReducer;
