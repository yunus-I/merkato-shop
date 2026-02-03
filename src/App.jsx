import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ShoppingCart, Home, Phone, Search, Star, Truck, X } from 'lucide-react';
import ProductCard from './components/ProductCard';
import CartItem from './components/CartItem';
import ModalCheckout from './components/ModalCheckout';
import Toast from './components/Toast';
import QuickView from './components/QuickView';

// --- INITIAL PRODUCT DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "Cotton Ankle Socks (Dozen)",
    nameAm: "የጥጥ ካልሲ (በደርዘን)",
    nameOm: "Kalsii Pamba (Darzana)",
    price: 360,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?auto=format&fit=crop&q=80&w=300",
    category: "socks",
    rating: 4.8,
    sold: 120
  },
  {
    id: 2,
    name: "Men's Boxer Briefs (Dozen)",
    nameAm: "የወንድ ቦክሰር (በደርዘን)",
    nameOm: "Boxer Dhiiraa (Darzana)",
    price: 1800,
    originalPrice: 2200,
    image: "https://i.postimg.cc/B605z7wK/image.png",
    category: "underwear",
    rating: 4.9,
    sold: 85
  },
  {
    id: 3,
    name: "Leather Belt (Dozen)",
    nameAm: "የቆዳ ቀበቶ (በደርዘን)",
    nameOm: "Qabatoo Gogaa (Darzana)",
    price: 3000,
    originalPrice: 3600,
    image: "https://i.postimg.cc/JnFrnSVB/image.png",
    category: "belts",
    rating: 4.5,
    sold: 40
  },
  {
    id: 4,
    name: "White Tank Top (Dozen)",
    nameAm: "ነጭ ካኒራ (በደርዘን)",
    nameOm: "Kanira Adii (Darzana)",
    price: 1200,
    originalPrice: 1500,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=300",
    category: "tanktop",
    rating: 4.7,
    sold: 200
  }
];

const TRANSLATIONS = {
  en: {
    home: "Home", cart: "Cart", profile: "Profile",
    search: "Search products...", deals: "Merkato Wholesale",
    freeDelivery: "Free Delivery to your shop",
    addToCart: "Add Dozen", minOrder: "Min. 1 Dozen",
    checkout: "Order Now", total: "Total",
    payNow: "Down Payment (10%)", payLater: "Pay on Delivery (90%)",
    orderSuccess: "Order Received!", phone: "Phone Number",
    name: "Shop Name", confirm: "Confirm Order", call: "Call Me"
  },
  am: {
    home: "መነሻ", cart: "ጋሪ", profile: "መገለጫ",
    search: "ምርቶችን ይፈልጉ...", deals: "የመርካቶ የጅምላ ሽያጭ",
    freeDelivery: "ወደ ሱቅዎ በነፃ እናደርሳለን",
    addToCart: "ደርዘን ጨምር", minOrder: "ቢያንስ 1 ደርዘን",
    checkout: "አሁን ይዘዙ", total: "ጠቅላላ",
    payNow: "ቅድመ ክፍያ (10%)", payLater: "ሲረከቡ የሚከፈል (90%)",
    orderSuccess: "ትዕዛዝዎ ተቀብለናል!", phone: "ስልክ ቁጥር",
    name: "የሱቅ ስም", confirm: "ትዕዛዙን አረጋግጥ", call: "ደውልልኝ"
  },
  om: {
    home: "Mana", cart: "Garii", profile: "Profaayilii",
    search: "Barbaadi...", deals: "Merkato Wholesale",
    freeDelivery: "Bilisaan suuqi keessanitti",
    addToCart: "Darzana dabali", minOrder: "Xiqqinnaan Darzana 1",
    checkout: "Amma Ajajaa", total: "Ida'ama",
    payNow: "Kaffaltii duraa (10%)", payLater: "Booda kaffalama (90%)",
    orderSuccess: "Ajajni keessan milkaa'era!", phone: "Lakk. Bilbilaa",
    name: "Maqaa Suuqii", confirm: "Mirkaneessi", call: "Nuuf bilbilaa"
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: '', phone: '' });
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);

  const modalFirstRef = useRef(null);
  const t = TRANSLATIONS[lang];

  // memoized categories (avoid recreating inside JSX)
  const categories = useMemo(() => Array.from(new Set(PRODUCTS.map(p => p.category))), []);

  // memoized filtered + sorted product list
  const filteredItems = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    let items = PRODUCTS.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (p.price < minPrice) return false;
      if (p.price > maxPrice) return false;
      if (p.rating < minRating) return false;
      if (!q) return true;
      const names = [p.name, p.nameAm, p.nameOm].join(' ').toLowerCase();
      return names.includes(q);
    });

    items = items.sort((a,b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'sold') return b.sold - a.sold;
      return a.id - b.id;
    });

    return items;
  }, [debouncedSearch, category, sortBy]);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(id);
  }, []);

  // debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(id);
    }
  }, [toast]);

  useEffect(() => {
    if (showModal && modalFirstRef.current) modalFirstRef.current.focus();
  }, [showModal]);

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i);
      return [...prev, {...p, qty: 1}];
    });
    setToast(`${p.name} added`);
  };
  
  // support quantity when adding (used by quick view)
  const addToCartWithQty = (p, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? {...i, qty: i.qty + qty} : i);
      return [...prev, {...p, qty}];
    });
    setToast(`${p.name} added`);
  };

  const [quickProduct, setQuickProduct] = useState(null);

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const changeQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, qty: Math.max(0, i.qty + delta)} : i).filter(i => i.qty > 0));
  };

  const totalAmount = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  const confirmOrder = () => {
    if (!userInfo.name || !userInfo.phone) { setToast('Please add name & phone'); return; }
    setShowModal(false);
    setCart([]);
    setToast(t.orderSuccess);
    setPage('home');
  };

  return (
    <div className="app-container max-w-md mx-auto min-h-screen relative font-sans">
      <header className="app-topbar">
        <div className="flex items-center gap-3 w-full">
          <div className="flex items-center gap-3">
            <Truck size={22} />
            <div className="app-title">MERKATO</div>
          </div>

          <div className="ml-4 flex items-center gap-2">
            <button onClick={() => setPage('home')} className={`top-nav-btn ${page === 'home' ? 'active' : ''}`} aria-label="Home">
              <Home size={18} />
              <span className="text-[12px]">{t.home}</span>
            </button>

            <button onClick={() => setPage('cart')} className={`top-nav-btn relative ${page === 'cart' ? 'active' : ''}`} aria-label="Cart">
              <ShoppingCart size={18} />
              {cart.length > 0 && <span className="top-badge">{cart.length}</span>}
              <span className="text-[12px]">{t.cart}</span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="lang" className="sr-only">Language</label>
            <select id="lang" value={lang} onChange={e => setLang(e.target.value)} className="input text-sm">
              <option value="en">EN</option>
              <option value="am">AM</option>
              <option value="om">OM</option>
            </select>
          </div>
        </div>
      </header>

      <div className="app-content">
        <div className="mb-4 card">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-bold">{t.deals}</div>
              <div className="text-sm text-muted text-[13px]">{t.freeDelivery}</div>
            </div>
            <div className="badge">Wholesale</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="search">
            <Search size={18} className="text-muted" />
            <input aria-label={t.search} placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} className="input flex-1" />
            {search ? (
              <button onClick={() => setSearch('')} className="btn btn-ghost" aria-label="clear search">✕</button>
            ) : (
              <button className="btn btn-ghost" aria-label="filters"><Star size={16} /></button>
            )}
          </div>

            <div className="mt-3">
              <div className="filter-scroll">
                <button onClick={() => setCategory('all')} className={`filter-chip ${category === 'all' ? 'active' : ''}`} aria-pressed={category === 'all'}>
                  <span className="emoji">🏷️</span>
                  <span>All</span>
                </button>
                {categories.map(cat => {
                  const emoji = cat.includes('sock') ? '🧦' : cat.includes('shirt') || cat.includes('tank') ? '👕' : cat.includes('belt') ? '🧵' : cat.includes('underwear') ? '🩲' : '📦';
                  return (
                    <button key={cat} onClick={() => setCategory(cat)} className={`filter-chip ${category === cat ? 'active' : ''}`} aria-pressed={category === cat}>
                      <span className="emoji">{emoji}</span>
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3">
                <div className="filter-advanced card">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-sm font-bold">Price range</div>
                      <div className="mt-2 flex items-center gap-2">
                        <input type="number" min="0" value={minPrice} onChange={e => setMinPrice(Number(e.target.value || 0))} className="input w-28" />
                        <span className="text-muted">to</span>
                        <input type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value || 0))} className="input w-28" />
                        <button onClick={() => { setMinPrice(0); setMaxPrice(100000); }} className="btn btn-ghost">Reset</button>
                      </div>
                    </div>

                    <div className="w-40">
                      <div className="text-sm font-bold">Min rating</div>
                      <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="input w-full mt-2">
                        <option value={0}>Any</option>
                        <option value={4}>4+</option>
                        <option value={4.5}>4.5+</option>
                        <option value={4.8}>4.8+</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="ml-auto flex items-center gap-2">
                    <label className="text-sm text-muted">Sort</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="input text-sm">
                      <option value="featured">Featured</option>
                      <option value="price-asc">Price ↑</option>
                      <option value="price-desc">Price ↓</option>
                      <option value="rating">Rating</option>
                      <option value="sold">Popularity</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {loading ? (
          <div className="product-grid">
            {Array.from({length:6}).map((_,i) => (
              <div key={i} className="card skeleton" style={{height: 220}} />
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {filteredItems.map(p => (
              <ProductCard key={p.id} product={p} lang={lang} onAdd={addToCartWithQty} onQuickView={(prod) => setQuickProduct(prod)} />
            ))}
          </div>
        )}
      </div>

      <div className="app-bottom fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-glass backdrop-blur-sm border-t py-3 px-4 flex justify-between items-center z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setPage('home')} className={`flex flex-col items-center ${page === 'home' ? 'text-primary' : 'text-muted'}`} aria-label="Home">
            <Home size={20} />
            <span className="text-[10px] mt-1">{t.home}</span>
          </button>
          <button onClick={() => setPage('cart')} className={`flex flex-col items-center relative ${page === 'cart' ? 'text-primary' : 'text-muted'}`} aria-label="Cart">
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className="absolute -top-1 -right-3 bg-accent text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">{cart.length}</span>}
            <span className="text-[10px] mt-1">{t.cart}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a href="tel:+251900000000" className="btn btn-ghost" aria-label="Call merchant"><Phone size={18} /></a>
          <div className="text-right">
            <div className="text-sm font-bold">{totalAmount} Br</div>
            <div className="text-[11px] text-muted">{t.minOrder}</div>
          </div>
          <div className="sticky-cart-note ml-2 mr-2">
            <span className="note-emoji">🧺</span>
            <span>Minimum order: 1 dozen per item</span>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">{t.checkout}</button>
        </div>
      </div>

      {page === 'cart' && (
        <div className="app-content">
          <h2 className="font-bold text-lg mb-3">{t.cart}</h2>
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="text-lg font-bold">No items yet</div>
              <div className="text-sm text-muted">Add a dozen to start your order</div>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <CartItem key={item.id} item={item} onInc={(id)=>changeQty(id,1)} onDec={(id)=>changeQty(id,-1)} onRemove={removeFromCart} />
              ))}

              <div className="card">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-muted">{t.total}</div>
                    <div className="font-bold text-lg">{totalAmount} Br</div>
                  </div>
                  <button onClick={() => setShowModal(true)} className="btn btn-primary">{t.checkout}</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <ModalCheckout visible={showModal} onClose={() => setShowModal(false)} userInfo={userInfo} setUserInfo={setUserInfo} onConfirm={confirmOrder} labels={t} />
      <QuickView product={quickProduct} visible={!!quickProduct} onClose={() => setQuickProduct(null)} onAdd={(p, qty) => addToCartWithQty(p, qty)} lang={lang} />
      <Toast message={toast} />
    </div>
  );
}