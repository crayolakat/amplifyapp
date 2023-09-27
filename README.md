# Product Management System

## Dev Environment
- Node version manager: [nvm](https://github.com/nvm-sh/nvm)

### Setup
1. Use the Node version specified in `.nvmrc`: `nvm use`
2. Install dependencies: `npm install`
3. Run locally: `npm start`

## Deployment
This app is deployed via AWS Amplify. Pushing to the `main` branch will deploy changes to https://main.d1uwevcnuib9bt.amplifyapp.com/. To test the site, either create a new account and log in, or use these test credentials that I created:
- Username: `testusername`
- Password: `testpassword`

## Back-End
- Able to create/update products with price and stock quantity.
- Able to create order with product and quantity. Stock quanity of product is deducted by order quantity.
- Able to update order with shipping information.
- Able to update order with status from a drop-down component.
- Scalability:
  - Using NoSQL database (GraphQL) for faster querying and horizontal scaling. Inspired by Shopify's use of GraphQL.
- Limitations:
  - Time. Could spend more time on data modeling and optimizations given more time.

## Front-End
- Hosted via AWS Amplify and publicly accessible at https://main.d1uwevcnuib9bt.amplifyapp.com/
- Styling libraries:
  - [@aws-amplify/ui-react](https://ui.docs.amplify.aws/)
  - [react-modal](https://www.npmjs.com/package/react-modal)
- Dynamic styled components:
  - Drop-downs for order status.
  - Tab menu to toggle between products and orders.
- Website speed:
  - Intended to add pagination and sorting/filtering, but ran out of time to do that. Added as TODO's. This would contribute towards good website speed.
- Decisions:
  - Hosted on AWS Amplify to be able to easily share this project publicly and get access to AWS suite of tools.
  - Caching: Not implemented due to time contraints. Want to implement Redis given more time.
  - Language and Frameworks: JavaScript, React, Node.js
  - Styling: Used styling libraries mentioned above for a quick build time and responsive website.
