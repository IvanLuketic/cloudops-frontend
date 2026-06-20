/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: 'http://3.74.42.88:8081',
  },
  // Onemogući Turbopack keširanje
  turbopack: {
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  // Generiši fajlove sa hash-om koji se ne menja
  generateBuildId: async () => {
    return 'stable-build-' + Date.now()
  },
}

module.exports = nextConfig