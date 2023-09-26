import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import {
  Button,
  Pagination,
  Table,
  TableCell,
  TableHead,
  TableRow,
  View
} from "@aws-amplify/ui-react"
import "../ui-components/NoteCreateForm";
import '@aws-amplify/ui-react/styles.css';
import { FaPenToSquare } from "react-icons/fa6";
import Modal from "react-modal";
import ProductCreateForm from "../ui-components/ProductCreateForm";
import ProductUpdateForm from "../ui-components/ProductUpdateForm";
import { listProducts } from "../graphql/queries";

function Products() {
  // Products
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const apiData = await API.graphql({ query: listProducts });
    const productsFromAPI = apiData.data.listProducts.items;
    await Promise.all(
      productsFromAPI.map(async note => note)
    );
    setProducts(productsFromAPI);
  }

  // Modals
  const [createModalIsOpen, setIsCreateOpen] = React.useState(false);
  const [updateModalIsOpen, setIsUpdateOpen] = React.useState(false);
  const [updateProductId, setUpdateProductId] = React.useState(-1);

  function openCreateModal() {
    setIsCreateOpen(true);
  }

  function closeCreateModal() {
    setIsCreateOpen(false);
  }

  function openUpdateModal() {
    setIsUpdateOpen(true);
  }

  function closeUpdateModal() {
    setIsUpdateOpen(false);
  }


  const [pageTokens, setPageTokens] = React.useState(['page2']);
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);

  const handleNextPage = async () => {
    if (hasMorePages && currentPageIndex === pageTokens.length) {
      const { nextToken } = await myAPI.fetch();
      console.log("nextToken =", nextToken);

      if (!nextToken) {
        setHasMorePages(false);
      }

      setPageTokens([...pageTokens, nextToken]);
    }

    setCurrentPageIndex(currentPageIndex + 1);
  };

  const mockedAPI = () => {
    const response = [
      {
        res: 'cat',
        nextToken: 'page3',
      },
      {
        res: 'parrot',
        nextToken: null,
      },
    ];
  
    let timesCalled = 0;
  
    return {
      fetch() {
        if (timesCalled < 2) {
          return response[timesCalled++];
        }
      },
    };
  };
  
  const myAPI = mockedAPI();

  return (
    <View marginTop="1rem">
        <Button onClick={openCreateModal}>
          Create New Product
        </Button>
        <Modal
          isOpen={createModalIsOpen}
          onRequestClose={closeCreateModal}
          contentLabel="Create Product"
        >
          <ProductCreateForm onSuccess={() => {
            fetchProducts();
            closeCreateModal();
          }}/>
        </Modal>
        <Modal
          isOpen={updateModalIsOpen}
          onRequestClose={closeUpdateModal}
          contentLabel="Update Product"
        >
          <ProductUpdateForm
            id={updateProductId}
            onSuccess={() => {
              fetchProducts();
              closeUpdateModal();
            }}
          />
        </Modal>
        <Table marginBottom="1rem" marginTop="1rem">
          <TableHead>
            <TableRow>
              <TableCell as="th">Name</TableCell>
              <TableCell as="th">Price</TableCell>
              <TableCell as="th">Stock Quantity</TableCell>
            </TableRow>
            {products.map(product => (
              <TableRow>
                <TableCell as="tr">
                  <Button
                    marginRight="1rem"
                    onClick={() => {
                      setUpdateProductId(product.id);
                      openUpdateModal();
                    }}
                  ><FaPenToSquare /></Button>
                  {product.name}
                </TableCell>
                <TableCell as="tr">{product.price}</TableCell>
                <TableCell as="tr">{product.stock_quantity}</TableCell>
              </TableRow>
            ))}
          </TableHead>
        </Table>
        <Pagination
            currentPage={currentPageIndex}
            totalPages={pageTokens.length}
            hasMorePages={hasMorePages}
            onNext={handleNextPage}
            onPrevious={() => setCurrentPageIndex(currentPageIndex - 1)}
            onChange={(pageIndex) => setCurrentPageIndex(pageIndex)}
        />
    </View>
  );
}

export default Products;
