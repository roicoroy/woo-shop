export const environment = {
  production: true,
  wordpressShopUrl: 'http://localhost:8888/shop',
  origin: 'http://localhost:8888',
  wcEndpoint: '/wp-json/wc/v2',
  wc3Endpoint: '/wp-json/wc/v3',
  wordpress: {
    api_url: 'wp-json/wp/v2/',
    auth_url: 'wp-json/jwt-auth/v1/token',
  },
  woocommerce: {
    consumer_key: "ck_37ded76605b2de2f34df092d34e8baeb986a7f28",
    consumer_secret: "cs_c2c87bada6d24ade0fc9ae8399e4ac95133b6cae"
  },
  STRIPE_PUBLISHABLE_KEY: 'pk_test_2qqvb6DTqKondL46mnEjZ68e',
  STRIPE_SECRET_KEY: 'sk_test_eUKKviA6p43i3vgCrwJeQnw4',
  fcm_rest_api_key: '',
};
