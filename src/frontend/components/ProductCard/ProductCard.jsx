/* eslint-disable react/prop-types */
import { AiFillHeart, AiFillStar, AiOutlineHeart } from 'react-icons/ai';
import styles from './ProductCard.module.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Price from '../Price';
import {
  LOGIN_TOAST,
  calculateDiscountPercent,
  isPresent,
} from '../../utils/utils';
import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import { useAuthContext } from '../../contexts/AuthContextProvider';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthContext();
  const {
    wishlist: wishlistFromContext,
    cart: cartFromContext,
    addToCartDispatch,
    moveToCartDispatch,
    addToWishlistDispatch,
    removeFromWishlistDispatch,
  } = useAllProductsContext();

  const [isCartBtnDisable, setIsCartBtnDisable] = useState(false);
  const [isWishlistBtnDisable, setIsWishlistBtnDisable] = useState(false);

  const isProductInCart = isPresent(product._id, cartFromContext);

  const isProductInWishlist = isPresent(product._id, wishlistFromContext);

  const isCardInWishlistPage = location.pathname === '/wishlist';

  let productBtnText = '';

  // If card is in wishlist page & product is in cartContext show- "already in cart" else show 'move to cart'
  if (isCardInWishlistPage && isProductInCart) {
    productBtnText = 'already in Cart';
  }
  if (isCardInWishlistPage && !isProductInCart) {
    productBtnText = 'move to cart';
  }
  // In productListing page, if this product is in cart- "go to cart" else show 'add to cart'
  if (!isCardInWishlistPage && isProductInCart) {
    productBtnText = 'go to cart';
  }
  if (!isCardInWishlistPage && !isProductInCart) {
    productBtnText = 'add to cart';
  }

  const discountPercent = calculateDiscountPercent(
    product.price,
    product.originalPrice
  );

  // functions

  // this is accepting dispatch functions on conditonal basis depending on the page
  const handleCartBtnClick = async (dispatchFunction) => {
    // for wishlist page, there will be a user always

    if (!user) {
      LOGIN_TOAST();
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    if (isProductInCart) {
      navigate('/cart');
      return;
    }

    setIsCartBtnDisable(true);
    await dispatchFunction(product);
    setIsCartBtnDisable(false);
  };

  const handleWishlistBtnClick = async () => {
    if (!user) {
      LOGIN_TOAST();
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    setIsWishlistBtnDisable(true);

    if (isProductInWishlist) {
      // delete from wishlist
      await removeFromWishlistDispatch(product._id);
      setIsWishlistBtnDisable(false);
      return;
    }

    await addToWishlistDispatch(product);
    setIsWishlistBtnDisable(false);
  };

  return (
    <article
      className={
        product.inStock
          ? styles.productStyle
          : `${styles.productStyle} ${styles.disabledProduct}`
      }
    >
      <div className={styles.imgContainer}>
        <Link to={`/products/${product._id}`}>
          <img src={product.image} alt={product.name} />
        </Link>
      </div>

      <button
        onClick={handleWishlistBtnClick}
        disabled={isWishlistBtnDisable}
        className={
          isProductInWishlist
            ? `${styles.heartContainer} ${styles.coloredHeart}`
            : styles.heartContainer
        }
      >
        {isProductInWishlist ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>

      <div className={styles.cardInfo}>
        <header className={styles.cardHeader}>
          <p>{product.name}</p>
          <span className={styles.rating}>
            {product.stars} <AiFillStar />
          </span>
        </header>

        <main className={styles.cardMain}>
          <Price amount={product.price} />
          {discountPercent > 0 && (
            <>
              <Price amount={product.originalPrice} />
              <span className={styles.discount}> ({discountPercent}% off)</span>
            </>
          )}
        </main>

        <div className={styles.colorsContainer}>
          {product.colors.map((color, index) => (
            <span key={index} style={{ background: color }}></span>
          ))}
          {/* {console.log({ colors: product.colors })} */}
        </div>

        <footer className={styles.footer}>
          <button
            disabled={isCartBtnDisable}
            className={
              isProductInCart
                ? `btn ${styles.cardBtn} ${styles.goToCartBtn}`
                : `btn ${styles.cardBtn}`
            }
            onClick={() =>
              handleCartBtnClick(
                isCardInWishlistPage ? moveToCartDispatch : addToCartDispatch
              )
            }
          >
            {productBtnText}
          </button>
        </footer>
      </div>
    </article>
  );
};

export default ProductCard;
