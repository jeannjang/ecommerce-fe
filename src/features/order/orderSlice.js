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
      // 백엔드 재고 부족관련 에러 메시지 ㅣㅣ그 외 에러 메시지 처리
      const errorMessage =
        error.message ||
        "Sorry, we couldn't process your order right now. Please try again.";

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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/order");
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "order/getOrderList",
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get("/order/list", { params: query });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async ({ id, status }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.put(`/order/${id}`, { status });

      if (response.data.status === "success") {
        dispatch(
          showToastMessage({
            message: "Order status updated successfully",
            status: "success",
          })
        );
        return response.data.order;
      }
    } catch (error) {
      dispatch(
        showToastMessage({
          message:
            error.message || "Failed to update order status, please try again",
          status: "error",
        })
      );
      return rejectWithValue(error.message);
    }
  }
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
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.loading = false;
        state.orderList = action.payload.orders;
        state.totalPageNum = action.payload.totalPageNum;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.error = "";
        // 업데이트된 주문으로 리스트 업데이트
        state.orderList = state.orderList.map((order) =>
          order._id === action.payload._id ? action.payload : order
        );
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedOrder } = orderSlice.actions;
export default orderSlice.reducer;
