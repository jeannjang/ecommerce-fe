import React, { useEffect, useState } from "react";
import { Container, Button, Modal } from "react-bootstrap"; // Modal import 추가
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
  });

  const [mode, setMode] = useState("new");
  // Add state for delete double-check modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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

  useEffect(() => {
    dispatch(getProductList(searchQuery));
  }, [dispatch, searchQuery]);

  useEffect(() => {
    if (searchQuery.name === "") {
      delete searchQuery.name;
    }
    const params = new URLSearchParams(searchQuery);
    const query = params.toString();
    navigate(`?${query}`);
  }, [navigate, searchQuery]);

  // Change deleteItem to handleDeleteClick
  const handleDeleteClick = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  // Add function to execute actual deletion
  const confirmDelete = () => {
    dispatch(deleteProduct(deleteTargetId));
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // Add function to cancel deletion
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  };

  // Set edit mode and open product modification modal
  const openEditForm = (product) => {
    setMode("edit");
    dispatch(setSelectedProduct(product));
    setShowDialog(true);
  };

  // Set new mode and open product creation modal
  const handleClickNewItem = () => {
    setMode("new");
    setShowDialog(true);
  };

  // Update page value in query
  const handlePageClick = ({ selected }) => {
    setSearchQuery({ ...searchQuery, page: selected + 1 });
  };

  return (
    <div>
      <Container fluid className="px-3">
        <div className="mt-2 ">
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
            deleteItem={handleDeleteClick} // Change deleteItem prop to handleDeleteClick
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

        <Modal show={showDeleteModal} onHide={cancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Delete Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center">
            <div className="mb-3">
              <i
                className="fas fa-exclamation-triangle text-warning"
                style={{ fontSize: "48px" }}
              ></i>
            </div>
            <p>Are you sure you want to delete this product?</p>
            <p className="text-muted small">
              This action cannot be undone once deleted.
            </p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="outline-secondary" onClick={cancelDelete}>
              No, Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </Modal.Footer>
        </Modal>

        <NewItemDialog
          mode={mode}
          showDialog={showDialog}
          setShowDialog={setShowDialog}
        />
      </Container>
    </div>
  );
};

export default AdminProductPage;
