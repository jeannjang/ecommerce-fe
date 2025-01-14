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

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, loading: userSliceLoading } = useSelector(
    (state) => state.user
  );
  const { cartItemCount } = useSelector((state) => state.cart);
  const menuList = ["WOMAN", "MAN", "PERFUEMS", "NEW"];
  let [width, setWidth] = useState(0);
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

  return (
    <div className="container-fluid">
      {/* 사이드 메뉴 추가 */}
      <div
        className="side-menu shadow"
        style={{
          width,
          transform: `translateX(${width === 0 ? "-100%" : "0"})`,
        }}
      >
        <button
          className="position-absolute top-0 end-0 btn border-0 p-3"
          onClick={() => setWidth(0)}
        >
          &times;
        </button>
        <div className="d-flex flex-column p-3">
          {menuList.map((menu, index) => (
            <button
              key={index}
              className="btn text-start border-0 py-2"
              onClick={() => {
                setWidth(0);
              }}
            >
              {menu}
            </button>
          ))}
        </div>
      </div>
      {/* 최상단 Admin 링크 */}
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

      {/* 메인 네비게이션 바 */}
      <div className="row align-items-center py-3">
        {/* 왼쪽: 햄버거 메뉴 (모바일) */}
        <div className="col-auto d-md-none">
          <FontAwesomeIcon
            icon={faBars}
            onClick={() => setWidth(250)}
            className="cursor-pointer"
          />
        </div>

        {/* 중앙: 검색창 */}
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

        {/* 오른쪽: 유저 메뉴 */}
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

      {/* 로고 */}
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

      {/* 카테고리 메뉴 */}
      <div>
        <ul className="nav justify-content-center py-2">
          {menuList.map((menu, index) => (
            <li key={index} className="nav-item">
              <button className="nav-link text-dark border-0 bg-transparent">
                {menu}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
