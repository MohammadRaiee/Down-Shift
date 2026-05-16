'use client'
import ClodinaryImage from "@/components/ui/clodinary_image"

import React, { useState } from 'react';
import { addToGuestCart } from "@/lib/guestCart";

interface PublicPartsProps {
  parts: PartForUI[];
  showAddToCart?: boolean;
  onEdit?: (part: PartForUI) => void;
}

const PublicParts = ({ parts, showAddToCart = true, onEdit }: PublicPartsProps) => {
  const [selectedPart, setSelectedPart] = useState<PartForUI | null>(null);
  const [addingId, setAddingId] = useState<number | null>(null);
console.log(parts)
  const handleAddToCart = async (part: PartForUI) => {
    setAddingId(part.id);
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partId: part.id,
          quantity: 1,
          priceAtAdd: part.price,
          options: null,
        }),
      });
      if (!response.ok) {
        if (response.status === 401) {
          addToGuestCart(part, null);
          return;
        }

        const payload = await response.json().catch(() => null);
        const message = payload?.message || 'تعذر إضافة القطعة إلى السلة.';
        throw new Error(message);
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
      alert('تعذر إضافة القطعة إلى السلة. يرجى المحاولة مرة أخرى.');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <>
      <div
        className="parts-grid"
        style={{
          display: 'grid',
          gap: '20px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        }}
      >
        {parts.map((part) => (
          <div
            key={part.id}
            className="part-card"
            style={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
            }}
            onClick={() => setSelectedPart(part)}
          >
            {part.image.length > 0 && (
              <ClodinaryImage src={part.image[0]} />
            )}
            <h2 style={{ fontSize: '18px', margin: '10px 0' }}>{part.name}</h2>
            <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              السعر: {part.price.toLocaleString()} ريال
            </p>
            {part.description && (
              <p style={{ fontSize: '14px', color: '#555' }}>{part.description}</p>
            )}
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              المتجر: <strong>{part.publisher?.storeName}</strong>
            </p>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              {showAddToCart && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleAddToCart(part);
                  }}
                  disabled={addingId === part.id}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: addingId === part.id ? '#9ca3af' : '#10b981',
                    color: '#fff',
                    borderRadius: '6px',
                    cursor: addingId === part.id ? 'not-allowed' : 'pointer',
                    flex: 1,
                  }}
                >
                  {addingId === part.id ? '...جاري الإضافة' : 'Add to cart'}
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(part);
                  }}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: '#2563eb',
                    color: '#fff',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    flex: showAddToCart ? 1 : 0,
                    minWidth: showAddToCart ? 'auto' : '100%',
                  }}
                >
                  تعديل
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedPart && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
          }}
          onClick={() => setSelectedPart(null)}
        >
          <div
            className="modal-content"
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '400px',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '10px' }}>{selectedPart.name}</h2>
            <p><strong>السعر:</strong> {selectedPart.price.toLocaleString()} ريال</p>
            {selectedPart.description && (
              <p><strong>الوصف:</strong> {selectedPart.description}</p>
            )}
            <p><strong>المتجر:</strong> {selectedPart.publisher?.storeName}</p>
            <p><strong>بلد المنشأ:</strong> {selectedPart.countryOfOrigin}</p>
            <p><strong>الجودة:</strong> {selectedPart.quality}</p>

            {(selectedPart.cars ?? []).length > 0 && (
              <div>
                <strong>السيارات المتوافقة:</strong>
                <ul style={{ paddingLeft: '20px' }}>
                  {selectedPart.cars?.map((car) => {
                    const carModelName = car.carModel?.name;
                    const carYear = car.carModel?.year;
                    const carBrandName = car.carModel?.brand?.name;
                    const label = [carBrandName, carModelName, carYear]
                      .filter(Boolean)
                      .join(' ');

                    return <li key={car.id}>{label || '-'}</li>;
                  })}
                </ul>
              </div>
            )}

            <button
              onClick={() => setSelectedPart(null)}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                border: 'none',
                background: '#0070f3',
                color: '#fff',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicParts;

export interface PartForUI {
  id: number;
  name: string;
  partNumber: string | null;
  price: number;
  description: string | null;
  publisherId: number;
  createdAt: Date;
  image: string[];
  countryOfOrigin: string;
  quality: string;
  categoryId?: number | null;

  cars?: PartCarForUI[];
  publisher?: SellerForUI;
}
interface PartCarForUI {
  id: number;
  carModel: {
    id?: number;
    name: string;
    year?: number | null;
    brand?: { id?: number; name: string } | null;
  };
}

interface SellerForUI {
  id: number;
  storeName: string;
}
