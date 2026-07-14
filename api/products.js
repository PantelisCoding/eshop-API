const TECH_SLUGS = ['laptops', 'smartphones', 'tablets', 'mobile-accessories'];

const FALLBACK = [
  { id: 1, title: "Apple MacBook Pro 14-inch M3", price: 1999, image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg", category: "Laptops", brand: "Apple", description: "Apple M3 chip, 16GB RAM, 512GB SSD | ⭐ 4.9" },
  { id: 2, title: "Dell XPS 15", price: 1299, image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg", category: "Laptops", brand: "Dell", description: "Intel Core i7, 16GB RAM, 4K OLED | ⭐ 4.7" },
  { id: 3, title: "ASUS ROG Zephyrus G14", price: 1499, image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg", category: "Laptops", brand: "ASUS", description: "AMD Ryzen 9, RTX 4060, 16GB RAM | ⭐ 4.8" },
  { id: 4, title: "Lenovo ThinkPad X1 Carbon", price: 1149, image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg", category: "Laptops", brand: "Lenovo", description: "Intel Core i5, 8GB RAM, ultralight | ⭐ 4.6" },
  { id: 5, title: "HP Spectre x360", price: 1350, image: "https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg", category: "Laptops", brand: "HP", description: "2-in-1 convertible, 13.5-inch OLED | ⭐ 4.5" },
  { id: 6, title: "Microsoft Surface Laptop 5", price: 999, image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg", category: "Laptops", brand: "Microsoft", description: "Intel Core i5, 8GB RAM, 512GB SSD | ⭐ 4.4" },
  { id: 7, title: "Apple iPhone 15 Pro Max", price: 1199, image: "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg", category: "Smartphones", brand: "Apple", description: "A17 Pro chip, 48MP camera, titanium | ⭐ 4.9" },
  { id: 8, title: "Samsung Galaxy S24 Ultra", price: 1099, image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg", category: "Smartphones", brand: "Samsung", description: "Snapdragon 8 Gen 3, 200MP, S Pen | ⭐ 4.8" },
  { id: 9, title: "Google Pixel 8 Pro", price: 799, image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_FMwebp_QL65_.jpg", category: "Smartphones", brand: "Google", description: "Tensor G3, 50MP camera, 7yr updates | ⭐ 4.7" },
  { id: 10, title: "OnePlus 12 5G", price: 699, image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg", category: "Smartphones", brand: "OnePlus", description: "Snapdragon 8 Gen 3, 100W charging | ⭐ 4.6" },
  { id: 11, title: "Samsung Galaxy A54", price: 449, image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg", category: "Smartphones", brand: "Samsung", description: "50MP camera, Super AMOLED, 5000mAh | ⭐ 4.4" },
  { id: 12, title: "Xiaomi 14 Ultra", price: 899, image: "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg", category: "Smartphones", brand: "Xiaomi", description: "Leica optics, Snapdragon 8 Gen 3 | ⭐ 4.7" },
  { id: 13, title: "Apple iPad Pro 12.9-inch M4", price: 1099, image: "https://fakestoreapi.com/img/81fAn1SQ5pL._AC_SL1500_.jpg", category: "Tablets", brand: "Apple", description: "M4 chip, Ultra Retina XDR, 256GB | ⭐ 4.9" },
  { id: 14, title: "Samsung Galaxy Tab S9 Ultra", price: 849, image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg", category: "Tablets", brand: "Samsung", description: "14.6-inch AMOLED, S Pen, 256GB | ⭐ 4.7" },
  { id: 15, title: "Microsoft Surface Pro 9", price: 999, image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg", category: "Tablets", brand: "Microsoft", description: "Intel Core i5, 8GB RAM, 128GB SSD | ⭐ 4.5" },
  { id: 16, title: "Sony WH-1000XM5", price: 349, image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg", category: "Accessories", brand: "Sony", description: "Best noise cancellation, 30hr battery | ⭐ 4.9" },
  { id: 17, title: "Apple AirPods Pro 2nd Gen", price: 249, image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg", category: "Accessories", brand: "Apple", description: "ANC, Adaptive Transparency, MagSafe | ⭐ 4.8" },
  { id: 18, title: "Logitech MX Master 3S", price: 99, image: "https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg", category: "Accessories", brand: "Logitech", description: "8000 DPI, MagSpeed scroll, Bluetooth | ⭐ 4.7" },
  { id: 19, title: "Keychron K2 Mechanical Keyboard", price: 89, image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg", category: "Accessories", brand: "Keychron", description: "Wireless, hot-swappable, RGB | ⭐ 4.6" },
  { id: 20, title: "Samsung T7 Shield SSD 2TB", price: 149, image: "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_FMwebp_QL65_.jpg", category: "Accessories", brand: "Samsung", description: "USB 3.2, 1050MB/s, IP65 rugged | ⭐ 4.8" },
  { id: 21, title: "LG 27-inch 4K Monitor", price: 449, image: "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg", category: "Monitors", brand: "LG", description: "IPS, 60Hz, USB-C 90W, HDR400 | ⭐ 4.7" },
  { id: 22, title: "Samsung Odyssey G7 32-inch", price: 649, image: "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg", category: "Monitors", brand: "Samsung", description: "QHD 240Hz, 1ms, G-Sync, curved | ⭐ 4.8" },
  { id: 23, title: "Dell U2722D 27-inch", price: 579, image: "https://fakestoreapi.com/img/71kEqp3aZaL._AC_SX679_.jpg", category: "Monitors", brand: "Dell", description: "4K IPS, USB-C 90W, factory calibrated | ⭐ 4.6" },
  { id: 24, title: "PlayStation 5", price: 499, image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg", category: "Gaming", brand: "Sony", description: "4K gaming, 120fps, DualSense haptics | ⭐ 4.9" },
  { id: 25, title: "Xbox Series X", price: 499, image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg", category: "Gaming", brand: "Microsoft", description: "4K 120fps, 1TB SSD, Game Pass | ⭐ 4.8" },
  { id: 26, title: "Nintendo Switch OLED", price: 349, image: "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg", category: "Gaming", brand: "Nintendo", description: "7-inch OLED, 64GB, dock included | ⭐ 4.7" },
  { id: 27, title: "Razer BlackShark V2 Pro", price: 179, image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_FMwebp_QL65_.jpg", category: "Gaming", brand: "Razer", description: "Wireless headset, 70hr battery, THX | ⭐ 4.6" },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { category } = req.query;

  try {
    let products = [];

    if (category && category !== 'all') {
      const r = await fetch(`https://dummyjson.com/products/category/${category}?limit=100`);
      const data = await r.json();
      products = data.products || [];
    } else {
      const results = await Promise.allSettled(
        TECH_SLUGS.map(s =>
          fetch(`https://dummyjson.com/products/category/${s}?limit=100`)
            .then(r => r.json())
            .then(d => d.products || [])
        )
      );
      products = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
    }

    if (products.length > 0) {
      const mapped = products.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.thumbnail,
        brand: p.brand || null,
        category: p.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: `${p.description} | ⭐ ${p.rating}`,
      }));
      return res.status(200).json({ products: mapped, source: 'dummyjson' });
    }
  } catch (_) {}

  const cat = category && category !== 'all' ? category : null;
  const filtered = cat
    ? FALLBACK.filter(p => p.category.toLowerCase() === cat.toLowerCase())
    : FALLBACK;

  return res.status(200).json({ products: filtered, source: 'fallback' });
}
