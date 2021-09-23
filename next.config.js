const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

const base = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        '@svgr/webpack',
        'svg-transform-loader',
        'svgo-loader'
      ],
    });
    return config;
  },
}

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...base,
      async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8000/api/:path*' // Proxy to Backend
          }
        ]
      }
    }
  }

  return {
    ...base,
  }
}