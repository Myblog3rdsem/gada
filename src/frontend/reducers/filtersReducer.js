import { SortType } from '../constants/constants';
import { FILTERS_ACTION } from '../utils/actions';
import {
  convertArrayToObjectWithPropertyFALSE,
  lowerizeAndCheckIncludes,
} from '../utils/utils';

export const initialFiltersState = {
  allProducts: [],
  filteredProducts: [],
  minPrice: 0,
  maxPrice: Infinity, // will be handled
  filters: {
    search: '',
    category: null,
    company: 'all',
    price: 0,
    rating: -1,
    sortByOption: '',
  },
};

/* 
  category: {
    laptop: false,
    tv: false,
    earphone: false,
    smartwatch: false,
    mobile: false
  }
*/

export const filtersReducer = (state, action) => {
  switch (action.type) {
    case FILTERS_ACTION.GET_PRODUCTS_FROM_PRODUCT_CONTEXT:
      const allProductsCloned = structuredClone(action.payload?.products);

      const allPrices = allProductsCloned.map(({ price }) => price);

      const allCategoryNames = action.payload?.categories.map(
        ({ categoryName }) => categoryName
      );

      let minPrice = 0,
        maxPrice = 0;

      if (allProductsCloned.length > 1) {
        maxPrice = Math.max(...allPrices);
        minPrice = Math.min(...allPrices);
      }

      return {
        ...state,
        allProducts: allProductsCloned,
        filteredProducts: allProductsCloned,
        minPrice,
        maxPrice,
        filters: {
          ...state.filters,
          category: convertArrayToObjectWithPropertyFALSE(allCategoryNames),
          price: maxPrice,
        },
      };

    case FILTERS_ACTION.UPDATE_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          category: {
            ...state.filters.category,
            [action.payloadCategory]:
              !state.filters.category[action.payloadCategory],
          },
        },
      };

    case FILTERS_ACTION.UPDATE_SEARCH_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          search: action.payloadSearch,
        },
      };

    // called onchange of filters
    case FILTERS_ACTION.UPDATE_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.payloadName]: action.payload.payloadValue,
        },
      };

    case FILTERS_ACTION.CHECK_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          category: {
            ...state.category,
            [action.payloadCategory]: true,
          },
        },
      };

    case FILTERS_ACTION.CLEAR_FILTERS:
      const { category } = state.filters;
      const allUncheckedCategoryObj = convertArrayToObjectWithPropertyFALSE(
        Object.keys(category)
      );
      return {
        ...state,
        filters: {
          ...state.filters,
          search: '',
          category: allUncheckedCategoryObj,
          company: 'all',
          price: state.maxPrice,
          rating: -1,
          sortByOption: '',
        },
      };

    case FILTERS_ACTION.APPLY_FILTERS:
      const { allProducts, filters } = state;

      const {
        search: searchText,
        category: categoryObjInState,
        company: companyInState,
        price: priceInState,
        rating: ratingInState,
        sortByOption,
      } = filters;

      const isAnyCheckboxChecked = Object.values(categoryObjInState).some(
        (categoryBool) => categoryBool
      );

      // this temp products will become filteredProducts
      let tempProducts = allProducts;

      // search handled here
      // company is not filtered here after submitting!!
      tempProducts = allProducts.filter(({ name }) => {
        const trimmedSearchText = searchText.trim();
        return lowerizeAndCheckIncludes(name, trimmedSearchText);
      });

      // category checkbox handled here
      if (isAnyCheckboxChecked) {
        tempProducts = tempProducts.filter(
          ({ category: categoryPropertyOfProduct }) =>
            categoryObjInState[categoryPropertyOfProduct]
        );
      }

      // company dropdown handled here
      if (companyInState !== 'all') {
        tempProducts = tempProducts.filter(
          ({ company: companyPropertyOfProduct }) =>
            companyPropertyOfProduct === companyInState
        );
      }

      // price handled here, no (if) condition, this will run always!!
      tempProducts = tempProducts.filter(
        ({ price: pricePropertyOfProduct }) =>
          pricePropertyOfProduct <= priceInState
      );

      // ratings handled here, no (if) condition, this will run always!!
      tempProducts = tempProducts.filter(({ stars }) => stars >= ratingInState);

      // sort handled here!!, if sortByOption is '', ignore sorting
      if (!!sortByOption) {
        switch (sortByOption) {
          case SortType.PRICE_LOW_TO_HIGH: {
            tempProducts = [...tempProducts].sort((a, b) => a.price - b.price);
            break;
          }

          case SortType.PRICE_HIGH_TO_LOW: {
            tempProducts = [...tempProducts].sort((a, b) => b.price - a.price);
            break;
          }

          case SortType.NAME_A_TO_Z: {
            tempProducts = [...tempProducts].sort((a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();

              if (a > b) return 1;

              if (a < b) return -1;

              return 0;
            });
            break;
          }

          case SortType.NAME_Z_TO_A: {
            tempProducts = [...tempProducts].sort((a, b) => {
              a = a.name.toLowerCase();
              b = b.name.toLowerCase();

              if (a > b) return -1;
              if (a < b) return 1;
              return 0;
            });

            break;
          }

          default:
            throw new Error(`${sortByOption} is not defined`);
        }
      }

      // console.log({ tempProducts });
      return {
        ...state,
        filteredProducts: tempProducts,
      };
    default:
      throw new Error(`Error: ${action.type} in filtersReducer does not exist`);
  }
};
