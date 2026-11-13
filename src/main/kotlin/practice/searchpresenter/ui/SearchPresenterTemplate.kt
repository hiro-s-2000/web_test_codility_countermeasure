package practice.searchpresenter.ui

import java.util.concurrent.CancellationException
import java.util.concurrent.ConcurrentHashMap
import practice.searchpresenter.data.ArticleSearchRepository
import practice.searchpresenter.model.ArticleItem

private const val MIN_LEN = 2

class SearchPresenterTemplate(private val repo: ArticleSearchRepository) {
    private val mp = ConcurrentHashMap<String, List<ArticleItem>>()

    var st: SearchUiState = SearchUiState.Idle
        private set // 外から代入させない

    fun onQueryChanged(raw: String) {
        val q = raw.trim()
        if (q.length < MIN_LEN) {
            st = SearchUiState.Idle
            return
        }
        // 保存済みなら Loading を挟まず返す
        val hit = mp[q]
        if (hit != null) {
            st = if (hit.isEmpty()) SearchUiState.Empty(q)
            else SearchUiState.Content(q, hit, fromCache = true)
            return
        }
        st = SearchUiState.Loading
        try {
            // 呼び出し側があとでリストを書き換えても保存が変わらないようにコピーする
            val res = repo.search(q).toList()
            mp[q] = res
            st = if (res.isEmpty()) SearchUiState.Empty(q)
            else SearchUiState.Content(q, res, fromCache = false)
        } catch (e: CancellationException) {
            throw e // 取り消しは失敗ではないので Error にしない
        } catch (e: Exception) {
            st = SearchUiState.Error(q, e.message ?: "Unknown error")
        }
    }

    fun clearCache() {
        mp.clear()
        st = SearchUiState.Idle
    }
}
