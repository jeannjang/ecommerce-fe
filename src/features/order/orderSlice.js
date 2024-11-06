import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCartQty, initialCart } from "../cart/cartSlice";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async ({ navigate, orderData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/order", {
        ...orderData,
        items: orderData.orderList.map((item) => ({
          ...item,
          qty: item.qty,
        })),
      });

      if (response.data.status === "success") {
        dispatch(
          showToastMessage({
            message: "Your order has been completed!",
            status: "success",
          })
        );

        dispatch(initialCart());
        // dispatch(getCartQty());

        navigate("/payment/success", {
          state: { orderNum: response.data.orderNum },
        });

        return response.data.orderNum;
      }
    } catch (error) {
      // 재고 부족 등의 에러 메시지 처리
      const errorMessage = error.message || "주문 처리 중 오류가 발생했습니다.";

      dispatch(
        showToastMessage({
          message: errorMessage,
          status: "error",
        })
      );

      return rejectWithValue(errorMessage);
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
    selectedOrder: {},
    error: "",
    loading: false,
    totalPageNum: 1,
  },
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
