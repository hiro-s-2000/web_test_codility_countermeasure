package practice.authinterceptor.network

import okhttp3.Interceptor
import okhttp3.Request
import okhttp3.Response
import practice.authinterceptor.data.AuthSessionManager

class ResilientAuthInterceptor(
    private val authSessionManager: AuthSessionManager
) : Interceptor {

    override fun intercept(chain: Interceptor.Chain): Response {
        val original = chain.request()
        val token = authSessionManager.getCurrentToken()
        // null と空文字のトークンは「無い」のと同じなので、ヘッダを付けない
        val sent = if (!token.isNullOrEmpty()) withToken(original, token) else original
        val first = chain.proceed(sent)

        return when (first.code) {
            401 -> {
                val newToken = authSessionManager.refreshToken()
                if (newToken.isNullOrEmpty()) {
                    // 再送しないので、呼び出し側が読めるよう最初のレスポンスは閉じない
                    authSessionManager.onSessionExpired()
                    first
                } else {
                    // 開いたままだと OkHttp は次の proceed を拒否し、接続も漏れる
                    first.close()
                    val retry = chain.proceed(withToken(original, newToken))
                    // 新しいトークンでも拒否されたら、これ以上は再送せずに期限切れを知らせる
                    if (retry.code == 401) authSessionManager.onSessionExpired()
                    retry
                }
            }

            503 -> {
                // 開いたままだと OkHttp は次の proceed を拒否し、接続も漏れる
                first.close()
                // 無限に繰り返さないよう、再試行の結果はコードを見ずにそのまま返す
                chain.proceed(sent)
            }

            else -> first
        }
    }

    // header() は同名ヘッダを置き換える。addHeader() だと Authorization が2つになる
    private fun withToken(request: Request, token: String): Request =
        request.newBuilder()
            .header("Authorization", "Bearer $token")
            .build()
}
