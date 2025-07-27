import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content Manager')
    .items([
      // ✅ Blog Section
      S.listItem()
        .title('Blog')
        .id('blogSection')   // <-- unique ID added
        .child(
          S.list()
            .title('Blog Content')
            .items([
              S.documentTypeListItem('post').title('Posts'),
              S.documentTypeListItem('blogcategory').title('Blog Categories'),
              S.documentTypeListItem('author').title('Authors'),
            ])
        ),

      S.divider(),

      // ✅ Ecommerce Section
      S.listItem()
        .title('Ecommerce')
        .id('ecommerceSection')   // <-- unique ID added
        .child(
          S.list()
            .title('Store Management')
            .items([
              S.documentTypeListItem('product').title('Products'),
              S.documentTypeListItem('order').title('Orders'),
            ])
        ),

      S.divider(),

      // ✅ Addresses Section
      S.listItem()
        .title('User Data')
        .id('userDataSection')   // <-- unique ID added
        .child(
          S.list()
            .title('User Information')
            .items([
              S.documentTypeListItem('address').title('Addresses'),
            ])
        ),

      S.divider(),

      // ✅ Auto include baaki document types
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            'post',
            'blogcategory',
            'author',
            'product',
            'order',
            'address'
          ].includes(item.getId()!)
      ),
    ])
