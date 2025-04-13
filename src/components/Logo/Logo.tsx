import Image from 'next/image'
import logoImage from 'src/assets/images/logo.png'
import { clsx } from 'clsx'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={clsx('bg-black/50', className)}>
      <Image alt="Payload Logo" className="max-w-[9.375rem]" src={logoImage} />
    </span>
  )
}
