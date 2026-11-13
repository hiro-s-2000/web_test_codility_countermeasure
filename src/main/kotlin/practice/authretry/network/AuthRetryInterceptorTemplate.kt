package practice.authretry.network

import practice.authretry.data.AuthSessionStore

private const val UNAUTH = 401

class AuthRetryInterceptorTemplate(private val store: AuthSessionStore) {
    private val lock = Any()

    fun intercept(chain: MockChain, req0: MockHttpRequest): MockHttpResponse {
        val tok = store.getAccessToken()
        val req = if (!tok.isNullOrBlank()) req0.withHeader("Authorization", "Bearer $tok") else req0
        val res = chain.proceed(req)
        if (res.code != UNAUTH) return res // 401 以外はそのまま返す

        // 同時に 401 を受けた複数のスレッドが、それぞれ取り直しに行かないようにする
        synchronized(lock) {
            val cur = store.getAccessToken()
            // 他のスレッドが更新済みならそれを使い、なければ取り直す
            val nxt = if (cur != null && cur != tok) cur else store.refreshAccessToken()
            if (nxt.isNullOrBlank()) {
                store.onSessionExpired()
                return res // 再送できないので最初の応答を返す
            }
            res.close() // 再送の前に閉じないと接続が残る
            // 再送の結果は 401 でもそのまま返す（再送は 1 回だけ）
            return chain.proceed(req0.withHeader("Authorization", "Bearer $nxt"))
        }
    }
}
