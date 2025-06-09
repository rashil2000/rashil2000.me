import pkg from '@next/env';

const { loadEnvConfig } = pkg;
loadEnvConfig(process.cwd());

export default {
  async redirects() {
    return [
      {
        source: '/assets/:path*',
        destination: `${process.env.BLOB_URL}/:path*`,
        permanent: true,
      },
    ]
  },
}
