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
  async (itemId, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);

      return response.data.cart;
    } catch (error) {
      dispatch(
        showToastMessage({
          message:
            error.message ||
            "Failed to delete item from cart, please try again",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",
  async ({ itemId, qty }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { qty });

      return response.data.cart;
    } catch (error) {
      let errorMessage = "Cnnot update item quantity";
      if (error.message === "Out of stock") {
        errorMessage = "Out of stock";
      }

      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );

      return rejectWithValue(error.message);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cart");
      return response.data.cart?.items?.length || 0;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
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
        // calculate total price
        state.totalPrice = state.cartList.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);
      })
      .addCase(getCartList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.cartList = [];
      })
      .addCase(getCartQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCartQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItemCount = action.payload;
      })
      .addCase(getCartQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload.items;
        state.cartItemCount = action.payload.items.length;
        state.totalPrice = state.cartList.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQty.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateCartItemQty.fulfilled, (state, action) => {
        state.loading = false;
        state.cartList = action.payload.items;
        state.cartItemCount = action.payload.items.length;
        state.totalPrice = state.cartList.reduce((total, item) => {
          return total + item.productId.price * item.qty;
        }, 0);
      })
      .addCase(updateCartItemQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const hasInsufficientStock = (state) => {
  return state.cart.cartList.some((item) => {
    const currentStock = item.productId.stock[item.size] || 0;
    return currentStock < item.qty;
  });
};

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
