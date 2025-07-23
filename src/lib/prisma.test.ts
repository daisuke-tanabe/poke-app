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

// ヘルパー関数: NODE_ENV操作
const setNodeEnv = (env: string | undefined) => {
  if (env) {
    (process.env as { NODE_ENV?: string }).NODE_ENV = env;
  } else {
    delete (process.env as { NODE_ENV?: string }).NODE_ENV;
  }
};

const getNodeEnv = (): string | undefined => {
  return (process.env as { NODE_ENV?: string }).NODE_ENV;
};

// ヘルパー関数: globalThis.prisma操作
const setGlobalPrisma = (value: unknown) => {
  (globalThis as GlobalWithPrisma).prisma = value;
};

const getGlobalPrisma = (): unknown => {
  return (globalThis as GlobalWithPrisma).prisma;
};

const deleteGlobalPrisma = () => {
  delete (globalThis as GlobalWithPrisma).prisma;
};

describe('prisma', () => {
  let originalNodeEnv: string | undefined;
  let originalGlobalThis: unknown;

  beforeEach(() => {
    // NODE_ENVを保存
    originalNodeEnv = process.env.NODE_ENV;

    // globalThisを保存してクリーンアップ
    originalGlobalThis = getGlobalPrisma();
    deleteGlobalPrisma();

    // モジュールキャッシュをクリア
    vi.resetModules();
  });

  afterEach(() => {
    // NODE_ENVを復元
    setNodeEnv(originalNodeEnv);

    // globalThisを復元
    if (originalGlobalThis !== undefined) {
      setGlobalPrisma(originalGlobalThis);
    } else {
      deleteGlobalPrisma();
    }
  });

  it('should create a new PrismaClient instance when none exists', async () => {
    setNodeEnv('development');

    const { prisma } = await import('./prisma');

    expect(prisma).toBeDefined();
    expect(prisma).toBe(mockPrismaClient);
  });

  it('should reuse existing PrismaClient instance in development', async () => {
    setNodeEnv('development');

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
    setNodeEnv('production');

    const { prisma } = await import('./prisma');

    expect(prisma).toBeDefined();
    expect(prisma).toBe(mockPrismaClient);
  });

  it('should set global prisma instance only in non-production environment', async () => {
    setNodeEnv('development');

    await import('./prisma');

    expect(getGlobalPrisma()).toBeDefined();
  });

  it('should not set global prisma instance in production', async () => {
    setNodeEnv('production');

    await import('./prisma');

    expect(getGlobalPrisma()).toBeUndefined();
  });

  it('should handle test environment as non-production', async () => {
    setNodeEnv('test');

    await import('./prisma');

    // テスト環境では開発環境と同様にglobalに設定される
    expect(getGlobalPrisma()).toBeDefined();
  });

  it('should handle undefined NODE_ENV as non-production', async () => {
    setNodeEnv(undefined);

    await import('./prisma');

    // NODE_ENVが未定義の場合は開発環境として扱われる
    expect(getGlobalPrisma()).toBeDefined();
  });
});
