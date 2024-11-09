import React, { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import { Row, Col, Container, Spinner } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductList } from "../../features/product/productSlice";
import ReactPaginate from "react-paginate";

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    productList,
    loading: productLoading,
    totalPageNum,
  } = useSelector(
    // totalPageNum 추가
    (state) => state.product
  );
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  });

  useEffect(() => {
    setSearchQuery({
      page: query.get("page") || 1,
      name: query.get("name") || "",
    });
  }, [query]);

  useEffect(() => {
    dispatch(getProductList(searchQuery)); // searchQuery로 변경
  }, [searchQuery]);

  // URL 쿼리 업데이트를 위한 useEffect 추가
  useEffect(() => {
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    navigate(`?${queryString}`);
  }, [searchQuery]);

  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  if (productLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container>
      <Row className="mb-5">
        {productList.length > 0 ? (
          productList.map((item) => (
            <Col md={3} sm={12} key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {searchQuery.name === "" ? (
              <h4>No products to show yet.</h4>
            ) : (
              <h4>No items found matching "{searchQuery.name}"</h4>
            )}
          </div>
        )}
      </Row>

      {productList.length > 0 && (
        <div className="mt-4 mb-5">
          <ReactPaginate
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPageNum}
            forcePage={searchQuery.page - 1}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination justify-content-center"
            activeClassName="active"
          />
        </div>
      )}
    </Container>
  );
};

export default LandingPage;
