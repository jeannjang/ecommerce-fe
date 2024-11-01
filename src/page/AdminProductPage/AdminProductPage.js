import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";
import SearchBox from "../../common/component/SearchBox";
import NewItemDialog from "./component/NewItemDialog";
import ProductTable from "./component/ProductTable";
import {
  getProductList,
  deleteProduct,
  setSelectedProduct,
} from "../../features/product/productSlice";

const AdminProductPage = () => {
  const navigate = useNavigate();
  const [query] = useSearchParams();
  const dispatch = useDispatch();
  const { productList, totalPageNum } = useSelector((state) => state.product);
  const [showDialog, setShowDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState({
    page: query.get("page") || 1,
    name: query.get("name") || "",
  }); //검색 조건들을 저장하는 객체

  const [mode, setMode] = useState("new");

  const tableHeader = [
    "#",
    "Sku",
    "Name",
    "Price",
    "Stock",
    "Image",
    "Status",
    "",
  ];

  //상품리스트 가져오기 (url쿼리 맞춰서)
  useEffect(() => {
    dispatch(getProductList(searchQuery));
  }, [query]);

  //검색어나 페이지가 바뀌면 url바꿔주기 (검색어또는 페이지가 바뀜 => url 바꿔줌=> url쿼리 읽어옴=> 이 쿼리값 맞춰서  상품리스트 가져오기)
  useEffect(() => {
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate(`?${query}`);
  }, [searchQuery]);

  const deleteItem = (id) => {
    //아이템 삭제
    dispatch(deleteProduct(id));
  };

  const openEditForm = (product) => {
    //edit모드로 설정하고 아이템 수정다이얼로그 열기
    setMode("edit");
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  const handleClickNewItem = () => {
    //new 모드로 설정하고 다이얼로그 열기
    setMode("new");
    setShowDialog(true);
  };

  const handlePageClick = ({ selected }) => {
    //  쿼리에 페이지값 바꿔주기
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  return (
    <div className="locate-center">
      <Container>
        <div className="mt-2">
          <SearchBox
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Enter product name..."
            field="name"
          />
        </div>
        <Button className="mt-2 mb-2" onClick={handleClickNewItem}>
          Add New Item +
        </Button>

        <div className="mb-5">
          <ProductTable
            header={tableHeader}
            data={productList || []}
            deleteItem={deleteItem}
            openEditForm={openEditForm}
            searchQuery={searchQuery}
          />
        </div>

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
            pageLinkClassName="page-link shadow-none"
            previousClassName="page-item"
            previousLinkClassName="page-link shadow-none"
            nextClassName="page-item"
            nextLinkClassName="page-link shadow-none"
            breakLabel="..."
            breakClassName="page-item"
            breakLinkClassName="page-link shadow-none"
            containerClassName="pagination"
            activeClassName="active"
            className="display-center list-style-none"
          />
        </div>
      </Container>

      <NewItemDialog
        mode={mode}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
      />
    </div>
  );
};

export default AdminProductPage;
