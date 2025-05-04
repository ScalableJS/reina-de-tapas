const redirects = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  const categoryToShopRedirect = {
    source: '/categories/:path*',
    destination: '/shop/:path*',
    permanent: true,
  }

  return [internetExplorerRedirect, categoryToShopRedirect]
}

export default redirects
