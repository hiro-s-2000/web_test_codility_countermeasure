package practice.authretry.ui

private const val MIN_PASS = 8

class LoginFormValidatorTemplate {
    var email = ""
        private set
    var pass = ""
        private set
    var isSubmitEnabled = false
        private set

    fun onEmailChanged(v: String) {
        email = v
        sync()
    }

    fun onPasswordChanged(v: String) {
        pass = v
        sync()
    }

    // どちらが変わっても両方を見直す。片方だけ直しても送信できてはいけないため
    private fun sync() {
        isSubmitEnabled = okEmail(email) && okPass(pass)
    }

    private fun okEmail(s: String): Boolean {
        val at = s.indexOf('@')
        if (at <= 0 || at != s.lastIndexOf('@')) return false // @ は 1 つで先頭でない
        val dom = s.substring(at + 1)
        // ドットはドメインの端に置けない。最後のドットだけ見ると先頭のドットを見逃す
        return '.' in dom && !dom.startsWith('.') && !dom.endsWith('.')
    }

    private fun okPass(s: String): Boolean =
        s.length >= MIN_PASS && s.any { it.isUpperCase() } && s.any { it.isDigit() }
}
