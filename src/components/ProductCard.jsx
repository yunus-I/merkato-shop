import React, { useState, useEffect } from 'react';
import { Search, Plus, Minus, Check } from 'lucide-react';

export default function ProductCard({ product, lang, onAdd, onQuickView }){
  const title = lang === 'en' ? product.name : lang === 'am' ? product.nameAm : product.nameOm;
  const [qty, setQty] = useState(1); // dozens
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let id;
    if (added) id = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(id);
  }, [added]);

  return (
    <article tabIndex={0} className="card" aria-labelledby={`p-${product.id}-title`} onKeyDown={(e)=>{ if(e.key==='Enter'){ onQuickView && onQuickView(product)} if(e.key===' '|| e.key==='Spacebar'){ e.preventDefault(); onAdd(product,1)}}}>
      {/* Badge: Best Seller / High Margin / New */}
      {(() => {
        const isBest = product.sold >= 100;
        const margin = product.originalPrice ? ((product.originalPrice - product.price) / product.originalPrice) : 0;
        const isHighMargin = margin >= 0.18;
        const isNew = product.id >= 1000 ? true : false; // placeholder rule for "new"
        if (isBest) return <div className="card-badge">Best Seller</div>;
        if (isHighMargin) return <div className="card-badge">High Margin</div>;
        if (isNew) return <div className="card-badge">New</div>;
        return null;
      })()}

      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      <div className="product-meta">
        <h3 id={`p-${product.id}-title`} className="product-title">{title}</h3>

        {/* social proof first (rating) */}
        <div className="mt-2 text-[12px] text-muted">⭐ {product.rating} • {product.sold} sold</div>

        <div className="mt-2 flex items-baseline justify-between">
          <div>
            <div className="price-primary">Wholesale: <span className="price-amount">{product.price} Br</span></div>
            <div className="price-secondary">Retail: <span>{product.originalPrice} Br</span></div>
            <div className="price-meta">Per piece: <span className="muted">{Math.round(product.price / 12)} Br</span></div>
          </div>
          <div>
            <div className="min-order-pill">Min. 1 Dozen</div>
          </div>
        </div>

        <div className="mt-3 flex gap-2 items-center">
          <div className="stepper" role="group" aria-label="quantity stepper">
            <button className="btn btn-ghost" onClick={() => setQty(q => Math.max(1, q-1))} aria-label="decrease dozen"><Minus /></button>
            <div className="stepper-value">{qty}×</div>
            <button className="btn btn-ghost" onClick={() => setQty(q => q+1)} aria-label="increase dozen"><Plus /></button>
          </div>

          <button onClick={() => { onAdd(product, qty); setAdded(true); }} className="btn btn-primary" aria-label={`Add ${title} to cart`}>+ Add to Cart ({qty * 12} pcs)</button>
          <button onClick={() => onQuickView && onQuickView(product)} className="btn btn-ghost" aria-label="quick view"><Search size={14} /></button>

          {added && (
            <div className="added-badge" aria-hidden>
              <Check size={18} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
