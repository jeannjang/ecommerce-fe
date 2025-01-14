import React from "react";
import { Table, Badge } from "react-bootstrap";
import { badgeBg } from "../../../constants/order.constants";
import { currencyFormat } from "../../../utils/number";

const OrderTable = ({ header, data, openEditForm }) => {
  return (
    <div className="overflow-x">
      <Table striped bordered hover>
        <thead>
          <tr>
            {header.map((title, index) => (
              <th key={index}>{title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item._id || index} onClick={() => openEditForm(item)}>
                <td>{index}</td>
                <td>{item.orderNum}</td>
                <td>{item.createdAt?.slice(0, 10)}</td>
                <td>{item.userId?.email}</td>
                <td>
                  {item.items?.[0]?.productId?.name}
                  {item.items?.length > 1 &&
                    ` with ${item.items.length - 1} more`}
                </td>
                <td>{item.shipTo}</td>
                <td>{currencyFormat(item.totalPrice)}</td>
                <td>
                  {item.status && (
                    <Badge bg={badgeBg[item.status]}>{item.status}</Badge>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length} className="text-center">
                No Data to show
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};
export default OrderTable;
