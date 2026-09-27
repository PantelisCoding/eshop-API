# TechStore — React E-Commerce Template


A clean, modern e-commerce frontend built with React 19, ready to deploy on Vercel.

**Live Demo:** https://eshop-frontend-fg0jb5kwx-pantelisdevs-projects.vercel.app/


---

## What's Included

- Landing page with hero, featured products carousel, category shortcuts, and footer
- Products page with search and filters (category, brand, price range)
- Shopping cart and wishlist drawers with quantity controls
- Orders history page
- Sign in and Register pages
- 404 Not Found page
- Fully mobile responsive

---

## Requirements

- [Node.js](https://nodejs.org/) (v18 or higher)
- A [Vercel](https://vercel.com) account (free) for deployment
- Basic knowledge of React to customize

---

## Setup

**1. Install dependencies**
```
npm install
```

**2. Run locally**
```
npm start
```

**3. Deploy to Vercel**

- Push the project to a GitHub repository
- Go to [vercel.com](https://vercel.com) and import the repository
- Vercel will detect it as a React app and deploy automatically

---

## How to Add Your Own Products

Open the file `api/products.js`. Near the top you will find a list called `FALLBACK` — this is where your products are defined.

Each product looks like this:

```js
{ 
  id: 1, 
  title: "Apple MacBook Pro 14-inch M3", 
  price: 1999, 
  image: "https://your-image-url.jpg", 
  category: "Laptops", 
  brand: "Apple", 
  description: "Your product description here" 
}
```

**To add your products:**

1. Delete all the existing items inside the `FALLBACK` array
2. Add your own products following the same format
3. Make sure each product has a unique `id` number
4. For `image`, use a direct URL to your product image (hosted on any image host)
5. Save the file and redeploy

**Available categories** (used in the filter bar):
- Laptops
- Smartphones
- Tablets
- Accessories
- Monitors
- Gaming

You can rename these in `src/Pages/Products.js` at the top of the file inside `CATEGORY_MAP`.

---

## How to Change the Store Name

Open `src/App.js` and search for **TechStore** — replace it with your store name. It appears in the navbar logo and the browser tab title (also update `public/index.html` for the tab title).

---

## How to Change the Brand Color

The main color is red (`#DC2626`). To change it, do a find-and-replace across all files:

- Find: `#DC2626`
- Replace with: your color (e.g. `#2563EB` for blue)

Most code editors (VS Code) support find-and-replace across all files with `Ctrl + Shift + H`.

---

## How to Change Contact Info in the Footer

Open `src/Pages/Landing.js` and search for:

- `47 Ermou Street` — replace with your address
- `+30 210 555 0147` — replace with your phone number
- `hello@techstore.gr` — replace with your email
- The Google Maps link — replace with a link to your address on Google Maps

---

## How to Change Social Media Links

In `src/Pages/Landing.js`, find the social media section in the footer. Replace the `href="#"` values with your actual social media profile URLs.

---

## Project Structure

```
eshop-API-frontend/
├── api/
│   └── products.js             # Product data and API handler — edit this to add your products
├── public/
│   └── index.html              # Browser tab title
├── src/
│   ├── App.js                  # Navbar, routing, store name
│   ├── Pages/
│   │   ├── Landing.js          # Home page
│   │   ├── Products.js         # Products page with filters
│   │   ├── CartDrawer.js       # Shopping cart
│   │   ├── FavoritesDrawer.js  # Wishlist
│   │   ├── Orders.js           # Order history
│   │   ├── SignIn.js           # Sign in page
│   │   └── Register.js         # Register page
└── vercel.json                 # Vercel configuration
```

---

## Support

If you have any questions after purchasing, feel free to reach out via Creative Market.
