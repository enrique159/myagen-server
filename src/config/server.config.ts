export default () => ({
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  port: parseInt(process.env.PORT || '3333') || 3333,
  secretKey: process.env.SECRET_KEY || 'secret',
  origins: process.env.CORS_ORIGIN?.split('|') || ['http://localhost:8080', 'http://localhost:4173'],
  cookieMaxAge: process.env.COOKIE_MAX_AGE || 24 * 60 * 60 * 1000,
  fileHost: process.env.FILE_HOST || `localhost:${process.env.PORT || 3333}`,
  fileProtocol: process.env.FILE_PROTOCOL || 'http',
});
