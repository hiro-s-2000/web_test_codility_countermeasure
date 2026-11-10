<!-- NAV_BAR -->
> **手順 22 / 45。** 左メニューの上から 22 番目です。読み終えたら、すぐ下の「領域13_バグ修正特訓_Codility頻出8大Bugfixing演習と解答」を開いてください。

# 【5問・200分特化】Codility「バグ修正（Bugfixing）・Android実務実装・単体テスト・知識問題」完全攻略バイブル

> **📂 本バイブルに対応する実践Kotlinコード ＆ 本番再現フル模試（Previewクリック遷移対応）**
> - 🐛 **バグ修正ドリル（`.kt`）**: [領域13_バグ修正特訓_Codility頻出8大Bugfixing演習と解答.kt](<./kotlin/領域13_バグ修正特訓_Codility頻出8大Bugfixing演習と解答.kt>)
> - 📱 **ViewModel + Coroutines実装（`.kt`）**: [領域14_Android実装_ViewModelとCoroutines状態遷移テンプレート.kt](<./kotlin/領域14_Android実装_ViewModelとCoroutines状態遷移テンプレート.kt>)
> - 🌐 **OkHttp Interceptor + フォーム検証（`.kt`）**: [領域15_Android実装_OkHttp認証リトライInterceptorとフォーム検証テンプレート.kt](<./kotlin/領域15_Android実装_OkHttp認証リトライInterceptorとフォーム検証テンプレート.kt>)
> - 🧩 **UI可視範囲二分探索 + App Startup DAG（`.kt`）**: [領域16_Android実装_非再帰トポロジカルソートとView可視範囲二分探索.kt](<./kotlin/領域16_Android実装_非再帰トポロジカルソートとView可視範囲二分探索.kt>)
> - 🏆 **本番完全再現「5問・200分」フル模試**: [セット5_【本番完全再現・5問200分フル模試】問題冊子.md](<./模擬試験_問題リスト/セット5_【本番完全再現・5問200分フル模試】問題冊子.md>) ｜ [解答・解説・1次面接尋問.md](<./模擬試験_問題リスト/セット5_【本番完全再現・5問200分フル模試】解答・解説・1次面接尋問.md>)

大手テック企業・メガベンチャーのAndroid中途採用におけるCodilityアセスメント（**200 minutes for 5 tasks**）は、一般的な「アルゴリズム3問・90〜120分」の試験とは明確に構成が異なります。
200分（3時間20分）で5問という枠組みは、**「アルゴリズム力」だけでなく「既存コードのバグを見抜くデバッグ力（Bugfixing）」「Android SDK / Jetpack / Coroutines の実務実装力」「単体テスト設計力・プラットフォーム知識」を総合評価するフルスタックAndroid試験**です。

本バイブルでは、既存のアルゴリズム大全（[00_【統合完全版】Codility対策＆Kotlin実践大全.md](<./00_【統合完全版】Codility対策＆Kotlin実践大全.md>)）に加えて、**残り3〜4問を占める「職種特化タスク（バグ修正・Android実装・単体テスト・知識問題）」で満点を取るためのすべて**を体系化します。

---

## 第1章：200分（3時間20分）・5問を制覇する全体戦略と時間配分

### 1.1 5問の典型的な内訳パターン
CodilityのAndroidエンジニア向け5問構成は、以下のいずれかの組み合わせになります。

| タスク枠 | 出題カテゴリ | 想定難易度・形式 | 目標解答時間 |
| :--- | :--- | :--- | :--- |
| **Task A（1問）** | **バグ修正問題（Bugfixing）** または **知識問題（MCQ）** | 既存コードの1〜3行修正 / 選択問題 | **15〜20分** |
| **Task B（1〜2問）** | **アルゴリズム問題（標準〜応用）** | 累積和・尺取り法・二分探索・スタック・文字列解析など | **35〜45分 / 問** |
| **Task C（1〜2問）** | **Android実務実装問題（Framework Task）** | ViewModel+Coroutines / RecyclerView+DiffUtil / フォーム検証 / OkHttp Interceptor / キャッシュRepository | **45〜55分 / 問** |
| **Task D（0〜1問）** | **単体テスト実装問題（JUnit / Coroutines Test）** | 仕様インターフェースに対し、バグ入り実装群を落とすJUnitテストを書く | **35〜45分** |

### 1.2 試験開始直後の「冒頭5分間トリアージ（全5問スキャン）」の鉄則
試験を開始したら、**絶対にTask 1からいきなり解き始めてはいけません**。
最初の5分間で **Task 1 〜 Task 5 のタブをすべて開いて問題文のタイトルと形式を確認** し、以下の順序で解く順番を決めます。

1. **最優先（ウォーミングアップ＆確実な得点源）**:
   - **知識問題（MCQ）** または **バグ修正問題（Bugfixing）** があれば最初に片付けます（15〜20分で確実に1問完答でき、精神的余裕が生まれます）。
2. **第2優先（頭が最も冴えている前半〜中盤）**:
   - **アルゴリズム問題（1〜2問）** を解きます。1問あたり40分を上限とし、45分経っても100%解法が見えない場合は一度 $O(N^2)$ 等の部分点コードをコンパイルが通る状態で残して次へ進みます。
3. **第3優先（実務経験で確実に稼げる後半戦）**:
   - **Android実務実装問題・単体テスト問題（2問前後）** を解きます。ボイラープレートの記述量は多いですが、仕様通りに実装すれば確実に高得点が出るため、残り90〜100分を使って丁寧に仕上げます。
4. **ラスト15分（全体見直しバッファ）**:
   - 全5問のタブを巡回し、「コンパイルエラーがないか」「デバッグ出力（`println`）が残っていないか」「未提出（Submit忘れ）のタスクがないか」を最終確認します。

> **💡 200分長丁場のサバイバル術**:
> 3時間20分ぶっ続けで集中すると、開始120分を超えたあたりで脳のブドウ糖が切れて単純な境界値ミス（Off-by-one）が急増します。手元に**水・ラムネ（ブドウ糖）・目薬**を必ず用意し、2問解き終わったタイミング（約80〜90分経過時）で**カメラの前で1〜2分深呼吸とストレッチ**を入れて脳をリセットしてください。

---

## 第2章：Codility名物「バグ修正問題（Bugfixing）」完全攻略

### 2.1 【絶対厳守】全書き換えで「0点」になるCodility独自の罠
CodilityのBugfixingタスクには、問題文の末尾に必ず以下のような一文があります。

> *"Find and correct the bug(s) in the given implementation. **You can modify at most 2 lines of code** (or at most 3 lines)."*

#### 🚨 絶対にやってはいけないNG行動
- 既存のコードを消して、自分が得意なアルゴリズムで1から書き直すこと（テストケースが全て通っても、**行数差分チェックで即座に0点**になります）。
- フォーマット崩しや不要なインデント変更・変数名変更をすること（変更行数としてカウントされます）。
- **エディタ右上の「Reset」ボタン**でいつでも初期コードに戻せることを覚えておき、何行変えたか分からなくなったら一度Resetして該当行だけをピンポイントで直します。

---

### 2.2 瞬殺で見抜く！Codility Bugfixing 頻出6大バグパターン集（Kotlin）

Bugfixing問題が出たら、以下の**チェックリスト1〜8**を上から順に既存コードへ当てるだけで、3分以内にバグ箇所が特定できます。

#### パターン①：`if ... else if` の排他バグ（最終要素や長さ1で更新されない）
**【典型問題】**: ソート済み配列や文字列を走査し、最頻値や最長連続長を求めるコード。
```kotlin
// ❌ バグ入り初期コード（最多出現要素を探す）
fun solution(M: Int, A: IntArray): Int {
    val N = A.size
    val count = IntArray(M + 1)
    var maxOccurence = 1
    var index = -1
    for (i in 0 until N) {
        if (count[A[i]] > 0) {
            val tmp = count[A[i]]
            if (tmp > maxOccurence) {
                maxOccurence = tmp
                index = i
            }
            count[A[i]] = tmp + 1
        } else {
            count[A[i]] = 1
        }
    }
    return A[index]
}
```
- **🔍 バグの正体**: すべての要素が1回ずつしか出現しない場合（例: `A = [1, 2, 3]`）、一度も `if (count[A[i]] > 0)` に入らないため、`index` が初期値の `-1` のままになり、最後の `return A[index]` で `ArrayIndexOutOfBoundsException`（`A[-1]`）が発生する！
- **✅ 1行修正**: `var index = -1` を **`var index = 0`** に変更する（または `maxOccurence = 0` に変更する）。

---

#### パターン②：二分探索の収束バグ（無限ループ or 最終判定ズレ）
**【典型問題】**: ソート済み配列 `A` の中に値 `X` が存在するか判定する二分探索。
```kotlin
// ❌ バグ入り初期コード
fun solution(A: IntArray, X: Int): Int {
    val N = A.size
    if (N == 0) return -1
    var l = 0
    var r = N - 1
    while (l < r) {
        val m = (l + r) / 2
        if (A[m] > X) {
            r = m - 1
        } else {
            l = m
        }
    }
    if (A[l] == X) {
        return l
    }
    return -1
}
```
- **🔍 バグの正体**: `l = 0, r = 1` の2要素になったとき、`m = (0 + 1) / 2 = 0` となる。もし `A[0] <= X` だと `else` に入って `l = m`（つまり `l = 0` のまま）となり、**永久にループが終わらない（TLE：Time Limit Exceeded）**！
- **✅ 1行修正**: `val m = (l + r) / 2` を **`val m = (l + r + 1) / 2`**（切り上げ中央値）に変更する！
  - これにより `l = 0, r = 1` のとき `m = 1` となり、`r = m - 1` なら `r = 0`、`l = m` なら `l = 1` となって確実に `l == r` に収束する。

---

#### パターン③：初期値の罠（`0` 初期化による負数ケース破綻）
**【典型問題】**: 配列の最大値・最大区間和・最小差分などを求めるコード。
```kotlin
// ❌ バグ入り初期コード
var ans = 0 // ← 配列の全要素が負数のとき、本来の最大値（例: -5）ではなく 0 を返してしまう！
```
- **✅ 1行修正**: `var ans = A[0]` または `var ans = Int.MIN_VALUE` に変更する。

---

#### パターン④：ループ境界の Off-by-One（先頭または末尾の1要素が漏れる）
**【典型問題】**: `while (i < n - 1)` や `for (i in 1 until n - 1)` になっており、先頭 `i = 0` または末尾 `i = n - 1` が検査されていない。
```kotlin
// ❌ バグ入り初期コード（1〜Kまでの数字がすべて配列Aに含まれているか検査する）
fun solution(A: IntArray, K: Int): Boolean {
    val n = A.size
    for (i in 0 until n - 1) {
        if (A[i] + 1 < A[i + 1]) return false
    }
    if (A[0] != 1 && A[n - 1] != K) return false // ← ★バグ！両方一致していない時だけfalseになっている！
    else return true
}
```
- **🔍 バグの正体**: `A[0] == 1` かつ `A[n - 1] == K` でなければならないのに、`if (A[0] != 1 && A[n - 1] != K)` となっているため、片方だけ一致していれば `true` になってしまう！
- **✅ 1行修正**: `if (A[0] != 1 || A[n - 1] != K) return false`（`&&` を `||` に変えるだけ！）。

---

#### パターン⑤：ループ終了後の「最後の連続区間」の集計漏れ
**【典型問題】**: 同じ値が連続する区間の最大長を数えるループで、配列末尾まで同じ値が続いた場合に `else` ブロックを通らず最大値が更新されない。
- **✅ 修正**: `else` ブロックの中で `max` を更新するのではなく、ループ内の毎回（またはループ直後）で `max` を更新するように1〜2行修正する。

---

#### パターン⑥：2つの配列の最小値比較やインデックス参照ミス
```kotlin
// ❌ バグ入り初期コード（配列AとBの共通最小要素を探す）
var i = 0
for (k in 0 until n) {
    if (i < m - 1 && B[i] < A[k]) { // ← ★バグ1: i < m - 1 だと1回しか進まない（whileにすべき）＆ Bの末尾要素 B[m-1] に到達できない！
        i += 1
    }
    if (A[k] == B[i]) return A[k]
}
```
- **✅ 1行修正**: `if (i < m - 1 && B[i] < A[k])` を **`while (i < m - 1 && B[i] < A[k])`** に変更する！

---

## 第3章：Codility「Android実務実装問題（Framework Tasks）」頻出5大パターンと満点テンプレート

CodilityのAndroid実装問題では、プロジェクトの骨格（インターフェースやデータクラス、View定義）があらかじめ用意されており、**指定されたクラスやメソッドの中身を実装して自動採点テスト（JUnit / Robolectric / Espresso相当）をパスさせる形式**が主流です。

以下の5大パターンを頭に入れておけば、どのパターンの実装問題が出ても迷わず即座に書き始められます。

---

### 3.1 パターンA：`ViewModel` + `Coroutines` + `StateFlow` / `LiveData` 実装

**【出題される仕様の典型】**:
- リポジトリ（`UserRepository` 等）の `suspend fun fetchUser(id: String): User` を呼び出す。
- 読み込み開始時に `Loading` 状態を発行し、成功時に `Success(user)`、例外発生時に `Error(message)` を発行する。
- 空文字や不正なIDのときはリポジトリを呼ばずに即座に `Error` または無視する。
- 重複リクエスト防止（現在 `Loading` 中なら新規リクエストを無視、または前の `Job` を `cancel()` して最新のみ反映）。

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface UiState {
    object Idle : UiState
    object Loading : UiState
    data class Success(val data: String) : UiState
    data class Error(val message: String) : UiState
}

interface DataRepository {
    suspend fun fetchData(query: String): String
}

class SearchViewModel(
    private val repository: DataRepository,
    // ★重要: テストコードから TestDispatcher を注入できるようデフォルト引数にするのがAndroid実務の鉄則
    private val dispatcher: CoroutineDispatcher = Dispatchers.Main
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Idle)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private var currentJob: Job? = null

    fun search(query: String) {
        val trimmed = query.trim()
        if (trimmed.isEmpty()) {
            currentJob?.cancel()
            _uiState.value = UiState.Error("Query must not be empty")
            return
        }

        // 進行中の古い検索があればキャンセルして最新リクエストを優先
        currentJob?.cancel()
        currentJob = viewModelScope.launch(dispatcher) {
            _uiState.value = UiState.Loading
            try {
                val result = repository.fetchData(trimmed)
                _uiState.value = UiState.Success(result)
            } catch (e: CancellationException) {
                // ★最重要: コルーチンのキャンセル例外は絶対に握り潰さず再スローする！
                throw e
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}
```

---

### 3.2 パターンB：ログイン／入力フォームのリアルタイムバリデーション（View / TextWatcher / Compose）

CodilityのAndroidタスクで最も有名な定番問題の1つが**「メールアドレスとパスワードの入力検証とSubmitボタンの活性/非活性・エラー表示制御」**です。

**【採点テストがチェックする罠】**:
1. 初期状態（画面表示直後）でログインボタンが `isEnabled = false` になっているか？
2. メールとパスワードの**両方**が有効になった瞬間だけ `isEnabled = true` になり、片方を消したら即座に `false` に戻るか？
3. `TextWatcher` の中で同じ `EditText` のテキストを書き換える場合の無限ループ防止ができているか？

```kotlin
import android.text.Editable
import android.text.TextWatcher
import android.widget.Button
import android.widget.EditText

class LoginFormController(
    private val emailEditText: EditText,
    private val passwordEditText: EditText,
    private val submitButton: Button,
    private val onLoginClicked: (email: String, password: String) -> Unit
) {
    init {
        // 1. 初期状態のボタン活性状態を必ず設定する（採点テストの定番チェック項目！）
        updateSubmitButtonState()

        val watcher = object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) = Unit
            override fun afterTextChanged(s: Editable?) {
                updateSubmitButtonState()
            }
        }

        emailEditText.addTextChangedListener(watcher)
        passwordEditText.addTextChangedListener(watcher)

        submitButton.setOnClickListener {
            val email = emailEditText.text?.toString().orEmpty()
            val password = passwordEditText.text?.toString().orEmpty()
            if (isValidEmail(email) && isValidPassword(password)) {
                onLoginClicked(email, password)
            }
        }
    }

    private fun updateSubmitButtonState() {
        val email = emailEditText.text?.toString().orEmpty()
        val password = passwordEditText.text?.toString().orEmpty()
        submitButton.isEnabled = isValidEmail(email) && isValidPassword(password)
    }

    private fun isValidEmail(email: String): Boolean {
        // ※問題文で指定された正規表現または条件に厳密に従うこと
        // （JVMローカルユニットテストでは android.util.Patterns.EMAIL_ADDRESS が null になる場合があるため、問題文の条件または標準Regexを使う）
        if (email.isBlank()) return false
        val atIdx = email.indexOf('@')
        val dotIdx = email.lastIndexOf('.')
        return atIdx > 0 && dotIdx > atIdx + 1 && dotIdx < email.lastIndex
    }

    private fun isValidPassword(password: String): Boolean {
        // 例: 8文字以上、数字1つ以上、大文字1つ以上
        if (password.length < 8) return false
        val hasDigit = password.any { it.isDigit() }
        val hasUpper = password.any { it.isUpperCase() }
        return hasDigit && hasUpper
    }
}
```

---

### 3.3 パターンC：`RecyclerView.Adapter` / `ListAdapter` + `DiffUtil` 実装

**【採点テストがチェックする罠】**:
- `ViewHolder` の再利用時に、前回のアイテムの状態（チェックボックスのON/OFF、背景色、非表示Viewの `visibility`、古いクリックリスナー）が残ってしまうバグ（**`onBindViewHolder` で `if` と `else` の両方を必ず明示的にセットする！**）。
- `DiffUtil.ItemCallback` の `areItemsTheSame`（ID比較）と `areContentsTheSame`（`data class` の `==` 内容比較）の使い分け。

```kotlin
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView

data class ArticleItem(
    val id: Long,
    val title: String,
    val subtitle: String?,
    val isUnread: Boolean
)

class ArticleAdapter(
    private val onItemClick: (ArticleItem) -> Unit
) : ListAdapter<ArticleItem, ArticleAdapter.ArticleViewHolder>(DiffCallback) {

    object DiffCallback : DiffUtil.ItemCallback<ArticleItem>() {
        override fun areItemsTheSame(oldItem: ArticleItem, newItem: ArticleItem): Boolean {
            return oldItem.id == newItem.id // 一意なIDで同一エンティティか判定
        }

        override fun areContentsTheSame(oldItem: ArticleItem, newItem: ArticleItem): Boolean {
            return oldItem == newItem // data class の equals で表示内容の一致を判定
        }
    }

    class ArticleViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        // ※問題環境で指定された R.id.xxx または ViewBinding を使う
        val titleText: TextView = itemView.findViewById(android.R.id.text1)
        val subtitleText: TextView = itemView.findViewById(android.R.id.text2)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ArticleViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(android.R.layout.simple_list_item_2, parent, false)
        return ArticleViewHolder(view)
    }

    override fun onBindViewHolder(holder: ArticleViewHolder, position: Int) {
        val item = getItem(position)
        holder.titleText.text = item.title

        // ★重要: ViewHolder再利用バグを防ぐため、nullのときも必ず else で GONE と空文字を設定する！
        if (!item.subtitle.isNullOrEmpty()) {
            holder.subtitleText.visibility = View.VISIBLE
            holder.subtitleText.text = item.subtitle
        } else {
            holder.subtitleText.visibility = View.GONE
            holder.subtitleText.text = ""
        }

        holder.itemView.setOnClickListener {
            onItemClick(item)
        }
    }
}
```

---

### 3.4 パターンD：`OkHttp Interceptor`（認証ヘッダ付与・401リトライ・カスタムヘッダ）

大規模通信を行う商用アプリで非常に好まれるのが、OkHttpの `Interceptor` 実装問題です。

**【採点テストがチェックする罠】**:
- 元の `Request` を変更する際は `chain.request().newBuilder()` を使うこと。
- 401 Unauthorized などでリトライする際、**最初の `response.close()` を呼んでボディを閉じないとコネクションリークとして減点・テスト失敗になる**こと！

```kotlin
import okhttp3.Interceptor
import okhttp3.Response

interface TokenProvider {
    fun getAccessToken(): String?
    fun refreshAccessToken(): String?
}

class AuthRetryInterceptor(
    private val tokenProvider: TokenProvider,
    private val clientVersion: String
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val originalRequest = chain.request()

        // 1. 共通ヘッダと現在のアクセストークンを付与
        val requestBuilder = originalRequest.newBuilder()
            .header("X-Client-Version", clientVersion)

        val currentToken = tokenProvider.getAccessToken()
        if (!currentToken.isNullOrEmpty()) {
            requestBuilder.header("Authorization", "Bearer $currentToken")
        }

        val initialResponse = chain.proceed(requestBuilder.build())

        // 2. 401 Unauthorized の場合、1回だけトークンをリフレッシュしてリトライ
        if (initialResponse.code == 401) {
            val newToken = tokenProvider.refreshAccessToken()
            if (!newToken.isNullOrEmpty()) {
                // ★超重要: リトライ前に必ず古いレスポンスを close() する！
                initialResponse.close()

                val retryRequest = originalRequest.newBuilder()
                    .header("X-Client-Version", clientVersion)
                    .header("Authorization", "Bearer $newToken")
                    .build()
                return chain.proceed(retryRequest)
            }
        }

        return initialResponse
    }
}
```

---

### 3.5 パターンE：単体テスト（JUnit4 / Mockito / Kotlinテスト）実装問題

Codilityには**「インターフェースの仕様書だけが与えられ、あなたが `Test` クラスを実装して、Codility側が隠し持っている『正しい実装1つ』を通過させ、『バグ入り実装5〜10個』をすべてテスト失敗（炙り出し）させる」**という問題形式があります。

**【満点を取るための鉄則】**:
バグ入り実装をすべて炙り出すには、以下の**6つの観点のテストメソッド**を必ず独立して書きます。
1. **正常系（Happy Path）**: 標準的な入力で正しい戻り値が返ること。
2. **境界値（空文字・0件・上限値・負数）**: 空リストや `0`、負数の入力で仕様通りの例外（`IllegalArgumentException` 等）またはデフォルト値が返ること。
3. **順序・ソート・重複排除の検証**: 同じキーを2回登録したときに上書きされるか、または順序が保たれているか。
4. **状態変化の独立性（イミュータビリティ）**: 取得したリストを外部で変更しても内部状態が壊れないか、2回連続で呼んだときに前回の状態が混ざらないか。
5. **モックの呼び出し回数検証（`verify`）**: キャッシュヒット時にネットワークAPIが**呼ばれていないこと（`verify(api, times(1))`）**。
6. **エラー時のフォールバック検証**: APIが例外を投げたときにクラッシュせずエラー状態になること。

```kotlin
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PriceCalculatorTest {

    @Test
    fun `normal items should return sum of prices`() {
        val calc = PriceCalculator()
        assertEquals(300, calc.calculateTotal(listOf(100, 200)))
    }

    @Test
    fun `empty list should return zero`() {
        val calc = PriceCalculator()
        assertEquals(0, calc.calculateTotal(emptyList()))
    }

    @Test(expected = IllegalArgumentException::class)
    fun `negative price should throw IllegalArgumentException`() {
        val calc = PriceCalculator()
        calc.calculateTotal(listOf(100, -1))
    }
}
```

---

## 第4章：Android・Kotlin 知識問題（MCQ / 選択問題）即答チートシート

5問のうち1問が「複数選択式の知識問題（MCQ）」として出題された場合、または実装問題で迷った際に即答できる重要知識の総整理です。

### 4.1 Kotlin スコープ関数 5種の完全早見表

| 関数 | オブジェクト参照 | 戻り値 | 主な用途 |
| :--- | :--- | :--- | :--- |
| **`let`** | `it` | **ラムダの結果** | `?.let { ... }` による非null時の変換・局所変数スコープ制限 |
| **`run`** | `this` | **ラムダの結果** | オブジェクト初期化と結果計算を同時に行うとき |
| **`with`** | `this`（引数渡し） | **ラムダの結果** | 非nullオブジェクトに対して複数のメソッドをまとめて呼ぶとき |
| **`apply`** | `this` | **オブジェクト自身** | `Intent().apply { putExtra(...) }` などオブジェクトの初期設定 |
| **`also`** | `it` | **オブジェクト自身** | メソッドチェーンの途中でログ出力やバリデーションを挟むとき |

### 4.2 Activity / Fragment ライフサイクルと状態保存の引っかけポイント
1. **画面回転（Configuration Change）時の順序**:
   - `onPause()` → `onStop()` → **`onSaveInstanceState()`** → `onDestroy()` →（新インスタンス生成）→ `onCreate(savedInstanceState)` → `onStart()` → **`onRestoreInstanceState()`** → `onResume()`
   - ※注意: Android P (API 28) 以降、`onSaveInstanceState()` は必ず **`onStop()` の後** に呼ばれます（API 28未満では `onStop()` の前）。
2. **ダイアログ（`AlertDialog`）表示時のライフサイクル**:
   - 同じActivity内の `AlertDialog` を表示しただけでは、Activityの `onPause()` は**呼ばれません**！
   - 別の半透明（Translucent）Activityが上に重なった場合は、`onPause()` だけが呼ばれ、`onStop()` は呼ばれません（背面に見えているため）。
3. **`ViewModel` vs `onSaveInstanceState`（`SavedStateHandle`）**:
   - **画面回転**: `ViewModel` はメモリ上に生き残る（破棄されない）。
   - **OSによるバックグラウンドでのプロセスキル（Process Death）**: `ViewModel` は**消滅する**が、`onSaveInstanceState` / `SavedStateHandle`（Parcelableバンドル）は**復元される**！

### 4.3 `launchMode` 4種の違い
- **`standard`**: 毎回新しいActivityインスタンスを生成。
- **`singleTop`**: タスクの**最上部（トップ）にすでに同じActivityがいる場合のみ**再利用し、`onNewIntent()` を呼ぶ（トップ以外にいても新規生成される！）。
- **`singleTask`**: タスク内にすでに同じActivityがいれば、**その上にあるActivityをすべて破棄（clear top）**して既存のインスタンスを最前面に出し、`onNewIntent()` を呼ぶ。
- **`singleInstance`**: そのActivity専用の独立したタスクを生成し、そのタスクには他のActivityを一切入れない。

### 4.4 Kotlin ジェネリクス変位指定（Variance）と `reified`
- **`out T`（共変 / Covariant / Javaの `? extends T`）**: Producer（読み出し専用：`fun get(): T` のみ可、`fun set(value: T)` はコンパイルエラー）。例：`List<out T>`。
- **`in T`（反変 / Contravariant / Javaの `? super T`）**: Consumer（書き込み専用：`fun set(value: T)` のみ可）。例：`Comparable<in T>`。
- **`inline fun <reified T>`**: 通常JVMでは型消去（Type Erasure）により実行時に `T::class` や `x is T` が判定できないが、`inline` 関数に `reified` を付けるとバイトコードが呼び出し元にインライン展開されるため、実体化された型 `T` に対して `is T` や `T::class.java` が使用可能になる。
