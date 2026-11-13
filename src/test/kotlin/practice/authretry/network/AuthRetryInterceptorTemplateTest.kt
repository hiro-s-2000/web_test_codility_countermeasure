package practice.authretry.network

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test
import practice.authretry.data.AuthSessionStore

class AuthRetryInterceptorTemplateTest {

    // 取り直すと、決めておいたトークンに入れ替わる偽物
    private class FakeStore(
        private var token: String?,
        private val refreshed: String?,
    ) : AuthSessionStore {
        var refreshCount = 0
        var expiredCount = 0

        override fun getAccessToken(): String? = token

        override fun refreshAccessToken(): String? {
            refreshCount++
            token = refreshed
            return refreshed
        }

        override fun onSessionExpired() {
            expiredCount++
        }
    }

    // 決めた番号を順に返し、受けた要求と、その時点で前の応答が閉じていたかを覚える偽物
    private class FakeChain(vararg codes: Int) : MockChain {
        private val remaining = codes.toMutableList()
        val requests = mutableListOf<MockHttpRequest>()
        val responses = mutableListOf<MockHttpResponse>()
        val previousClosedAtProceed = mutableListOf<Boolean>()

        override fun proceed(request: MockHttpRequest): MockHttpResponse {
            previousClosedAtProceed += responses.lastOrNull()?.isClosed ?: false
            requests += request
            // 番号を使い切ったら 401 を返し続ける。再送が止まらない実装を見つけるため
            val code = if (remaining.isEmpty()) 401 else remaining.removeAt(0)
            check(requests.size <= 10) { "proceed が多すぎる" }
            return MockHttpResponse(code).also { responses += it }
        }
    }

    private val request = MockHttpRequest("https://example.com/me")

    @Test
    fun `non-401 response is returned as is with a single proceed`() {
        val store = FakeStore("old", "new")
        val chain = FakeChain(200)

        val result = AuthRetryInterceptorTemplate(store).intercept(chain, request)

        assertSame(chain.responses[0], result)
        assertEquals(200, result.code)
        assertFalse(result.isClosed)
        assertEquals(1, chain.requests.size)
        assertEquals(0, store.refreshCount)
        assertEquals(0, store.expiredCount)
    }

    @Test
    fun `error responses other than 401 are not resent`() {
        for (code in listOf(400, 403, 500)) {
            val store = FakeStore("old", "new")
            val chain = FakeChain(code)

            val result = AuthRetryInterceptorTemplate(store).intercept(chain, request)

            assertSame(chain.responses[0], result)
            assertEquals(1, chain.requests.size)
            assertEquals(0, store.refreshCount)
        }
    }

    @Test
    fun `401 re-fetches the token and resends once, returning the second response`() {
        val store = FakeStore("old", "new")
        val chain = FakeChain(401, 200)

        val result = AuthRetryInterceptorTemplate(store).intercept(chain, request)

        assertEquals(1, store.refreshCount)
        assertEquals(2, chain.requests.size)
        assertSame(chain.responses[1], result)
        assertEquals(200, result.code)
        assertEquals(0, store.expiredCount)
    }

    @Test
    fun `resend carries the refreshed token to the same url`() {
        val store = FakeStore("old", "new")
        val chain = FakeChain(401, 200)

        AuthRetryInterceptorTemplate(store).intercept(chain, request)

        assertEquals(request.url, chain.requests[1].url)
        assertEquals("Bearer new", chain.requests[1].headers["Authorization"])
    }

    @Test
    fun `401 response is closed before the resend`() {
        val store = FakeStore("old", "new")
        val chain = FakeChain(401, 200)

        AuthRetryInterceptorTemplate(store).intercept(chain, request)

        // 2 回目の proceed が呼ばれた時点で、最初の応答はもう閉じている
        assertTrue(chain.previousClosedAtProceed[1])
        assertTrue(chain.responses[0].isClosed)
    }

    @Test
    fun `resend happens only once even if the second response is also 401`() {
        val store = FakeStore("old", "new")
        val chain = FakeChain(401, 401)

        val result = AuthRetryInterceptorTemplate(store).intercept(chain, request)

        assertEquals(2, chain.requests.size)
        assertSame(chain.responses[1], result)
        assertEquals(1, store.refreshCount)
    }

    @Test
    fun `null refreshed token reports session expiry once and returns the first response without resend`() {
        assertExpired(refreshed = null)
    }

    @Test
    fun `empty refreshed token reports session expiry once and returns the first response without resend`() {
        assertExpired(refreshed = "")
    }

    private fun assertExpired(refreshed: String?) {
        val store = FakeStore("old", refreshed)
        val chain = FakeChain(401, 200)

        val result = AuthRetryInterceptorTemplate(store).intercept(chain, request)

        assertEquals(1, store.expiredCount)
        assertSame(chain.responses[0], result)
        assertEquals(401, result.code)
        assertEquals(1, chain.requests.size)
    }
}
