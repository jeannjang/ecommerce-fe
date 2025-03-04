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
    // Add totalPageNum to useSelector
    (state) => state.product
  );
  const [query] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
    category: query.get("category") || "",
  });

  useEffect(() => {
    setSearchQuery({
      page: query.get("page") || 1,
      name: query.get("name") || "",
      category: query.get("category") || "",
    });
  }, [query]);

  useEffect(() => {
    dispatch(getProductList(searchQuery)); // Add searchQuery as a dependency
    console.log("Search query changed:", searchQuery);
  }, [dispatch, searchQuery]);

  // Add useEffect to update URL query string when searchQuery changes
  useEffect(() => {
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const queryString = params.toString();
    navigate(`?${queryString}`);
  }, [navigate, searchQuery]);

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
            <Col lg={3} md={4} xs={6} className="mb-4" key={item._id}>
              <ProductCard item={item} />
            </Col>
          ))
        ) : (
          <div className="text-align-center empty-bag">
            {searchQuery.name === "" ? (
              <h4>No products to show yet.</h4>
            ) : (
              <h4>
                No items found matching "
                {searchQuery.name || searchQuery.category}"
              </h4>
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
