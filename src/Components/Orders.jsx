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
import '@aws-amplify/ui-react/styles.css';
import Modal from "react-modal";
import OrderCreateForm from "../ui-components/OrderCreateForm";
import OrderUpdateForm from "../ui-components/OrderUpdateForm";
import { listOrders } from "../graphql/queries";

function Orders() {
  // Orders
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const apiData = await API.graphql({ query: listOrders });
    const ordersFromAPI = apiData.data.listOrders.items;
    await Promise.all(
      ordersFromAPI.map(async note => note)
    );
    setOrders(ordersFromAPI);
  }

  // Modals
  const [createModalIsOpen, setIsCreateOpen] = React.useState(false);
  const [updateModalIsOpen, setIsUpdateOpen] = React.useState(false);
  const [updateOrderId, setUpdateOrderId] = React.useState(-1);

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
          Create New Order
        </Button>
        <Modal
          isOpen={createModalIsOpen}
          onRequestClose={closeCreateModal}
          contentLabel="Create Order"
        >
          <OrderCreateForm onSuccess={() => {
            fetchOrders();
            closeCreateModal();
          }}/>
        </Modal>
        <Modal
          isOpen={updateModalIsOpen}
          onRequestClose={closeUpdateModal}
          contentLabel="Update Order"
        >
          <OrderUpdateForm
            id={updateOrderId}
            onSuccess={() => {
              fetchOrders();
              closeUpdateModal();
            }}
          />
        </Modal>
        <Table marginBottom="1rem" marginTop="1rem">
          <TableHead>
            <TableRow>
              <TableCell as="th">ID</TableCell>
              <TableCell as="th">Product Name</TableCell>
              <TableCell as="th">Tracking Company</TableCell>
              <TableCell as="th">Tracking Number</TableCell>
              <TableCell as="th">Status</TableCell>
            </TableRow>
            {orders.map(order => (
              <TableRow as="tr">
                <TableCell>
                  <Button
                    marginRight="1rem"
                    onClick={() => {
                      setUpdateOrderId(order.id);
                      openUpdateModal();
                    }}
                  >Edit</Button>
                  {order.id}
                </TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.tracking_company}</TableCell>
                <TableCell>{order.tracking_number}</TableCell>
                <TableCell>{order.status}</TableCell>
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

export default Orders;
