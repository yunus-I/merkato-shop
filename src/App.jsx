import React, { useState } from 'react';
import { 
  ShoppingCart, Home, User, Phone, Search, Star, 
  Truck, X, Plus, Minus, Check
} from 'lucide-react';

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
    image: "https://images.unsplash.com/photo-1598236140643-22841dc3188d?auto=format&fit=crop&q=80&w=300",
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
    image: "https://images.unsplash.com/photo-1624222244025-c5c4013587b1?auto=format&fit=crop&q=80&w=300",
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

  const t = TRANSLATIONS[lang];

  const addToCart = (p) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? {...i, qty: i.qty + 1} : i);
      return [...prev, {...p, qty: 1}];
    });
  };

  const totalAmount = cart.reduce((s, i) => s + (i.price * i.qty), 0);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen pb-20 shadow-xl relative font-sans">
      {/* Header */}
      <div className="bg-red-600 p-4 text-white sticky top-0 z-50">
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-bold text-xl flex items-center gap-2"><Truck /> MERKATO</h1>
          <div className="flex gap-2 text-[10px]">
            {['en', 'am', 'om'].map(l => (
              <button key={l} onClick={() => setLang(l)} className={`px-2 py-1 rounded uppercase ${lang === l ? 'bg-white text-red-600' : 'bg-red-500'}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input type="text" placeholder={t.search} className="w-full rounded-full py-2 pl-10 pr-4 text-black text-sm outline-none" />
        </div>
      </div>

      {/* Main Content */}
      {page === 'home' ? (
        <div className="p-3">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white mb-4 shadow-lg">
            <h2 className="font-bold text-lg">{t.deals} 🔥</h2>
            <p className="text-xs opacity-90">{t.freeDelivery}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map(p => (
              <div key={p.id} className="bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col">
                <img src={p.image} className="h-32 w-full object-cover" alt="" />
                <div className="p-2 flex-grow flex flex-col">
                  <h3 className="text-xs font-bold line-clamp-2 h-8">
                    {lang === 'en' ? p.name : lang === 'am' ? p.nameAm : p.nameOm}
                  </h3>
                  <div className="mt-2 text-red-600 font-bold">{p.price} Br</div>
                  <div className="text-[10px] text-gray-400 line-through">{p.originalPrice} Br</div>
                  <button onClick={() => addToCart(p)} className="mt-2 w-full bg-red-600 text-white text-[10px] font-bold py-2 rounded-lg active:scale-95 transition">
                    + {t.addToCart}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">{t.cart}</h2>
          {cart.map(item => (
            <div key={item.id} className="flex gap-3 bg-gray-50 p-2 rounded-lg mb-2 items-center">
              <img src={item.image} className="w-16 h-16 rounded object-cover" alt="" />
              <div className="flex-grow">
                <div className="text-xs font-bold">{item.name}</div>
                <div className="text-red-600 font-bold text-sm">{item.price * item.qty} Br</div>
                <div className="text-[10px] text-gray-500">{item.qty} Dozen</div>
              </div>
              <button onClick={() => setCart(cart.filter(c => c.id !== item.id))}><X size={18} /></button>
            </div>
          ))}

          {cart.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between font-bold text-lg"><span>{t.total}</span><span>{totalAmount} Br</span></div>
              <div className="bg-yellow-50 p-3 rounded-lg mt-4 border border-yellow-200">
                <div className="flex justify-between text-yellow-800 font-bold"><span>{t.payNow}</span><span>{totalAmount * 0.1} Br</span></div>
                <div className="flex justify-between text-gray-500 text-sm mt-1"><span>{t.payLater}</span><span>{totalAmount * 0.9} Br</span></div>
              </div>
              <button onClick={() => setShowModal(true)} className="w-full bg-green-600 text-white font-bold py-4 rounded-xl mt-6 shadow-lg">
                {t.checkout}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative">
            <button onClick={() => setShowModal(false)} className="absolute right-4 top-4"><X /></button>
            <h3 className="font-bold text-lg mb-4">{t.confirm}</h3>
            <input 
              type="text" placeholder={t.name} 
              className="w-full border p-3 rounded-lg mb-3" 
              onChange={(e) => setUserInfo({...userInfo, name: e.target.value})} 
            />
            <input 
              type="tel" placeholder={t.phone} 
              className="w-full border p-3 rounded-lg mb-4" 
              onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})} 
            />
            <button 
              onClick={() => {alert(t.orderSuccess); setShowModal(false); setCart([]); setPage('home');}}
              className="w-full bg-red-600 text-white font-bold py-3 rounded-lg"
            >
              {t.confirm}
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-3 z-50">
        <button onClick={() => setPage('home')} className={`flex flex-col items-center ${page === 'home' ? 'text-red-600' : 'text-gray-400'}`}>
          <Home size={20} /><span className="text-[10px] mt-1">{t.home}</span>
        </button>
        <button onClick={() => setPage('cart')} className={`flex flex-col items-center relative ${page === 'cart' ? 'text-red-600' : 'text-gray-400'}`}>
          <ShoppingCart size={20} />
          {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cart.length}</span>}
          <span className="text-[10px] mt-1">{t.cart}</span>
        </button>
        <a href="tel:+251900000000" className="flex flex-col items-center text-gray-400">
          <Phone size={20} /><span className="text-[10px] mt-1">{t.call}</span>
        </a>
      </div>
    </div>
  );
}