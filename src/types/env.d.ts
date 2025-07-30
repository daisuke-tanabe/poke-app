declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;

    // Database
    DATABASE_URL: string;
    DIRECT_URL: string;

    // その他の環境変数をここに追加
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
