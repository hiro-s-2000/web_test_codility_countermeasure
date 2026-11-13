package practice.authretry.data

// トークンの置き場所。問題文で与えられる前提の型なので書き換えない
interface AuthSessionStore {
    fun getAccessToken(): String?
    fun refreshAccessToken(): String?
    fun onSessionExpired()
}
