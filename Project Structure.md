my-app
├── Project Structure.md
├── app
│   ├── (auth)
│   │   ├── login
│   │   └── signup
│   ├── (public)
│   │   ├── [id]
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   ├── cart
│   │   ├── cloudinary
│   │   └── parts
│   ├── dashboard
│   │   ├── part
│   │   └── seller
│   └── globals.css
├── auth.ts
├── components
│   ├── Logo.tsx
│   ├── LogoLoader.tsx
│   ├── PublicPageClient.tsx
│   ├── actions
│   │   └── deletePartImage.ts
│   ├── auth
│   │   ├── isItemOwnedBySeller.ts
│   │   ├── signIn.tsx
│   │   └── signUp.tsx
│   ├── cart
│   │   └── CartDrawer.tsx
│   ├── categorys
│   │   └── section.tsx
│   ├── dashboard
│   │   ├── DashboardPageClient.tsx
│   │   ├── DashboardPageClient2.tsx
│   │   └── parts.tsx
│   ├── header.tsx
│   ├── homePage
│   │   ├── Hero.tsx
│   │   └── category.tsx
│   ├── itemDisplay
│   │   └── section.tsx
│   ├── partDetails
│   │   ├── imageSwap.tsx
│   │   ├── partDetails.tsx
│   │   └── section.tsx
│   ├── parts
│   │   └── partform.tsx
│   ├── shared
│   ├── ui
│   │   ├── SimpleCarousel.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── carousel.tsx
│   │   ├── clodinary_image.tsx
│   │   ├── input.tsx
│   │   └── select.tsx
│   └── whayChoseUs
│       ├── card.tsx
│       └── section.tsx
├── components.json
├── eslint.config.mjs
├── global.d.ts
├── hooks
│   ├── index.ts
│   ├── useDebouncedValue.ts
│   └── useFetchSuggestions.ts
├── lib
│   ├── auth.ts
│   ├── cloudinary.ts
│   ├── guestCart.ts
│   ├── guestCartMerge.ts
│   ├── prisma.ts
│   └── utils.ts
├── middleware.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── prisma
│   ├── ERD.svg
│   ├── migrations
│   │   ├── 20260227001107_init
│   │   ├── 20260302135034_init_store_models
│   │   ├── 20260303192857_add_stock_field
│   │   ├── 20260315221802_add_user_image
│   │   ├── 20260316204550_init_store_models
│   │   ├── 20260316231540_init_store_models
│   │   ├── 20260318203334_make_shipping_optional
│   │   ├── 20260318211538_make_shipping_optional
│   │   ├── 20260318221746_makk
│   │   ├── 20260408162235_add_category_to_parts
│   │   ├── 20260412113311_add_cart
│   │   ├── 20260701111518_part_number_edit
│   │   ├── 20260703210000_baseline
│   │   ├── 20260704090000_reconcile_parts_image_type
│   │   ├── 20260704103302_add_seller_image_safe
│   │   ├── 20260704113241_make_seller_image_optional
│   │   ├── 20260705114939_add_parts_colum
│   │   ├── 20260707202415_add_orphaned_asset
│   │   └── migration_lock.toml
│   ├── prisma.config.ts
│   └── schema.prisma
├── public
│   ├── Dodge.jpg
│   ├── acfef7d86efdb6bd04865832c2db1980.jpg
│   ├── best4.svg
│   ├── bestLoader4.svg
│   ├── end.webp
│   └── haha.webp
│   
├── tsconfig.json
└── types
