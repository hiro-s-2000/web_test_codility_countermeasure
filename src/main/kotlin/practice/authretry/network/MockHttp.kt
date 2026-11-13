package practice.authretry.network

// この課題は OkHttp を使わず、問題文で与えられる簡単な型で通信を表す

data class MockHttpRequest(val url: String, val headers: Map<String, String> = emptyMap()) {
    // 元の要求を変えずに、ヘッダーを足した新しい要求を返す
    fun withHeader(name: String, value: String): MockHttpRequest =
        copy(headers = headers + (name to value))
}

data class MockHttpResponse(val code: Int, var isClosed: Boolean = false) {
    fun close() {
        isClosed = true
    }
}

fun interface MockChain {
    fun proceed(request: MockHttpRequest): MockHttpResponse
}
