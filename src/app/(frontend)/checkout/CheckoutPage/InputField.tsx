// components/ContactField.tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ComponentProps } from 'react'

export function InputField({
  label,
  onChange,
  ...props
}: ComponentProps<typeof Input> & {
  label: string
  onChange: (value: string) => void
}) {
  return (
    <Label className="flex flex-col gap-1">
      <span>{label}</span>
      <Input
        onChange={(e) => onChange(e.target.value)}
        { ...props}
      />
    </Label>
  )
}
