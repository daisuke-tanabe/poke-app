export function AppFooter() {
  return (
    <footer className="py-4 text-center text-xs leading-5">
      当サイトは非公式のファンサイトです。
      <br />
      ポケモンおよび関連する画像・名称等の著作権・商標権は、
      <a
        href="https://www.pokemon.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        ポケモン
      </a>
      、
      <a
        href="https://www.nintendo.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        任天堂
      </a>
      、
      <a
        href="https://www.gamefreak.co.jp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        ゲームフリーク
      </a>
      、
      <a
        href="https://www.creatures.co.jp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        クリーチャーズ
      </a>
      に帰属します。
    </footer>
  );
}
