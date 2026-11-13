package practice.articlesearch.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import practice.articlesearch.data.ArticleRepository
import practice.articlesearch.model.Article

class ArticleSearchViewModel(
    private val repository: ArticleRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<SearchUiState>(SearchUiState.Idle)
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()

    // 成功結果を保持するインメモリキャッシュ（クエリ -> 記事リスト）
    private val cache = mutableMapOf<String, List<Article>>()

    // 進行中の検索 Coroutine Job
    private var searchJob: Job? = null

    /**
     * クエリが送信されたときの処理
     * @param rawQuery 前後空白を含む可能性のある検索文字列
     * @param forceRefresh キャッシュを無視して再取得するかどうか（既定値: false）
     */
    fun onQuerySubmitted(rawQuery: String, forceRefresh: Boolean = false) {
        val trimmedQuery = rawQuery.trim()

        // 1. trim 後が 2 文字未満ならエラー
        if (trimmedQuery.length < 2) {
            searchJob?.cancel()
            _uiState.value = SearchUiState.Error(trimmedQuery, "Query too short")
            return
        }

        // 2. キャッシュヒット かつ forceRefresh が false の場合
        if (!forceRefresh && cache.containsKey(trimmedQuery)) {
            searchJob?.cancel()
            val cachedList = cache[trimmedQuery].orEmpty()
            _uiState.value = if (cachedList.isEmpty()) {
                SearchUiState.Empty(trimmedQuery)
            } else {
                SearchUiState.Content(trimmedQuery, cachedList, fromCache = true)
            }
            return
        }

        // 3. キャッシュミス、または forceRefresh が true の場合
        searchJob?.cancel()
        searchJob = viewModelScope.launch {
            _uiState.value = SearchUiState.Loading
            try {
                val list = repository.searchArticles(trimmedQuery)
                // 成功結果をキャッシュ
                cache[trimmedQuery] = list

                _uiState.value = if (list.isEmpty()) {
                    SearchUiState.Empty(trimmedQuery)
                } else {
                    SearchUiState.Content(trimmedQuery, list, fromCache = false)
                }
            } catch (e: CancellationException) {
                // CancellationException はコルーチンのキャンセル機構のため再スロー
                throw e
            } catch (e: Throwable) {
                val errorMessage = e.message ?: "Network error"
                _uiState.value = SearchUiState.Error(trimmedQuery, errorMessage)
            }
        }
    }

    /**
     * キャッシュを全消去し、状態を Idle にリセット
     */
    fun clearCache() {
        searchJob?.cancel()
        cache.clear()
        _uiState.value = SearchUiState.Idle
    }
}
