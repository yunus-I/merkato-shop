import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export default function QuickView({ product, visible, onClose, onAdd, lang }){
  const [qty, setQty] = useState(1);
  const firstRef = useRef(null);
  const prevActive = useRef(null);

  useEffect(() => {
    function onKey(e){
      if (e.key === 'Escape') onClose();
    }
    if (visible) {
      prevActive.current = document.activeElement;
      document.addEventListener('keydown', onKey);
      setTimeout(() => firstRef.current && firstRef.current.focus(), 0);
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      if (prevActive.current && prevActive.current.focus) prevActive.current.focus();
    };
  }, [visible, onClose]);

  if (!visible || !product) return null;

  const title = lang === 'en' ? product.name : lang === 'am' ? product.nameAm : product.nameOm;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Quick view">
      <div className="modal">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="font-bold text-lg">{title}</div>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <img src={product.image} alt={product.name} className="w-full h-44 object-cover rounded" />
          <div>
            <div className="product-price font-bold mb-2">{product.price} Br</div>
            <div className="text-muted mb-2">⭐ {product.rating} • {product.sold} sold</div>
            <p className="text-sm text-muted mb-4">Buy in dozens — competitive wholesale pricing.</p>

            <div className="flex items-center gap-2 mb-4">
              <button ref={firstRef} type="button" onClick={() => setQty(q => Math.max(1, q-1))} className="btn btn-ghost" aria-label="decrease"><Minus /></button>
              <div className="font-bold">{qty}</div>
              <button type="button" onClick={() => setQty(q => q+1)} className="btn btn-ghost" aria-label="increase"><Plus /></button>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => { onAdd(product, qty); onClose(); }} className="btn btn-primary flex-1">Add {qty}x</button>
              <button type="button" onClick={onClose} className="btn btn-ghost">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
