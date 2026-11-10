// 手順 25 / 45。 左メニューの上から 25 番目です。読み終えたら、すぐ下の「領域16_Android実装_非再帰トポロジカルソートとView可視範囲二分探索」を開いてください。
/**
 * 【領域15：Android実務実装② — OkHttp認証リトライInterceptor ＆ フォームリアルタイム検証】
 * リーダブル＆高速打鍵ポイント:
 *  - HTTPステータスや文字数閾値のマジックナンバーを定数 (`HTTP_UNAUTHORIZED`, `MIN_PASS_LEN`) に抽出
 *  - `data class` の `.copy()` でイミュータブルにリクエストヘッダを更新
 *  - 検証ロジックを単一責任の小さなヘルパー関数 (`okEmail`, `okPass`) に分離
 */
private const val HTTP_UNAUTHORIZED = 401
private const val MIN_PASS_LEN = 8

interface AuthSessionStore {
    fun getAccessToken(): String?
    fun refreshAccessToken(): String?
    fun onSessionExpired()
}

data class MockHttpRequest(
    val url: String,
    val headers: Map<String, String> = emptyMap()
) {
    fun withHeader(name: String, value: String): MockHttpRequest =
        copy(headers = headers + (name to value))
}

data class MockHttpResponse(
    val code: Int,
    var isClosed: Boolean = false
) {
    fun close() {
        isClosed = true
    }
}

fun interface MockChain {
    fun proceed(request: MockHttpRequest): MockHttpResponse
}

class AuthRetryInterceptorTemplate(
    private val store: AuthSessionStore
) {
    private val lock = Any()

    fun intercept(chain: MockChain, req0: MockHttpRequest): MockHttpResponse {
        // 1. 現在のトークン tok を付与して初回実行
        val tok = store.getAccessToken()
        val req = if (!tok.isNullOrBlank()) {
            req0.withHeader("Authorization", "Bearer $tok")
        } else {
            req0
        }

        val res = chain.proceed(req)
        if (res.code != HTTP_UNAUTHORIZED) return res

        // 2. 401時はリフレッシュして1回だけ再送（res.close() が必須採点項目）
        synchronized(lock) {
            val cur = store.getAccessToken()
            val nxt = if (cur != null && cur != tok) cur else store.refreshAccessToken()

            if (nxt.isNullOrBlank()) {
                store.onSessionExpired()
                return res
            }

            res.close()
            return chain.proceed(req0.withHeader("Authorization", "Bearer $nxt"))
        }
    }
}

/**
 * フォームリアルタイム検証テンプレート（単一責任のヘルパー関数 okEmail / okPass で高速実装）
 */
class LoginFormValidatorTemplate {
    var email: String = ""
        private set
    var pass: String = ""
        private set
    var isSubmitEnabled: Boolean = false
        private set

    init {
        sync()
    }

    fun onEmailChanged(v: String) {
        email = v
        sync()
    }

    fun onPasswordChanged(v: String) {
        pass = v
        sync()
    }

    private fun sync() {
        isSubmitEnabled = okEmail(email) && okPass(pass)
    }

    private fun okEmail(s: String): Boolean {
        val t = s.trim()
        val at = t.indexOf('@')
        if (at <= 0 || at != t.lastIndexOf('@')) return false
        val dom = t.substring(at + 1)
        val dot = dom.lastIndexOf('.')
        return dot > 0 && dot < dom.length - 1
    }

    private fun okPass(s: String): Boolean {
        if (s.length < MIN_PASS_LEN) return false
        return s.any { it.isUpperCase() } && s.any { it.isDigit() }
    }
}

fun main() {
    val form = LoginFormValidatorTemplate()
    println("Form initial enabled: ${form.isSubmitEnabled} (Expected: false)")
    form.onEmailChanged("dev@example.com")
    form.onPasswordChanged("Pass1234")
    println("Form valid enabled: ${form.isSubmitEnabled} (Expected: true)")
}
