import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n: {
  //   locales: ['en', 'ru', 'es'],
  //   defaultLocale: 'en',
  // },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
