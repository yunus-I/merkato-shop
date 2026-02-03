import React from 'react';
import { Plus, Minus, X } from 'lucide-react';

export default function CartItem({ item, onInc, onDec, onRemove }){
  return (
    <div className="card flex items-center gap-3">
      <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
      <div className="flex-1">
        <div className="font-bold text-sm">{item.name}</div>
        <div className="text-muted text-sm">{item.price} Br each</div>
        <div className="mt-2 flex items-center gap-2">
          <button type="button" onClick={() => onDec(item.id)} className="btn btn-ghost" aria-label="decrease"><Minus /></button>
          <div className="font-bold">{item.qty}</div>
          <button type="button" onClick={() => onInc(item.id)} className="btn btn-ghost" aria-label="increase"><Plus /></button>
          <button type="button" onClick={() => onRemove(item.id)} className="btn btn-ghost ml-auto" aria-label="remove"><X /></button>
        </div>
      </div>
      <div className="font-bold">{item.price * item.qty} Br</div>
    </div>
  );
}
