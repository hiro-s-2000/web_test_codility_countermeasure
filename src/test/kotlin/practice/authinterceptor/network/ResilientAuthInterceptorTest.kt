package practice.authinterceptor.network

import java.util.concurrent.TimeUnit
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import practice.authinterceptor.data.AuthSessionManager

class ResilientAuthInterceptorTest {

    // 呼ばれた回数を数えるだけの偽物。返すトークンはテストごとに決める
    private class FakeAuthSessionManager(
        var tokenNow: String? = null,
        var refreshedToken: String? = null
    ) : AuthSessionManager {
        var refreshCalls = 0
        var sessionExpiredCalls = 0

        override fun getCurrentToken(): String? = tokenNow

        override fun refreshToken(): String? {
            refreshCalls++
            return refreshedToken
        }

        override fun onSessionExpired() {
            sessionExpiredCalls++
        }
    }

    private lateinit var server: MockWebServer
    private lateinit var auth: FakeAuthSessionManager
    private lateinit var client: OkHttpClient

    @Before
    fun setUp() {
        server = MockWebServer()
        server.start()
        auth = FakeAuthSessionManager()
        client = OkHttpClient.Builder()
            .addInterceptor(ResilientAuthInterceptor(auth))
            .build()
    }

    @After
    fun tearDown() {
        server.shutdown()
    }

    private fun enqueue(code: Int, body: String = "") {
        server.enqueue(MockResponse().setResponseCode(code).setBody(body))
    }

    private fun get(configure: Request.Builder.() -> Unit = {}): Response =
        client.newCall(Request.Builder().url(server.url("/items")).apply(configure).build()).execute()

    // 届いていないときに待ち続けないよう、時間を区切って取り出す
    private fun takeRequest(): RecordedRequest {
        val request = server.takeRequest(2, TimeUnit.SECONDS)
        assertNotNull("サーバーにリクエストが届いていない", request)
        return request!!
    }

    // ---- 1. 認証ヘッダの付与 ----

    @Test
    fun `adds Authorization Bearer header when current token is present`() {
        auth.tokenNow = "abc"
        enqueue(200)

        get().close()

        assertEquals("Bearer abc", takeRequest().getHeader("Authorization"))
    }

    @Test
    fun `does not add Authorization header when current token is null`() {
        auth.tokenNow = null
        enqueue(200)

        get().close()

        assertNull(takeRequest().getHeader("Authorization"))
    }

    @Test
    fun `does not add Authorization header when current token is empty`() {
        auth.tokenNow = ""
        enqueue(200)

        get().close()

        assertNull(takeRequest().getHeader("Authorization"))
    }

    @Test
    fun `overwrites an existing Authorization header instead of adding a second one`() {
        auth.tokenNow = "abc"
        enqueue(200)

        get { header("Authorization", "Basic old") }.close()

        assertEquals(listOf("Bearer abc"), takeRequest().headers.values("Authorization"))
    }

    // ---- 2. 401 のときの再取得と再送 ----

    @Test
    fun `on 401 refreshes the token and retries once with the new token then returns the retry response`() {
        auth.tokenNow = "old"
        auth.refreshedToken = "new"
        enqueue(401, "denied")
        enqueue(200, "ok")

        val response = get()

        assertEquals(200, response.code)
        assertEquals("ok", response.body!!.string())
        assertEquals(1, auth.refreshCalls)
        assertEquals(0, auth.sessionExpiredCalls)
        assertEquals(2, server.requestCount)
        assertEquals("Bearer old", takeRequest().getHeader("Authorization"))
        assertEquals(listOf("Bearer new"), takeRequest().headers.values("Authorization"))
    }

    @Test
    fun `on 401 the retry carries the new token even when there was no current token`() {
        auth.tokenNow = null
        auth.refreshedToken = "new"
        enqueue(401)
        enqueue(200)

        val response = get()
        response.close()

        assertEquals(200, response.code)
        assertNull(takeRequest().getHeader("Authorization"))
        assertEquals("Bearer new", takeRequest().getHeader("Authorization"))
    }

    @Test
    fun `on 401 the retry is sent to the same url with the same method and body`() {
        auth.tokenNow = "old"
        auth.refreshedToken = "new"
        enqueue(401)
        enqueue(200)

        get {
            header("X-Trace", "t1")
            post("payload".toRequestBody())
        }.close()

        val first = takeRequest()
        val retry = takeRequest()
        assertEquals(first.path, retry.path)
        assertEquals("POST", retry.method)
        assertEquals("payload", retry.body.readUtf8())
        assertEquals("t1", retry.getHeader("X-Trace"))
    }

    @Test
    fun `on 401 when refreshToken returns null calls onSessionExpired once and returns the first response`() {
        auth.tokenNow = "old"
        auth.refreshedToken = null
        enqueue(401, "denied")

        val response = get()

        assertEquals(401, response.code)
        // そのまま返すので、本文は閉じられずに読める
        assertEquals("denied", response.body!!.string())
        assertEquals(1, auth.refreshCalls)
        assertEquals(1, auth.sessionExpiredCalls)
        assertEquals(1, server.requestCount)
    }

    @Test
    fun `on 401 when refreshToken returns empty calls onSessionExpired once and returns the first response`() {
        auth.tokenNow = "old"
        auth.refreshedToken = ""
        enqueue(401, "denied")

        val response = get()

        assertEquals(401, response.code)
        assertEquals("denied", response.body!!.string())
        assertEquals(1, auth.refreshCalls)
        assertEquals(1, auth.sessionExpiredCalls)
        assertEquals(1, server.requestCount)
    }

    @Test
    fun `when the retry is also 401 calls onSessionExpired once and returns the retry response without a third request`() {
        auth.tokenNow = "old"
        auth.refreshedToken = "new"
        enqueue(401, "first")
        enqueue(401, "second")
        // 3回目を送ってしまう実装なら、これが返って失敗する
        enqueue(200, "third")

        val response = get()

        assertEquals(401, response.code)
        assertEquals("second", response.body!!.string())
        assertEquals(1, auth.refreshCalls)
        assertEquals(1, auth.sessionExpiredCalls)
        assertEquals(2, server.requestCount)
    }

    @Test
    fun `when the retry after 401 returns 503 it is returned as is without another retry`() {
        auth.tokenNow = "old"
        auth.refreshedToken = "new"
        enqueue(401)
        enqueue(503, "busy")
        enqueue(200, "third")

        val response = get()

        assertEquals(503, response.code)
        assertEquals("busy", response.body!!.string())
        assertEquals(0, auth.sessionExpiredCalls)
        assertEquals(2, server.requestCount)
    }

    // ---- 3. 503 のときの再試行 ----

    @Test
    fun `on 503 retries exactly once and returns the retry response`() {
        auth.tokenNow = "abc"
        enqueue(503, "busy")
        enqueue(200, "ok")

        val response = get()

        assertEquals(200, response.code)
        assertEquals("ok", response.body!!.string())
        assertEquals(2, server.requestCount)
        assertEquals(0, auth.refreshCalls)
        assertEquals(0, auth.sessionExpiredCalls)
    }

    @Test
    fun `on 503 the retry is the same request including the Authorization header`() {
        auth.tokenNow = "abc"
        enqueue(503)
        enqueue(200)

        get {
            header("X-Trace", "t1")
            post("payload".toRequestBody())
        }.close()

        val first = takeRequest()
        val retry = takeRequest()
        assertEquals(first.path, retry.path)
        assertEquals("POST", retry.method)
        assertEquals("payload", retry.body.readUtf8())
        assertEquals("t1", retry.getHeader("X-Trace"))
        assertEquals(listOf("Bearer abc"), retry.headers.values("Authorization"))
    }

    @Test
    fun `when the retry after 503 is also 503 it is returned without a third request`() {
        enqueue(503, "first")
        enqueue(503, "second")
        enqueue(200, "third")

        val response = get()

        assertEquals(503, response.code)
        assertEquals("second", response.body!!.string())
        assertEquals(2, server.requestCount)
    }

    // ---- それ以外のコード ----

    @Test
    fun `a 200 response is returned as is with a single request and no session calls`() {
        auth.tokenNow = "abc"
        enqueue(200, "ok")

        val response = get()

        assertEquals(200, response.code)
        assertEquals("ok", response.body!!.string())
        assertEquals(1, server.requestCount)
        assertEquals(0, auth.refreshCalls)
        assertEquals(0, auth.sessionExpiredCalls)
    }

    @Test
    fun `other error codes are returned as is without retry or refresh`() {
        auth.tokenNow = "abc"
        auth.refreshedToken = "new"

        for (code in listOf(400, 403, 404, 500, 502)) {
            val before = server.requestCount
            enqueue(code, "body$code")

            val response = get()

            assertEquals(code, response.code)
            assertEquals("body$code", response.body!!.string())
            assertEquals(before + 1, server.requestCount)
        }
        assertEquals(0, auth.refreshCalls)
        assertEquals(0, auth.sessionExpiredCalls)
    }
}
