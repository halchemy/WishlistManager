# Wishlist Manager Browser Extension

閲覧中のページをワンクリックでウィッシュリストに追加できるブラウザ拡張機能です。

## インストール方法

### Chrome / Edge

1. ブラウザで `chrome://extensions/` を開く（Edgeの場合は `edge://extensions/`）
2. 右上の「デベロッパーモード」を有効にする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. この `extension` フォルダを選択

### Firefox

1. ブラウザで `about:debugging#/runtime/this-firefox` を開く
2. 「一時的なアドオンを読み込む」をクリック
3. この `extension` フォルダ内の `manifest.json` を選択

## 使い方

1. 拡張機能アイコンをクリック
2. 初回はサーバーURL、メールアドレス、パスワードでログイン
3. 追加したいページを開いた状態でアイコンをクリック
4. カテゴリ、優先度、メモを設定して「Add to Wishlist」をクリック

## 機能

- ページのOGP情報（タイトル、説明、画像）を自動取得
- カテゴリ、優先度、メモを設定可能
- ログイン情報は安全に保存され、次回以降は自動ログイン
