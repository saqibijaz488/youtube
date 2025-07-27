import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'
import { productType } from './productType'
import { orderType } from './orderType'
import { addressType } from './addressType'
import { blogType } from './blogType'
import { blogCategoryType } from './blogCategoryType'
import { brandType } from './brandType'



export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    productType,
    orderType,
    addressType,
    blogType,
    brandType,
    blogCategoryType,
  ],
}
