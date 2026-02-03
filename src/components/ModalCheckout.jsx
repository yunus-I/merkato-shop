import React, { useEffect, useRef } from 'react';

export default function ModalCheckout({ visible, onClose, userInfo, setUserInfo, onConfirm, labels }){
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

  if (!visible) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Checkout dialog">
      <div className="modal">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold text-lg">{labels.checkout || 'Checkout'}</div>
          <button type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <label className="text-sm">{labels.name}</label>
        <input ref={firstRef} value={userInfo.name} onChange={e => setUserInfo({...userInfo, name: e.target.value})} className="input mb-3" />

        <label className="text-sm">{labels.phone}</label>
        <input value={userInfo.phone} onChange={e => setUserInfo({...userInfo, phone: e.target.value})} className="input mb-4" />

        <div className="flex gap-2">
          <button type="button" onClick={onConfirm} className="btn btn-primary flex-1">{labels.confirm || 'Confirm'}</button>
          <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
        </div>
      </div>
    </div>
  );
}
