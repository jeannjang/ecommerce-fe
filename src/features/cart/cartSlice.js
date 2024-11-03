import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/cart", { productId: id, size, qty: 1 });

      if (response.data.status === "success") {
        dispatch(
          showToastMessage({
            message: "Item added to cart successfully",
            status: "success",
          })
        );
        return response.data.cartItemQty; // 성공 시에만 cartItemQty 반환
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.message || "Failed to add item to cart",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {}
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue }) => {}
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {}
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    loading: false,
    error: "",
    cartList: [],
    selectedItem: {},
    cartItemCount: 0,
    totalPrice: 0,
  },
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartItemCount = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCartList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartList.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.cartList = action.payload.cart?.items || [];
        state.totalPrice = state.cartList.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cartList = [];
      });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
