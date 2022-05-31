// eslint-disable-next-line no-unused-vars
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development' | 'test'
    API_PORT: string
    WEB_URL: string
    DATABASE_URL: string
    ACCESS_TOKEN_SECRET: string
    REFRESH_TOKEN_SECRET: string
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASS: string
    SMTP_SENDER: string
  }
}
