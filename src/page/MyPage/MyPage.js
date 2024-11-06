import React, { useEffect } from "react";
import { Container, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import OrderStatusCard from "./component/OrderStatusCard";
import "./style/orderStatus.style.css";
import { getOrder } from "../../features/order/orderSlice";

const MyPage = () => {
  const dispatch = useDispatch();
  const { orderList, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getOrder());
  }, [dispatch]);

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="no-order-box">
        <div>An error occurred while loading your orders.</div>
        <div className="text-muted">{error}</div>
      </Container>
    );
  }

  if (!orderList?.length) {
    return (
      <Container className="no-order-box">
        <div>You have no orders in progress.</div>
      </Container>
    );
  }

  return (
    <Container className="status-card-container">
      {orderList.map((item) => (
        <OrderStatusCard
          orderItem={item}
          className="status-card-container"
          key={item._id}
        />
      ))}
    </Container>
  );
};

export default MyPage;
