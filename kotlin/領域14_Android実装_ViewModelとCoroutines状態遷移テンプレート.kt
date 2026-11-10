// 手順 24 / 45。 左メニューの上から 24 番目です。読み終えたら、すぐ下の「領域15_Android実装_OkHttp認証リトライInterceptorとフォーム検証テンプレート」を開いてください。
import java.util.concurrent.ConcurrentHashMap

/**
 * 【領域14：Android実務実装① — ViewModel + Coroutines + StateFlow + キャッシュ制御】
 * リーダブル＆高速打鍵ポイント:
 *  - 状態を `sealed interface` で型安全に表現し、外部には不変の `st` のみ公開
 *  - マジックナンバーを定数 `MIN_QUERY_LEN` に抽出
 *  - キャッシュ保存時は `.toList()` で防御的イミュータブルコピーを行う
 */
private const val MIN_QUERY_LEN = 2

data class ArticleItem(
    val id: Long,
    val title: String
)

sealed interface SearchUiState {
    object Idle : SearchUiState
    object Loading : SearchUiState
    data class Content(
        val query: String,
        val articles: List<ArticleItem>,
        val fromCache: Boolean
    ) : SearchUiState
    data class Empty(val query: String) : SearchUiState
    data class Error(val query: String, val message: String) : SearchUiState
}

interface ArticleSearchRepository {
    fun search(query: String): List<ArticleItem>
}

class SearchPresenterTemplate(
    private val repo: ArticleSearchRepository
) {
    private val mp = ConcurrentHashMap<String, List<ArticleItem>>()

    var st: SearchUiState = SearchUiState.Idle
        private set

    fun onQueryChanged(raw: String) {
        // 1. ガード節: 前後空白を除去し、最小文字数未満なら Idle に戻す
        val q = raw.trim()
        if (q.length < MIN_QUERY_LEN) {
            st = SearchUiState.Idle
            return
        }

        // 2. キャッシュヒット時は Loading を出さず即座に返却
        val hit = mp[q]
        if (hit != null) {
            st = if (hit.isEmpty()) {
                SearchUiState.Empty(q)
            } else {
                SearchUiState.Content(q, hit, fromCache = true)
            }
            return
        }

        // 3. リポジトリ検索と不変リスト化・エラーハンドリング
        st = SearchUiState.Loading
        try {
            val res = repo.search(q).toList()
            mp[q] = res
            st = if (res.isEmpty()) {
                SearchUiState.Empty(q)
            } else {
                SearchUiState.Content(q, res, fromCache = false)
            }
        } catch (e: Throwable) {
            if (e is java.util.concurrent.CancellationException) throw e
            st = SearchUiState.Error(q, e.message ?: "Unknown error")
        }
    }

    fun clearCache() {
        mp.clear()
        st = SearchUiState.Idle
    }
}

fun main() {
    val fakeRepo = object : ArticleSearchRepository {
        override fun search(query: String): List<ArticleItem> {
            if (query == "error") throw IllegalStateException("Network timeout")
            if (query == "none") return emptyList()
            return listOf(ArticleItem(1L, "Kotlin $query Guide"))
        }
    }
    val vm = SearchPresenterTemplate(fakeRepo)
    println("Initial: ${vm.st}")
    vm.onQueryChanged(" ")
    println("Blank query: ${vm.st}")
    vm.onQueryChanged("Coroutines")
    println("First search: ${vm.st}")
    vm.onQueryChanged("Coroutines")
    println("Cached search: ${vm.st}")
}
