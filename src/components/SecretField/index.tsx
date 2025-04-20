'use client'
import { useState } from 'react'
import { useField } from '@payloadcms/ui'


export default function SecretField({ path, field: { label, required } }) {
  const { value, setValue } = useField<string>({ path })
  const [visible, setVisible] = useState(false)


  return (
    <div className="relative flex field-type text">
      {label && (
        <label htmlFor={path} className="field-label mb-1 block">
          {label}
          {required && <span className="text-red-600">&nbsp;*</span>}
        </label>
      )}
      <input
        id={path}
        type={visible ? 'text' : 'password'}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        className="payload-input"
        autoComplete="off"
      />
      <button
        type="button"
        className="absolute right-2 top-2 text-sm"
        aria-label={visible ? 'Hide secret' : 'Show secret'}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? 'hide' : 'show'}
      </button>
    </div>
  )
}
