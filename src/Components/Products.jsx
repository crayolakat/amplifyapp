import React, { useState, useEffect } from "react";
import $ from 'jquery';
import { API } from "aws-amplify";
import {
  Button,
  Pagination,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Text,
  View
} from "@aws-amplify/ui-react"
import '@aws-amplify/ui-react/styles.css';
import Modal from "react-modal";
import ProductCreateForm from "../ui-components/ProductCreateForm";
import ProductUpdateForm from "../ui-components/ProductUpdateForm";
import { listOrders, listProducts } from "../graphql/queries";
import {
  updateProduct as updateProductMutation
} from "../graphql/mutations";
import OrderCreateForm from "../ui-components/OrderCreateForm";

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
  const [currentProductId, setCurrentProductId] = React.useState(-1);
  const [orderModalIsOpen, setIsOrderOpen] = React.useState(false);

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

  function openOrderModal() {
    setIsOrderOpen(true);
  }

  function closeOrderModal() {
    setIsOrderOpen(false);
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
      <Text color="red" textAlign="center">TODO: Implement sorting and filtering</Text>
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
          id={currentProductId}
          onSuccess={() => {
            fetchProducts();
            closeUpdateModal();
          }}
        />
      </Modal>
      <Modal
        isOpen={orderModalIsOpen}
        onRequestClose={closeOrderModal}
        contentLabel="Create Order"
      >
        <OrderCreateForm
          productId={currentProductId}
          onSuccess={async fields => {
            const product = products.find(product => product.id === currentProductId);
            const newQuantity = product.stock_quantity - fields.quantity;
            await API.graphql({
              query: updateProductMutation,
              variables: {
                input: {
                  id: product.id,
                  stock_quantity: newQuantity
                }
              },
            })
            product.stock_quantity = newQuantity;
            closeOrderModal();
            $("#orders-tab").trigger("click");
          }}
        />
      </Modal>
      <Table marginBottom="1rem" marginTop="1rem">
        <TableHead>
          <TableRow>
          <TableCell as="th">Actions</TableCell>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th">Price</TableCell>
            <TableCell as="th">Stock Quantity</TableCell>
          </TableRow>
          {products.map(product => (
            <TableRow key={product.id}>
              <TableCell>
                <Button
                  marginRight="1rem"
                  onClick={() => {
                    setCurrentProductId(product.id);
                    openUpdateModal();
                  }}
                >
                  Edit
                </Button>
                <Button
                  marginRight="1rem"
                  onClick={() => {
                    setCurrentProductId(product.id);
                    openOrderModal();
                  }}
                >
                  Add Order
                </Button>
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
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
      <Text color="red" textAlign="center">TODO: Implement pagination</Text>
    </View>
  );
}

export default Products;
