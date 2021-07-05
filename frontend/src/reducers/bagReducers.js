import {
  BAG_ADD_ITEM,
  BAG_ADD_SUCCESS,
  BAG_CLEAR_ITEMS,
  BAG_LIST_FAILURE,
  BAG_LIST_REQUEST,
  BAG_LIST_SUCCESS,
  BAG_REMOVE_ITEM,
} from "../constants/bagConstants";

export const bagItemsReducer = (state = { bagItems: [] }, action) => {
  switch (action.type) {
    case BAG_LIST_REQUEST:
      return { loading: true, bagItems: [] };

    case BAG_LIST_SUCCESS:
      return {
        loading: false,
        bagItems: action.payload,
      };

    case BAG_LIST_FAILURE:
      return { loading: false, error: action.payload };

    case BAG_ADD_SUCCESS:
      const item = action.payload;
      const existItem = state.bagItems.find((x) => x._id === item._id);

      return {
        ...state,
        bagItems: state.bagItems.map((x) =>
          x._id === existItem._id ? item : x
        ),
      };

    case BAG_REMOVE_ITEM:
      return {
        ...state,
        bagItems: state.bagItems.filter((x) => x._id !== action.payload),
      };

    case BAG_CLEAR_ITEMS:
      return { ...state, bagItems: [] };

    default:
      return state;
  }
};
