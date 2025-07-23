import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// PrismaClientのモック
const mockPrismaClient = {
  $connect: vi.fn(),
  $disconnect: vi.fn(),
};

// PrismaClientをモック
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient),
}));

interface GlobalWithPrisma {
  prisma?: unknown;
}

describe('prisma', () => {
  let originalNodeEnv: string | undefined;
  let originalGlobalThis: unknown;

  beforeEach(() => {
    // NODE_ENVを保存
    originalNodeEnv = process.env.NODE_ENV;

    // globalThisを保存してクリーンアップ
    originalGlobalThis = (globalThis as GlobalWithPrisma).prisma;
    delete (globalThis as GlobalWithPrisma).prisma;

    // モジュールキャッシュをクリア
    vi.resetModules();
  });

  afterEach(() => {
    // NODE_ENVを復元
    if (originalNodeEnv !== undefined) {
      (process.env as { NODE_ENV?: string }).NODE_ENV = originalNodeEnv;
    } else {
      delete (process.env as { NODE_ENV?: string }).NODE_ENV;
    }

    // globalThisを復元
    if (originalGlobalThis !== undefined) {
      (globalThis as GlobalWithPrisma).prisma = originalGlobalThis;
    } else {
      delete (globalThis as GlobalWithPrisma).prisma;
    }
  });

  it('should create a new PrismaClient instance when none exists', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'development';

    const { prisma } = await import('./prisma');

    expect(prisma).toBeDefined();
    expect(prisma).toBe(mockPrismaClient);
  });

  it('should reuse existing PrismaClient instance in development', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'development';

    // 最初のインポート
    const { prisma: prisma1 } = await import('./prisma');

    // モジュールキャッシュをクリアして再インポート
    vi.resetModules();
    const { prisma: prisma2 } = await import('./prisma');

    expect(prisma1).toBeDefined();
    expect(prisma2).toBeDefined();
    // 開発環境では同じインスタンスが使用される
    expect(prisma1).toBe(prisma2);
  });

  it('should create new instance in production environment', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'production';

    const { prisma } = await import('./prisma');

    expect(prisma).toBeDefined();
    expect(prisma).toBe(mockPrismaClient);
  });

  it('should set global prisma instance only in non-production environment', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'development';

    await import('./prisma');

    expect((globalThis as GlobalWithPrisma).prisma).toBeDefined();
  });

  it('should not set global prisma instance in production', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'production';

    await import('./prisma');

    expect((globalThis as GlobalWithPrisma).prisma).toBeUndefined();
  });

  it('should handle test environment as non-production', async () => {
    (process.env as { NODE_ENV?: string }).NODE_ENV = 'test';

    await import('./prisma');

    // テスト環境では開発環境と同様にglobalに設定される
    expect((globalThis as GlobalWithPrisma).prisma).toBeDefined();
  });

  it('should handle undefined NODE_ENV as non-production', async () => {
    delete (process.env as { NODE_ENV?: string }).NODE_ENV;

    await import('./prisma');

    // NODE_ENVが未定義の場合は開発環境として扱われる
    expect((globalThis as GlobalWithPrisma).prisma).toBeDefined();
  });
});
