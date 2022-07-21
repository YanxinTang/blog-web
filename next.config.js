const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

const base = {
  reactStrictMode: true,
  eslint: {
    dirs: ['pages', 'components', 'http', 'layout', 'store', 'utils', 'test'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['svg-sprite-loader', 'svg-transform-loader', 'svgo-loader'],
    });
    return config;
  },
};

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...base,
      async rewrites() {
        return [
          {
            source: '/backend/:path*',
            destination: 'http://localhost:8000/:path*', // Proxy to Backend
          },
        ];
      },
    };
  }

  return {
    ...base,
  };
};
