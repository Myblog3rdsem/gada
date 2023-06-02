import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
  Address,
  CartPage,
  Checkout,
  ErrorPage,
  Home,
  LoginPage,
  Order,
  ProductListingPage,
  Profile,
  SharedLayout,
  SharedProfileLayout,
  SignupPage,
  SingleProductPage,
  WishListPage,
} from './frontend/pages';

import Mockman from 'mockman-js';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { PrivateRoute } from './frontend/components';

const App = () => {
  return (
    <BrowserRouter>
      <main>
        <ToastContainer
          position='top-left'
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='dark'
        />

        <Routes>
          <Route path='*' element={<ErrorPage />} />

          <Route path='/' element={<SharedLayout />}>
            <Route index element={<Home />} />

            <Route path='products' element={<ProductListingPage />} />

            <Route path='products/:productId' element={<SingleProductPage />} />

            <Route path='products' element={<ProductListingPage />} />

            <Route
              path='cart'
              element={
                <PrivateRoute>
                  <CartPage />
                </PrivateRoute>
              }
            />

            <Route
              path='wishlist'
              element={
                <PrivateRoute>
                  <WishListPage />
                </PrivateRoute>
              }
            />

            <Route
              path='checkout'
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />

            <Route
              path='profile'
              element={
                <PrivateRoute>
                  <SharedProfileLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Profile />} />
              <Route path='address' element={<Address />} />
              <Route path='order' element={<Order />} />
            </Route>
          </Route>

          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/mockman' element={<Mockman />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
