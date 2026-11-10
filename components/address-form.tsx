'use client';

import type { Address } from '@/lib/catalog';

const labels: Record<keyof Address, string> = {
  full_name: 'Full name',
  phone: 'Phone number',
  line1: 'Street address',
  line2: 'Apartment, suite (optional)',
  city: 'City',
  region: 'State / region',
  postal_code: 'Postal code',
  country: 'Country',
};

export function AddressFields({ value, onChange }: { value: Address; onChange: (a: Address) => void }) {
  return (
    <div className="address-grid">
      {(Object.keys(labels) as (keyof Address)[]).map((key) => (
        <label key={key} className={key === 'line1' || key === 'line2' ? 'col-span-full' : ''}>
          <span>{labels[key]}</span>
          <Input
            name={key}
            value={value[key]}
            required={key !== 'line2'}
            maxLength={key === 'postal_code' ? 20 : key === 'phone' ? 30 : key === 'line1' || key === 'line2' ? 200 : 100}
            autoComplete={
              key === 'full_name'
                ? 'name'
                : key === 'phone'
                  ? 'tel'
                  : key === 'line1'
                    ? 'address-line1'
                    : key === 'line2'
                      ? 'address-line2'
                      : key === 'city'
                        ? 'address-level2'
                        : key === 'region'
                          ? 'address-level1'
                          : key === 'country'
                            ? 'country-name'
                            : 'postal-code'
            }
            onChange={(e) => onChange({ ...value, [key]: e.target.value })}
          />
        </label>
      ))}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} placeholder="" />;
}
