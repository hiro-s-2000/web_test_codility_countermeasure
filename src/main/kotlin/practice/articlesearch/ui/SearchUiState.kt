package practice.articlesearch.ui

import practice.articlesearch.model.Article

sealed interface SearchUiState {
    object Idle : SearchUiState
    object Loading : SearchUiState
    data class Content(
        val query: String,
        val articles: List<Article>,
        val fromCache: Boolean
    ) : SearchUiState
    data class Empty(val query: String) : SearchUiState
    data class Error(val query: String, val message: String) : SearchUiState
}
