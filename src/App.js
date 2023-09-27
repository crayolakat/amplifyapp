import '@aws-amplify/ui-react/styles.css';
import {
  Button,
  Heading,
  Tabs,
  TabItem,
  View,
  withAuthenticator
} from '@aws-amplify/ui-react';
import Orders from "./Components/Orders";
import Products from "./Components/Products";

const App = ({ signOut }) => {
  return (
    <View margin="1rem">
      <Heading
        level={1}
        textAlign="center"
      >Ping Pong's Toy Factory</Heading>
      <Tabs justifyContent="space-around">
        <TabItem id="products-tab" title="Products">
        <Products />
        </TabItem>
        <TabItem id="orders-tab" title="Orders">
          <Orders />
        </TabItem>
      </Tabs>
      <Button onClick={signOut}>Sign Out</Button>
    </View>
  );
}

export default withAuthenticator(App);
