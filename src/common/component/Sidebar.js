import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Offcanvas, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleSelectMenu = (url) => {
    setShow(false);
    navigate(url);
  };

  const NavbarContent = () => {
    return (
      <div className="p-3">
        <h6 className="text-uppercase mb-3">Admin Account</h6>
        <ul className="nav flex-column">
          <li className="nav-item">
            <button
              className="btn text-start border-0 w-100 py-2"
              onClick={() => handleSelectMenu("/admin/product?page=1")}
            >
              Products
            </button>
          </li>
          <li className="nav-item">
            <button
              className="btn text-start border-0 w-100 py-2"
              onClick={() => handleSelectMenu("/admin/order?page=1")}
            >
              Orders
            </button>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <Navbar bg="light" expand={false}>
      <Container fluid>
        <div className="col-auto">
          {" "}
          {/* Navbar와 동일한 클래스 사용 */}
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => setShow(true)}
            className="cursor-pointer text-dark"
            style={{ fontSize: "1.2rem" }}
          />
        </div>
        <Link to="/">
          <img
            width={80}
            src="/image/hm-logo.png"
            alt="hm-logo"
            className="img-fluid"
          />
        </Link>
        <div style={{ width: "42px" }}></div> {/* 햄버거 메뉴 너비만큼 여백 */}
        <Navbar.Offcanvas
          show={show}
          onHide={() => setShow(false)}
          placement="start"
        >
          <Offcanvas.Header closeButton />
          <Offcanvas.Body>{NavbarContent()}</Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default Sidebar;
