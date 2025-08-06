import { sanityFetch } from "../lib/live";
import {
  BLOG_CATEGORIES,
  BRAND_QUERY,
  BRANDS_QUERY,
  DEAL_PRODUCTS,
  GET_ALL_BLOG,
  LATEST_BLOG_QUERY,
  MY_ORDERS_QUERY,
  OTHERS_BLOG_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SINGLE_BLOG_QUERY,
} from "./query";

// ✅ Categories fetch
const getCategories = async (quantity?: number) => {
  try {
    const query = quantity
      ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`
      : `*[_type == 'category'] | order(name asc) {
          ...,
          "productCount": count(*[_type == "product" && references(^._id)])
        }`;

    const { data } = await sanityFetch({
      query,
      params: quantity ? { quantity } : {},
      next: { revalidate: 5 },   // ✅ cache har 10s me refresh hoga
    });
    return data;
  } catch (error) {
    console.log("❌ Error fetching categories", error);
    return [];
  }
};

// ✅ All Brands
const getAllBrands = async () => {
  try {
    const { data } = await sanityFetch({ 
      query: BRANDS_QUERY,
      next: { revalidate: 10 },
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching all brands:", error);
    return [];
  }
};

// ✅ Latest Blogs
const getLatestBlogs = async () => {
  try {
    const { data } = await sanityFetch({ 
      query: LATEST_BLOG_QUERY,
      next: { revalidate: 10 },
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching latest Blogs:", error);
    return [];
  }
};

// ✅ Deal Products (hot status)
const getDealProducts = async () => {
  try {
    const { data } = await sanityFetch({ 
      query: DEAL_PRODUCTS,
      next: { revalidate: 10 },  // ✅ yahan se bhi fresh products aayenge
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching deal Products:", error);
    return [];
  }
};

// ✅ Product by Slug
const getProductBySlug = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY,
      params: { slug },
      next: { revalidate: 10 },
    });
    return product?.data || null;
  } catch (error) {
    console.error("❌ Error fetching product by slug:", error);
    return null;
  }
};

// ✅ Brand by Slug
const getBrand = async (slug: string) => {
  try {
    const product = await sanityFetch({
      query: BRAND_QUERY,
      params: { slug },
      next: { revalidate: 10 },
    });
    return product?.data || null;
  } catch (error) {
    console.error("❌ Error fetching brand by slug:", error);
    return null;
  }
};

// ✅ My Orders
const getMyOrders = async (userId: string) => {
  try {
    const orders = await sanityFetch({
      query: MY_ORDERS_QUERY,
      params: { userId },
      next: { revalidate: 0 },   // ✅ Always fetch fresh orders
    });
    return orders?.data || null;
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    return null;
  }
};

// ✅ All Blogs
const getAllBlogs = async (quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: GET_ALL_BLOG,
      params: { quantity },
      next: { revalidate: 20 },
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching all blogs:", error);
    return [];
  }
};

// ✅ Single Blog
const getSingleBlog = async (slug: string) => {
  try {
    const { data } = await sanityFetch({
      query: SINGLE_BLOG_QUERY,
      params: { slug },
      next: { revalidate: 20 },
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching single blog:", error);
    return [];
  }
};

// ✅ Blog Categories
const getBlogCategories = async () => {
  try {
    const { data } = await sanityFetch({
      query: BLOG_CATEGORIES,
      next: { revalidate: 20 },
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching blog categories:", error);
    return [];
  }
};

// ✅ Others Blog
const getOthersBlog = async (slug: string, quantity: number) => {
  try {
    const { data } = await sanityFetch({
      query: OTHERS_BLOG_QUERY,
      params: { slug, quantity },
      next: { revalidate: 20 },
    });
    return data ?? [];
  } catch (error) {
    console.log("❌ Error fetching other blogs:", error);
    return [];
  }
};

export {
  getCategories,
  getAllBrands,
  getLatestBlogs,
  getDealProducts,
  getProductBySlug,
  getBrand,
  getMyOrders,
  getAllBlogs,
  getSingleBlog,
  getBlogCategories,
  getOthersBlog,
};
