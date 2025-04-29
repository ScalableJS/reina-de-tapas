import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ComponentProps } from 'react'

export function InputField({
  label,
  onChange,
  ...props
}: {
  label: string
  onChange: (value: string) => void
} & Omit<ComponentProps<typeof Input>, 'onChange'>) {
  return (
    <Label className="flex flex-col gap-1">
      <span>{label}</span>
      <Input onChange={(e) => onChange(e.target.value)} {...props} />
    </Label>
  )
}
