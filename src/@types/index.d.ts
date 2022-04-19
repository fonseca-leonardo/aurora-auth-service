declare global {
  type Profile = 'ONG' | 'ADOPTER';

  namespace NodeJS {
    interface ProcessEnv {
      KAFKA_CLIENT_ID: string;
      KAFKA_BROKERS: string;
      KAFKA_GROUP_ID: string;
      API_PORT: number;
      NODE_ENV: string;
      FRONT_URL: string;
      JWT_SECRET: string;
      AUTH_COOKIE_SECRET: string;
      COOKIE_DOMAIN: string;
    }
  }

  interface AuthTokenData {
    userId: string;
    organizationId?: string | null;
  }
}

export {};
