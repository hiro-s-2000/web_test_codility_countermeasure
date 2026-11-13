package practice.articlesearch.ui

import app.cash.turbine.test
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.delay
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.resetMain
import kotlinx.coroutines.test.runTest
import kotlinx.coroutines.test.setMain
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import practice.articlesearch.data.ArticleRepository
import practice.articlesearch.model.Article
import java.io.IOException

@OptIn(ExperimentalCoroutinesApi::class)
class ArticleSearchViewModelTest {

    private val testDispatcher = StandardTestDispatcher()
    private lateinit var fakeRepository: FakeArticleRepository
    private lateinit var viewModel: ArticleSearchViewModel

    @Before
    fun setUp() {
        Dispatchers.setMain(testDispatcher)
        fakeRepository = FakeArticleRepository()
        viewModel = ArticleSearchViewModel(fakeRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `uiState initial value is SearchUiState_Idle`() = runTest(testDispatcher) {
        assertEquals(SearchUiState.Idle, viewModel.uiState.value)
    }

    @Test
    fun `query shorter than 2 characters after trim results in Error and does not call repository`() = runTest(testDispatcher) {
        viewModel.onQuerySubmitted(" a ")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value
        assertTrue(state is SearchUiState.Error)
        val errorState = state as SearchUiState.Error
        assertEquals("a", errorState.query)
        assertEquals("Query too short", errorState.message)
        assertEquals(0, fakeRepository.callCount)
    }

    @Test
    fun `successful search produces Loading then Content with fromCache false and caches result`() = runTest(testDispatcher) {
        fakeRepository.searchResult = listOf(Article("1", "Kotlin Guide"))

        viewModel.uiState.test {
            assertEquals(SearchUiState.Idle, awaitItem())

            viewModel.onQuerySubmitted("Kotlin")

            assertEquals(SearchUiState.Loading, awaitItem())
            testDispatcher.scheduler.advanceUntilIdle()

            val content = awaitItem() as SearchUiState.Content
            assertEquals("Kotlin", content.query)
            assertEquals(1, content.articles.size)
            assertEquals(false, content.fromCache)
            assertEquals(1, fakeRepository.callCount)
        }
    }

    @Test
    fun `cache hit with forceRefresh false does not show Loading or call repository`() = runTest(testDispatcher) {
        val articles = listOf(Article("1", "Android Architecture"))
        fakeRepository.searchResult = articles

        // 初回検索
        viewModel.onQuerySubmitted("Android")
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(1, fakeRepository.callCount)

        // 2回目（キャッシュヒット確認）
        viewModel.uiState.test {
            // 現在のステートをスキップ
            awaitItem()

            viewModel.onQuerySubmitted("Android", forceRefresh = false)

            val cachedContent = awaitItem() as SearchUiState.Content
            assertEquals("Android", cachedContent.query)
            assertEquals(articles, cachedContent.articles)
            assertEquals(true, cachedContent.fromCache)
            // リポジトリは呼ばれていない
            assertEquals(1, fakeRepository.callCount)
        }
    }

    @Test
    fun `cache hit with 0 articles emits Empty instead of Content`() = runTest(testDispatcher) {
        fakeRepository.searchResult = emptyList()

        // 初回検索で 0 件
        viewModel.onQuerySubmitted("None")
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(SearchUiState.Empty("None"), viewModel.uiState.value)
        assertEquals(1, fakeRepository.callCount)

        // 2回目のキャッシュアクセス
        viewModel.onQuerySubmitted("None", forceRefresh = false)
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(SearchUiState.Empty("None"), viewModel.uiState.value)
        assertEquals(1, fakeRepository.callCount) // リポジトリ未呼び出し
    }

    @Test
    fun `cache miss or forceRefresh true cancels old search and fetches from repository`() = runTest(testDispatcher) {
        val initialArticles = listOf(Article("1", "Cached"))
        fakeRepository.searchResult = initialArticles

        // 初回
        viewModel.onQuerySubmitted("Tech")
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(1, fakeRepository.callCount)

        // forceRefresh = true で再取得
        val updatedArticles = listOf(Article("2", "Fresh"))
        fakeRepository.searchResult = updatedArticles

        viewModel.uiState.test {
            awaitItem() // 既存の Content

            viewModel.onQuerySubmitted("Tech", forceRefresh = true)

            assertEquals(SearchUiState.Loading, awaitItem())
            testDispatcher.scheduler.advanceUntilIdle()

            val freshContent = awaitItem() as SearchUiState.Content
            assertEquals("Tech", freshContent.query)
            assertEquals(updatedArticles, freshContent.articles)
            assertEquals(false, freshContent.fromCache)
            assertEquals(2, fakeRepository.callCount)
        }
    }

    @Test
    fun `repository error emits Error state with exception message or fallback to Network error`() = runTest(testDispatcher) {
        fakeRepository.exceptionToThrow = IOException("Server 500")

        viewModel.onQuerySubmitted("ErrorQuery")
        testDispatcher.scheduler.advanceUntilIdle()

        val state = viewModel.uiState.value as SearchUiState.Error
        assertEquals("ErrorQuery", state.query)
        assertEquals("Server 500", state.message)

        // メッセージなし例外の場合
        fakeRepository.exceptionToThrow = RuntimeException()
        viewModel.onQuerySubmitted("ErrorQuery2", forceRefresh = true)
        testDispatcher.scheduler.advanceUntilIdle()

        val state2 = viewModel.uiState.value as SearchUiState.Error
        assertEquals("ErrorQuery2", state2.query)
        assertEquals("Network error", state2.message)
    }

    @Test
    fun `new query cancels ongoing search job`() = runTest(testDispatcher) {
        val articles = listOf(Article("1", "Title"))
        fakeRepository.searchResult = articles
        fakeRepository.delayMs = 5000L // 応答に時間がかかるリクエスト

        viewModel.onQuerySubmitted("LongRunning1")
        testDispatcher.scheduler.advanceTimeBy(1000L) // 途中でキャンセル

        fakeRepository.delayMs = 0L
        viewModel.onQuerySubmitted("SecondFast")
        testDispatcher.scheduler.advanceUntilIdle()

        // 古い検索が生きていると、あとから LongRunning1 の結果で上書きされる
        assertEquals(SearchUiState.Content("SecondFast", articles, fromCache = false), viewModel.uiState.value)
        assertEquals(1, fakeRepository.cancelledCount)
    }

    @Test
    fun `short query cancels ongoing search and stays Error`() = runTest(testDispatcher) {
        fakeRepository.searchResult = listOf(Article("1", "Title"))
        fakeRepository.delayMs = 5000L

        viewModel.onQuerySubmitted("LongRunning")
        testDispatcher.scheduler.advanceTimeBy(1000L)

        viewModel.onQuerySubmitted(" a ")
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(SearchUiState.Error("a", "Query too short"), viewModel.uiState.value)
        assertEquals(1, fakeRepository.cancelledCount)
    }

    @Test
    fun `cancelled search is not turned into Error and is not cached`() = runTest(testDispatcher) {
        fakeRepository.searchResult = listOf(Article("1", "Title"))
        fakeRepository.delayMs = 5000L

        viewModel.onQuerySubmitted("Slow")
        testDispatcher.scheduler.advanceTimeBy(1000L)
        viewModel.onQuerySubmitted("x") // 短い語でキャンセルする
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(SearchUiState.Error("x", "Query too short"), viewModel.uiState.value)

        // キャンセルされた検索は成功していないので、同じ語はもう一度リポジトリへ行く
        fakeRepository.delayMs = 0L
        viewModel.onQuerySubmitted("Slow")
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(2, fakeRepository.callCount)
    }

    @Test
    fun `query is trimmed before it reaches the repository and the state`() = runTest(testDispatcher) {
        val articles = listOf(Article("1", "Kotlin Guide"))
        fakeRepository.searchResult = articles

        viewModel.onQuerySubmitted("  Kotlin ")
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(listOf("Kotlin"), fakeRepository.queries)
        assertEquals(SearchUiState.Content("Kotlin", articles, fromCache = false), viewModel.uiState.value)

        // 空白の付き方が違っても、同じ語としてキャッシュに当たる
        viewModel.onQuerySubmitted("Kotlin  ")
        assertEquals(SearchUiState.Content("Kotlin", articles, fromCache = true), viewModel.uiState.value)
        assertEquals(1, fakeRepository.callCount)
    }

    @Test
    fun `failed search is not cached`() = runTest(testDispatcher) {
        fakeRepository.exceptionToThrow = IOException("Server 500")
        viewModel.onQuerySubmitted("Retry")
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(SearchUiState.Error("Retry", "Server 500"), viewModel.uiState.value)

        val articles = listOf(Article("1", "Title"))
        fakeRepository.exceptionToThrow = null
        fakeRepository.searchResult = articles
        viewModel.onQuerySubmitted("Retry")
        testDispatcher.scheduler.advanceUntilIdle()

        assertEquals(2, fakeRepository.callCount)
        assertEquals(SearchUiState.Content("Retry", articles, fromCache = false), viewModel.uiState.value)
    }

    @Test
    fun `clearCache clears all cache and resets state to Idle`() = runTest(testDispatcher) {
        fakeRepository.searchResult = listOf(Article("1", "Title"))
        viewModel.onQuerySubmitted("Hello")
        testDispatcher.scheduler.advanceUntilIdle()
        assertTrue(viewModel.uiState.value is SearchUiState.Content)

        viewModel.clearCache()
        assertEquals(SearchUiState.Idle, viewModel.uiState.value)

        // clearCache 後に同じクエリを実行すると、キャッシュヒットせずリポジトリが再読込される
        viewModel.onQuerySubmitted("Hello")
        testDispatcher.scheduler.advanceUntilIdle()
        assertEquals(2, fakeRepository.callCount)
    }

    private class FakeArticleRepository : ArticleRepository {
        var searchResult: List<Article> = emptyList()
        var exceptionToThrow: Throwable? = null
        var callCount: Int = 0
        var delayMs: Long = 0L
        var cancelledCount: Int = 0
        val queries = mutableListOf<String>()

        override suspend fun searchArticles(query: String): List<Article> {
            callCount++
            queries += query
            if (delayMs > 0L) {
                try {
                    delay(delayMs)
                } catch (e: CancellationException) {
                    cancelledCount++
                    throw e
                }
            }
            exceptionToThrow?.let { throw it }
            return searchResult
        }
    }
}
