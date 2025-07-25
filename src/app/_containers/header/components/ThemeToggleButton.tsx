'use client';

import { Sun, Moon, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { Button } from '@/components/button';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  // mountedフラグはSSRとCSRの初回描画内容のズレ（hydration mismatch）を防ぐために必要です。
  // next-themesはサーバー側ではthemeが未確定のため、クライアントマウント後のみアイコンを描画することでエラーを回避します。
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const icon = (() => {
    if (!isMounted) return <Loader2 className="h-5 w-5 animate-spin" />;
    return theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />;
  })();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="ml-2 rounded-full"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="テーマ切り替え"
      type="button"
    >
      {icon}
    </Button>
  );
}
