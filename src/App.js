import React, { useState, useEffect } from "react";
import '@aws-amplify/ui-react/styles.css';
import { API, Storage } from "aws-amplify";
import {
  Button,
  Flex,
  Heading,
  Image,
  Tabs,
  TabItem,
  Text,
  TextField,
  View,
  withAuthenticator
} from '@aws-amplify/ui-react';
import Products from "./Components/ProductList";
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation
} from "./graphql/mutations";

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async note => {
        if(note.image) {
          const url = await Storage.get(note.name);
          note.image = url;
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name
    };
    if (!!data.image) {
      await Storage.put(data.name, image);
    }
    await API.graphql({
      query: createNoteMutation,
      variables: { input: data }
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    await Storage.remove(name);
    await API.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } }
    });
  }
  
  return (
    <View margin="1rem">
      <Heading
        level={1}
        textAlign="center"
      >Ping Pong's Toy Factory</Heading>
      <Tabs justifyContent="space-around">
        <TabItem title="Products">
        <Products />
        </TabItem>
        <TabItem title="Orders">
          Orders
        </TabItem>
      </Tabs>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
