"use client";

import React, { useState, useRef } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { Upload, Check } from 'lucide-react';

interface AdminCreateProductModalProps {
  onClose: () => void;
  onCreate: (product: Product) => void;
}

export function AdminCreateProductModal({ onClose, onCreate }: AdminCreateProductModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('floor-cleaner');
  const [categoryLabel, setCategoryLabel] = useState('Floor Cleaner');
  const [price, setPrice] = useState(249);
  const [originalPrice, setOriginalPrice] = useState(349);
  const [unit, setUnit] = useState('1 Litre');
  const [stock, setStock] = useState(25);
  const [fragrance, setFragrance] = useState('Citrus Fresh');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/products/floor-cleaner.png');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true); setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) { setImage(data.url); setUploadSuccess(true); }
      else alert(data.error || 'Failed to upload image');
    } catch { alert('Upload failed. Please check network.'); }
    finally { setIsUploading(false); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please provide a product title');

    onCreate({
      id: `prod-${Date.now()}`, name: name.trim(), category: category as any, categoryLabel,
      price: Number(price), originalPrice: Number(originalPrice), unit: unit.trim(),
      rating: 5.0, reviewsCount: 1, tag: 'New Launch', inStock: true, stockCount: Number(stock),
      image, description: description.trim() || 'Premium cleaning solution by Homies Clean.',
      benefits: ['Fast acting formula', '99.9% germ protection', 'Safe on surfaces'],
      usageInstructions: 'Apply evenly and wipe clean with mop.', fragranceOrType: fragrance.trim(),
    });
  };

  const CATEGORY_MAP: Record<string, string> = {
    'floor-cleaner': 'Floor Cleaner', 'toilet-cleaner': 'Toilet Cleaner',
    'mops-tools': 'Mops & Tools', 'bathroom-kitchen': 'Bathroom & Kitchen', 'combos': 'Value Combos'
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-sky-300 p-5 shadow-md space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 text-sky-900 font-extrabold text-sm border-b pb-3">
        <Upload className="w-4 h-4 text-sky-600" />
        <span>Upload & Create New Cleaning Product</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Title *</label>
          <input
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Lavender Multi-Surface Spray"
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as any); setCategoryLabel(CATEGORY_MAP[e.target.value] || 'Cleaning Supply'); }}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          >
            <option value="floor-cleaner">Floor Cleaner</option>
            <option value="toilet-cleaner">Toilet Cleaner</option>
            <option value="mops-tools">Mops & Squeegees</option>
            <option value="bathroom-kitchen">Bathroom & Kitchen</option>
            <option value="combos">Value Combos</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Unit</label>
          <input
            type="text" required value={unit} onChange={(e) => setUnit(e.target.value)}
            placeholder="e.g. 1 Litre"
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
          <input
            type="number" required min={1} value={price} onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Original Price (₹)</label>
          <input
            type="number" required min={1} value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Stock Units</label>
          <input
            type="number" required min={0} value={stock} onChange={(e) => setStock(Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt="Preview" className="w-14 h-14 rounded-xl object-cover border bg-white" />
        <div className="flex-1 text-xs">
          <span className="font-bold text-sky-900 block">Product Photo</span>
          <input
            type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*"
            className="text-[11px] text-slate-600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-sky-600 file:text-white"
          />
        </div>
        {isUploading && <span className="text-xs font-bold text-sky-700 animate-pulse">Uploading...</span>}
        {uploadSuccess && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Ready!</span>}
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100">Cancel</button>
        <button type="submit" className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md">Publish Product</button>
      </div>
    </form>
  );
}
