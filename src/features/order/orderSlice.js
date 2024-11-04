import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty, initialCart } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", {
        ...orderData,
        items: orderData.orderList.map((item) => ({
          ...item,
          quantity: item.qty, // qty를 quantity로 변환
        })),
      });

      if (response.data.status === "success") {
        dispatch(
          showToastMessage({
            message: "주문이 완료되었습니다!",
            status: "success",
          })
        );

        dispatch(initialCart());
        dispatch(getCartQty());

        return response.data.orderNum;
      }
    } catch (error) {
      dispatch(
        showToastMessage({
          message: error.message || "주문 처리 중 오류가 발생했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (_, { rejectWithValue, dispatch }) => {}
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue, dispatch }) => {}
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {}
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderList: [],
    orderNum: "",
    selectedOrder: {},
    error: "",
    loading: false,
    totalPageNum: 1,
  },
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
    clearOrderNum: (state) => {
      state.orderNum = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        state.orderNum = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orderNum = "";
      });
  },
});

export const { setSelectedOrder, clearOrderNum } = orderSlice.actions;
export default orderSlice.reducer;
