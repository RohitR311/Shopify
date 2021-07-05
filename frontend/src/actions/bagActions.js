import axios from "axios";
import {
  BAG_ADD_ITEM,
  BAG_ADD_SUCCESS,
  BAG_LIST_FAILURE,
  BAG_LIST_REQUEST,
  BAG_LIST_SUCCESS,
  BAG_REMOVE_ITEM,
} from "../constants/bagConstants";

export const listBagItems = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BAG_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/products/recommendations/`, config);

    dispatch({
      type: BAG_LIST_SUCCESS,
      payload: data,
    });

    localStorage.setItem(
      "bagItems",
      JSON.stringify(getState().smartBag.bagItems)
    );
  } catch (error) {
    dispatch({
      type: BAG_LIST_FAILURE,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const addToBag = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: BAG_ADD_SUCCESS,
      payload: {
        _id: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qtty: qty,
      },
    });

    localStorage.setItem(
      "bagItems",
      JSON.stringify(getState().smartBag.bagItems)
    );
  } catch (error) {
    dispatch({
      type: BAG_LIST_FAILURE,
      payload:
        error.response && error.response.data.detail
          ? error.response.data.detail
          : error.message,
    });
  }
};

export const removeFromBag = (id) => (dispatch, getState) => {
  dispatch({
    type: BAG_REMOVE_ITEM,
    payload: id,
  });
  localStorage.setItem(
    "bagItems",
    JSON.stringify(getState().smartBag.bagItems)
  );
};
