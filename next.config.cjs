/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'http://3.74.42.88:8081',
  },
  generateBuildId: async () => {
    return 'stable-build-' + Date.now()
  },
}

module.exports = nextConfig