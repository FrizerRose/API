export default (): Record<string, any> => ({
  mode: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT || '3000', 10),
  database: {
    provider: process.env.DB_PROVIDER,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    synchronize: process.env.DB_RUN_MIGRATIONS === 'true',
  },
  cache: {
    port: parseInt(process.env.CACHE_PORT || '6379'),
    ttl: process.env.CACHE_TTL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    ttl: process.env.JWT_TTL,
  },
  aws: {
    key: process.env.AWS_KEY,
    secret: process.env.AWS_SECRET,
    bucket: process.env.AWS_BUCKET_NAME || 'frizerrose-images',
  },
  email: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    default: process.env.APP_EMAIL,
  },
  url: {
    api: process.env.API_URL_BROWSER,
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
  },
});
