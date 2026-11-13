package practice.authinterceptor.data

// 問題文で与えられる型。書き換えない。
interface AuthSessionManager {
    fun getCurrentToken(): String?
    fun refreshToken(): String?
    fun onSessionExpired()
}
