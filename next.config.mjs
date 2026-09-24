import SentryConfig from '@sentry/nextjs/config';

const { withSentryConfig } = SentryConfig;

const nextConfig = {
  reactStrictMode: true,
};

export default withSentryConfig(nextConfig, {
  silent: true,
  widenClientFileUpload: true,
});
