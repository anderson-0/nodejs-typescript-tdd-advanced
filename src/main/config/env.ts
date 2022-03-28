export const env = {
  facebookApi: {
    clientId: process.env.FACEBOOK_CLIENT_ID ?? '282640477364862',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? '75da1427ec7845cee130e2b48c18f022'
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? 'secret'
}
