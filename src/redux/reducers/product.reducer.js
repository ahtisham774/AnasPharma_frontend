import { ProductTypes } from "../types";

const initialState = {
    product: {},
    isLoading: false,
    isError: false,
};

const ProductReducer = (state = initialState, action) => {

    switch (action.type) {
        case ProductTypes.PRODUCT_ADD_REQUEST:
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case ProductTypes.PRODUCT_DELETE_REQUEST:
            return {
                ...state,
                isLoading: false,
                isError: false,
            };
        case ProductTypes.PRODUCT_EDIT_REQUEST:
            return {
                ...state,
                isLoading: false,
                isError: false,
            };
        case ProductTypes.PRODUCT_ADDED:
            return {
                ...state,
                product: Object.keys(state?.product).length > 0 ? [...state?.product, action.data?.product] : [action?.data?.product],
                isLoading: false,
                isError: false,
            };
        case ProductTypes.PRODUCT_DELETED:
            return {
                ...state,
                product: Object.keys(state?.product).length > 0 ? [...state?.product?.filter(item => item._id !== action?.data?.id)] : [],
                isLoading: false,
                isError: false,
            };
        case ProductTypes.PRODUCT_ERROR:
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case ProductTypes.PRODUCT_READ:
            return {
                ...state,
                product: action.data,
                isLoading: false,
                isError: false,
            };
        case ProductTypes.PRODUCT_UPDATED:
            return {
                ...state,
                // get the index of updated product and update it
                product: Object.keys(state?.product).length > 0 ? [...state?.product?.filter(item => item._id !== action?.data?.product?._id), action?.data?.product] : [action?.data?.product],
                isLoading: false,
                isError: false,
            };
        case ProductTypes.PRODUCT_QUANTITY_UPDATED:
            console.log(action)
            return {
                ...state,
                product: state?.product?.map(element => {
                    const matchingItem = action?.data?.product?.find(item => element?._id === item?._id)
                    if (matchingItem) {
                        return { ...element, ...matchingItem }; // Merge element with matchingItem
                    } else {
                        return element; // Return original element if no match found
                    }
                }),
                isLoading: false,
                isError: false,
            };
        default:
            return state;
    }
};

export default ProductReducer;
