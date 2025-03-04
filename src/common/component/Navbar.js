import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/user/userSlice";
import { Spinner } from "react-bootstrap";
import { CATEGORY } from "../../constants/product.constants";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, loading: userSliceLoading } = useSelector(
    (state) => state.user
  );
  const { cartItemCount } = useSelector((state) => state.cart);
  const menuList = ["ALL", ...CATEGORY];
  let [mobileSideBar, setMobileSideBar] = useState(0);
  let navigate = useNavigate();
  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleCategoryClick = (menu) => {
    setMobileSideBar(0);

    if (menu === "ALL") {
      navigate("/");
    } else {
      navigate(`/?category=${menu}`);
    }
  };

  return (
    <div className="container-fluid">
      {/* sidebar menu */}
      <div
        className="side-menu shadow"
        style={{
          mobileSideBar,
          transform: `translateX(${mobileSideBar === 0 ? "-100%" : "0"})`,
        }}
      >
        <button
          className="position-absolute top-0 end-0 btn border-0 p-3"
          onClick={() => setMobileSideBar(0)}
        >
          &times;
        </button>
        <div className="d-flex flex-column p-3">
          {menuList.map((menu, index) => (
            <button
              key={index}
              className="btn text-start border-0 py-2"
              onClick={() => handleCategoryClick(menu)}
            >
              {menu.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      {/* Top: Admin page link */}
      {user && user.level === "admin" && (
        <div className="text-end py-2">
          <Link
            to="/admin/product?page=1"
            className="text-dark small text-decoration-none"
          >
            ADMIN PAGE
          </Link>
        </div>
      )}

      {/* main navigation bar */}
      <div className="row align-items-center py-3">
        {/* Left: hamberger sidebar menu for mobile */}
        <div className="col-auto d-md-none">
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => setMobileSideBar(250)}
            className="cursor-pointer"
          />
        </div>

        {/* center: Search bar */}
        <div className="col d-flex justify-content-center">
          <div className="search-input-container">
            <div className="input-group">
              <span className="input-group-text border-0 bg-transparent">
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input
                type="text"
                className="form-control border-0 bg-transparent"
                placeholder="Search..."
                onKeyPress={onCheckEnter}
              />
            </div>
          </div>
        </div>

        {/* Right: User menu */}
        <div className="col-auto">
          <div className="d-flex align-items-center gap-4">
            {userSliceLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <>
                <div
                  onClick={user ? handleLogout : () => navigate("/login")}
                  className="d-flex align-items-center cursor-pointer"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="ms-1 mt-1 d-none d-md-inline small">
                    {user ? "SIGN OUT" : "SIGN IN"}
                  </span>
                </div>
                <div
                  onClick={() => navigate("/cart")}
                  className="d-flex align-items-center cursor-pointer position-relative"
                >
                  <FontAwesomeIcon icon={faShoppingBag} />
                  {cartItemCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartItemCount}
                      <span className="visually-hidden">items in cart</span>
                    </span>
                  )}
                </div>
                <div
                  onClick={() => navigate("/account/purchase")}
                  className="d-flex align-items-center cursor-pointer"
                >
                  <FontAwesomeIcon icon={faBox} />
                  <span className="visually-hidden">MY ORDER</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="text-center py-3">
        <Link to="/">
          <img
            width={100}
            src="/image/jara-logo.png"
            alt="jara-logo"
            className="img-fluid"
          />
        </Link>
      </div>

      {/* Category menu */}
      <div>
        <ul className="nav justify-content-center py-2">
          {menuList.map((menu, index) => (
            <li key={index} className="nav-item">
              <button
                className="nav-link text-dark border-0 bg-transparent"
                onClick={() => handleCategoryClick(menu)}
              >
                {menu.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
