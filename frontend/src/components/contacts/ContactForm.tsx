'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { MOCK_CONTACTS } from '@/lib/mockData';
import { ui } from '@/lib/theme';
import type { Contact } from '@/types/contact';

interface ContactFormProps {
  id: string;
}

export default function ContactForm({ id }: ContactFormProps) {
  const router = useRouter();
  const isNew = id === 'new';

  // fileInputRef — ref to the hidden <input type="file">
  // Used to open the file picker when user clicks the avatar circle
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * form state — all fields in one object.
   *
   * CHANGES FROM ORIGINAL:
   * Added: street, city, state, country, pincode, imageUrl
   * Kept:  name, email, phone, type (unchanged)
   *
   * API: when backend ready, POST all these fields to /api/contacts
   */
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'customer' as 'customer' | 'vendor' | 'both',
    // ── NEW FIELDS ──
    street: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    imageUrl: null as string | null, // base64 data URL from file upload
  });

  const [loading, setLoading] = useState(false);

  // Populate form when editing existing contact (unchanged logic)
  useEffect(() => {
    if (!isNew) {
      const existing = MOCK_CONTACTS.find((c) => c.id === id);
      if (existing) {
        setForm({
          name: existing.name,
          email: existing.email || '',
          phone: existing.phone || '',
          type: (existing.type as any) || 'customer',
          // ── NEW FIELDS: populate from existing if available ──
          street: (existing as any).street || '',
          city: (existing as any).city || '',
          state: (existing as any).state || '',
          country: (existing as any).country || '',
          pincode: (existing as any).pincode || '',
          imageUrl: (existing as any).imageUrl || null,
        });
      }
    }
  }, [id, isNew]);

  // handleChange — works for all text inputs + select (unchanged)
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  /**
   * handleImageChange — converts selected file to base64 data URL.
   *
   * HOW IT WORKS:
   * 1. User clicks the avatar circle → fileInputRef.current.click()
   * 2. File picker opens → user selects image
   * 3. This handler fires → FileReader reads the file
   * 4. reader.onload → stores base64 string in form.imageUrl
   * 5. React re-renders → <img src={form.imageUrl}> shows preview
   *
   * API: on submit, send imageUrl as base64 OR use FormData multipart
   */
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file); // converts to base64 string
  }

  // handleSubmit — unchanged logic, just logs new fields too
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    console.log('Submitting contact:', form);
    // API: await api.post('/contacts', form)
    setTimeout(() => {
      setLoading(false);
      router.push('/contacts');
    }, 400);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/*
        PAGE TITLE — only once, above the form card.
        CHANGE: Removed the duplicate title that was inside the Card.
        Now shows only here: "New Contact" or "Edit Contact: {name}"
      */}
      <h1 className={ui.pageTitle}>
        {isNew ? 'New Contact' : `Edit Contact: ${form.name}`}
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── IMAGE UPLOAD (new) ────────────────────────── */}
          {/*
            Clicking the circle triggers the hidden file input.
            Shows a preview of the uploaded image, or a camera icon placeholder.
          */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Profile Photo
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-20 h-20 rounded-full border-2 border-dashed border-[#D0CABF] flex items-center justify-center cursor-pointer hover:border-[#6B705C] transition-colors overflow-hidden bg-[#F8F6F1]"
            >
              {form.imageUrl ? (
                // Preview of uploaded photo
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                // Placeholder camera icon — no photo yet
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none"
                  className="text-[#A5A58D]"
                >
                  <path
                    d="M12 16a4 4 0 100-8 4 4 0 000 8z"
                    stroke="currentColor" strokeWidth="1.5" fill="none"
                  />
                  <path
                    d="M3 9a2 2 0 012-2h.5L7 5h10l1.5 2H21a2 2 0 012 2v9a2 2 0 01-2 2H3a2 2 0 01-2-2V9z"
                    stroke="currentColor" strokeWidth="1.5" fill="none"
                  />
                </svg>
              )}
            </div>
            {/* Hidden file input — only accepts images */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-xs text-[#737373] mt-1.5">
              Click to upload photo
            </p>
          </div>

          {/* ── CONTACT NAME (unchanged) ───────────────────── */}
          <Input
            label="Contact Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="e.g. Azure Interior"
          />

          {/* ── EMAIL + PHONE side by side (unchanged) ──────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
            <Input
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 555-0000"
            />
          </div>

          {/* ── ADDRESS SECTION (new) ─────────────────────── */}
          <div>
            <label className="block text-sm font-medium text-[#2C2C2C] mb-2">
              Address
            </label>
            <div className="space-y-3">
              {/* Street — full width */}
              <Input
                label=""
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Street"
              />
              {/* City + State — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label=""
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="City"
                />
                <Input
                  label=""
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
              {/* Country + Pincode — side by side */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label=""
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="Country"
                />
                <Input
                  label=""
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          {/* ── CONTACT TYPE (unchanged options, updated labels) ── */}
          <Select
            label="Contact Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={[
              { value: 'customer', label: 'Customer' },
              { value: 'vendor',   label: 'Vendor' },
              { value: 'both',     label: 'Both' },
            ]}
          />

          {/* ── ACTION BUTTONS (unchanged) ────────────────── */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E3DC]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/contacts')}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {isNew ? 'Create Contact' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}