package practice.searchpresenter.ui

import java.util.concurrent.CancellationException
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test
import practice.searchpresenter.data.ArticleSearchRepository
import practice.searchpresenter.model.ArticleItem

class SearchPresenterTemplateTest {

    private class FakeRepository : ArticleSearchRepository {
        val queries = mutableListOf<String>()
        var result: List<ArticleItem> = emptyList()
        var failure: Throwable? = null
        // 検索の最中に画面の状態を見るための差し込み口
        var onSearch: () -> Unit = {}

        override fun search(query: String): List<ArticleItem> {
            queries += query
            onSearch()
            failure?.let { throw it }
            return result
        }
    }

    private val kotlinArticle = ArticleItem(1, "Kotlin")
    private val flowArticle = ArticleItem(2, "Flow")

    private val repo = FakeRepository()
    private val presenter = SearchPresenterTemplate(repo)

    @Test
    fun `initial state is Idle`() {
        assertSame(SearchUiState.Idle, presenter.st)
        assertTrue(repo.queries.isEmpty())
    }

    @Test
    fun `st cannot be assigned from outside`() {
        // private set はコンパイル時の決まりなので、公開の setter が無いことを見る
        val publicSetters = SearchPresenterTemplate::class.java.methods.filter { it.name == "setSt" }
        assertTrue(publicSetters.isEmpty())
    }

    @Test
    fun `whitespace only input is Idle and does not search`() {
        presenter.onQueryChanged("    ")

        assertSame(SearchUiState.Idle, presenter.st)
        assertTrue(repo.queries.isEmpty())
    }

    @Test
    fun `query shorter than 2 after trim returns to Idle and does not search`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")
        repo.queries.clear()

        presenter.onQueryChanged("  k  ")

        assertSame(SearchUiState.Idle, presenter.st)
        assertTrue(repo.queries.isEmpty())
    }

    @Test
    fun `empty input returns to Idle`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")

        presenter.onQueryChanged("")

        assertSame(SearchUiState.Idle, presenter.st)
    }

    @Test
    fun `query of exactly 2 characters is searched`() {
        repo.result = listOf(kotlinArticle)

        presenter.onQueryChanged("ko")

        assertEquals(listOf("ko"), repo.queries)
        assertEquals(SearchUiState.Content("ko", listOf(kotlinArticle), fromCache = false), presenter.st)
    }

    @Test
    fun `query is trimmed before searching and in the resulting state`() {
        repo.result = listOf(kotlinArticle)

        presenter.onQueryChanged("  kotlin \n")

        assertEquals(listOf("kotlin"), repo.queries)
        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = false), presenter.st)
    }

    @Test
    fun `uncached query is Loading while the repository is searching`() {
        repo.result = listOf(kotlinArticle)
        var during: SearchUiState? = null
        repo.onSearch = { during = presenter.st }

        presenter.onQueryChanged("kotlin")

        assertSame(SearchUiState.Loading, during)
    }

    @Test
    fun `uncached query with results becomes Content not from cache`() {
        repo.result = listOf(kotlinArticle, flowArticle)

        presenter.onQueryChanged("kotlin")

        assertEquals(
            SearchUiState.Content("kotlin", listOf(kotlinArticle, flowArticle), fromCache = false),
            presenter.st
        )
    }

    @Test
    fun `uncached query with no results becomes Empty`() {
        repo.result = emptyList()

        presenter.onQueryChanged("kotlin")

        assertEquals(SearchUiState.Empty("kotlin"), presenter.st)
    }

    @Test
    fun `second search of the same query is Content from cache without calling the repository`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")

        presenter.onQueryChanged("kotlin")

        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = true), presenter.st)
        assertEquals(listOf("kotlin"), repo.queries)
    }

    @Test
    fun `same query with different surrounding whitespace hits the cache`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")

        presenter.onQueryChanged("  kotlin  ")

        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = true), presenter.st)
        assertEquals(1, repo.queries.size)
    }

    @Test
    fun `cached empty result is Empty without calling the repository`() {
        repo.result = emptyList()
        presenter.onQueryChanged("kotlin")
        // 保存を使わず再検索したら Content になるようにしておく
        repo.result = listOf(kotlinArticle)

        presenter.onQueryChanged("kotlin")

        assertEquals(SearchUiState.Empty("kotlin"), presenter.st)
        assertEquals(1, repo.queries.size)
    }

    @Test
    fun `different query is not served from another query's cache`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")
        repo.result = listOf(flowArticle)

        presenter.onQueryChanged("flow")

        assertEquals(SearchUiState.Content("flow", listOf(flowArticle), fromCache = false), presenter.st)
        assertEquals(listOf("kotlin", "flow"), repo.queries)
    }

    @Test
    fun `saved list is a copy so later mutation of the returned list changes neither shown nor cached result`() {
        val returned = mutableListOf(kotlinArticle)
        repo.result = returned
        presenter.onQueryChanged("kotlin")

        returned.add(flowArticle)

        // いま表示している結果
        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = false), presenter.st)
        // 保存から出し直した結果
        presenter.onQueryChanged("kotlin")
        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = true), presenter.st)
    }

    @Test
    fun `saved list is a copy so clearing the returned list does not turn the cached result into Empty`() {
        val returned = mutableListOf(kotlinArticle)
        repo.result = returned
        presenter.onQueryChanged("kotlin")

        returned.clear()
        presenter.onQueryChanged("kotlin")

        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = true), presenter.st)
    }

    @Test
    fun `failed search becomes Error for the trimmed query`() {
        repo.failure = IllegalStateException("boom")

        presenter.onQueryChanged(" kotlin ")

        val state = presenter.st
        assertTrue("expected Error but was $state", state is SearchUiState.Error)
        assertEquals("kotlin", (state as SearchUiState.Error).query)
        assertEquals("boom", state.message)
    }

    @Test
    fun `failed search is not saved so the next search hits the repository again`() {
        repo.failure = IllegalStateException("boom")
        presenter.onQueryChanged("kotlin")
        repo.failure = null
        repo.result = listOf(kotlinArticle)

        presenter.onQueryChanged("kotlin")

        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = false), presenter.st)
        assertEquals(2, repo.queries.size)
    }

    @Test
    fun `cancellation is rethrown as is and the state is not Error`() {
        val cancellation = CancellationException("cancelled")
        repo.failure = cancellation

        try {
            presenter.onQueryChanged("kotlin")
            fail("CancellationException should be rethrown")
        } catch (e: CancellationException) {
            assertSame(cancellation, e)
        }

        assertFalse(presenter.st is SearchUiState.Error)
    }

    @Test
    fun `clearCache returns to Idle`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")

        presenter.clearCache()

        assertSame(SearchUiState.Idle, presenter.st)
    }

    @Test
    fun `after clearCache the same query is searched again and is not from cache`() {
        repo.result = listOf(kotlinArticle)
        presenter.onQueryChanged("kotlin")
        presenter.clearCache()
        var during: SearchUiState? = null
        repo.onSearch = { during = presenter.st }

        presenter.onQueryChanged("kotlin")

        assertEquals(2, repo.queries.size)
        assertSame(SearchUiState.Loading, during)
        assertEquals(SearchUiState.Content("kotlin", listOf(kotlinArticle), fromCache = false), presenter.st)
    }
}
