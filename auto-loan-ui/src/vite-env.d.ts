/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_POOL_ID: string
  readonly VITE_USER_POOL_CLIENT_ID: string
  readonly VITE_OAUTH_DOMAIN: string
  readonly VITE_OAUTH_REDIRECT_SIGN_IN: string
  readonly VITE_OAUTH_REDIRECT_SIGN_OUT: string
  readonly VITE_API_GATEWAY_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
