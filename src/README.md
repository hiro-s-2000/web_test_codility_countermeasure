# Android 実装課題の単体テスト環境

本番前試験練習に出る Android の class 課題を、Android Studio で書いて単体テストで確かめるための場所です。
ブラウザの実行機では class を動かせないので、ここで動かします。

## 動かし方

- Android Studio で `Codility対策` フォルダを開き、Gradle の同期が終わったら、テストクラスの横の実行ボタンを押します。
- ターミナルからは次のとおりです。

```bash
./gradlew test                                   # 全部
./gradlew test --tests "*ArticleSearchViewModelTest"   # 1クラスだけ
```

エミュレータや実機は使いません。JVM 上の単体テストです（`androidx.lifecycle` の ViewModel、Coroutines、OkHttp は JVM 用の部品で動きます）。

## フォルダの分け方

課題ごとにパッケージを分け、その中を関心ごとに分けます。同じ名前の型（`SearchUiState` など）が課題どうしでぶつからないようにするためです。

```
src/main/kotlin/practice/<課題>/
    model/     画面やネットワークに依存しないデータ（data class）
    data/      外から取ってくる窓口の interface（Repository、セッション管理）
    ui/        画面の状態（UiState）と、それを動かす class（ViewModel、Presenter、入力検証）
    network/   通信に割り込む class（Interceptor）と、そのための型
src/test/kotlin/practice/<課題>/<同じ下位フォルダ>/
    <実装クラス名>Test.kt   テスト。偽物（Fake）の Repository などはテストの中に置く
```

必要なフォルダだけ作ります。4つ全部はそろえません。

| 課題（練習ページの問題） | パッケージ | 実装する class |
| --- | --- | --- |
| 記事検索とインメモリキャッシュ制御（セット5 Task 4） | `practice.articlesearch` | `ui/ArticleSearchViewModel` |
| 認証とレート制限リトライ Interceptor（セット5 Task 5） | `practice.authinterceptor` | `network/ResilientAuthInterceptor` |
| 検索語の長さと保存済みの結果で、画面の状態を変える（領域14） | `practice.searchpresenter` | `ui/SearchPresenterTemplate` |
| 認証が拒否されたときの再送と、入力が送信できるか（領域15） | `practice.authretry` | `network/AuthRetryInterceptorTemplate`、`ui/LoginFormValidatorTemplate` |

## 練習のしかた

実装する class のファイルには、テストが通る実装が入っています。練習するときは、その class の中身を消して自分で書き直し、テストを実行します。
`model/` と `data/` と `UiState`、それに `authretry/network/MockHttp.kt` は、問題文で与えられる前提の型なので書き換えません。

## 決まり

- テストは JUnit 4（`org.junit.Test`）で書きます。Coroutines は `kotlinx-coroutines-test`、Flow は Turbine、OkHttp は MockWebServer を使えます。
- テスト名はバッククォートの英文で、原則として問題文の1つの条件を1つのテストにします。
- テストは問題文の条件を確かめます。模範解答の内部の作り（変数名、private な関数）には依存しません。
- コメントは日本語で、なぜそうするかだけを短く書きます。
