package practice.authretry.ui

import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class LoginFormValidatorTemplateTest {

    private val goodEmail = "dev@example.com"
    private val goodPass = "Pass1234"

    // もう片方は正しい値にして、確かめたい側だけで結果が決まるようにする
    private fun enabledWithEmail(email: String): Boolean =
        LoginFormValidatorTemplate().apply {
            onPasswordChanged(goodPass)
            onEmailChanged(email)
        }.isSubmitEnabled

    private fun enabledWithPass(pass: String): Boolean =
        LoginFormValidatorTemplate().apply {
            onEmailChanged(goodEmail)
            onPasswordChanged(pass)
        }.isSubmitEnabled

    @Test
    fun `submit is disabled initially`() {
        assertFalse(LoginFormValidatorTemplate().isSubmitEnabled)
    }

    @Test
    fun `dev@example_com with Pass1234 enables submit`() {
        val form = LoginFormValidatorTemplate()
        form.onEmailChanged("dev@example.com")
        form.onPasswordChanged("Pass1234")
        assertTrue(form.isSubmitEnabled)
    }

    @Test
    fun `input order does not matter`() {
        val form = LoginFormValidatorTemplate()
        form.onPasswordChanged(goodPass)
        form.onEmailChanged(goodEmail)
        assertTrue(form.isSubmitEnabled)
    }

    @Test
    fun `valid email alone does not enable submit`() {
        val form = LoginFormValidatorTemplate()
        form.onEmailChanged(goodEmail)
        assertFalse(form.isSubmitEnabled)
    }

    @Test
    fun `valid password alone does not enable submit`() {
        val form = LoginFormValidatorTemplate()
        form.onPasswordChanged(goodPass)
        assertFalse(form.isSubmitEnabled)
    }

    @Test
    fun `email without an at sign is invalid`() {
        assertFalse(enabledWithEmail("devexample.com"))
    }

    @Test
    fun `email with two at signs is invalid`() {
        assertFalse(enabledWithEmail("dev@ex@ample.com"))
        assertFalse(enabledWithEmail("dev@@example.com"))
    }

    @Test
    fun `email starting with the at sign is invalid`() {
        assertFalse(enabledWithEmail("@example.com"))
    }

    @Test
    fun `email with a single character before the at sign is valid`() {
        assertTrue(enabledWithEmail("d@example.com"))
    }

    @Test
    fun `email without a dot after the at sign is invalid`() {
        assertFalse(enabledWithEmail("dev@example"))
        assertFalse(enabledWithEmail("dev@"))
    }

    @Test
    fun `a dot only before the at sign does not count`() {
        assertFalse(enabledWithEmail("d.ev@example"))
    }

    @Test
    fun `email whose domain starts with its only dot is invalid`() {
        assertFalse(enabledWithEmail("dev@.com"))
    }

    @Test
    fun `email whose domain ends with a dot is invalid`() {
        assertFalse(enabledWithEmail("dev@example."))
        assertFalse(enabledWithEmail("dev@example.com."))
    }

    @Test
    fun `email with the shortest domain around a dot is valid`() {
        assertTrue(enabledWithEmail("dev@a.b"))
    }

    @Test
    fun `password of length 7 is invalid`() {
        assertFalse(enabledWithPass("Pass123"))
    }

    @Test
    fun `password of length 8 is valid`() {
        assertTrue(enabledWithPass("Pass1234"))
    }

    @Test
    fun `password longer than 8 is valid`() {
        assertTrue(enabledWithPass("Pass12345"))
    }

    @Test
    fun `password without an uppercase letter is invalid`() {
        assertFalse(enabledWithPass("pass1234"))
    }

    @Test
    fun `password without a digit is invalid`() {
        assertFalse(enabledWithPass("Password"))
    }

    @Test
    fun `password with exactly one uppercase letter and one digit is valid`() {
        assertTrue(enabledWithPass("passworD1"))
    }

    @Test
    fun `email becoming invalid again disables submit`() {
        val form = LoginFormValidatorTemplate()
        form.onEmailChanged(goodEmail)
        form.onPasswordChanged(goodPass)
        form.onEmailChanged("dev@example")
        assertFalse(form.isSubmitEnabled)
    }

    @Test
    fun `password becoming invalid again disables submit`() {
        val form = LoginFormValidatorTemplate()
        form.onEmailChanged(goodEmail)
        form.onPasswordChanged(goodPass)
        form.onPasswordChanged("Pass123")
        assertFalse(form.isSubmitEnabled)
    }

    @Test
    fun `fixing the invalid field enables submit again`() {
        val form = LoginFormValidatorTemplate()
        form.onEmailChanged(goodEmail)
        form.onPasswordChanged("pass")
        assertFalse(form.isSubmitEnabled)
        form.onPasswordChanged(goodPass)
        assertTrue(form.isSubmitEnabled)
    }
}
