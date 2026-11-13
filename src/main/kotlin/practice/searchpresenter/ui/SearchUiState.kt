package practice.searchpresenter.ui

import practice.searchpresenter.model.ArticleItem

sealed interface SearchUiState {
    object Idle : SearchUiState
    object Loading : SearchUiState
    data class Content(
        val query: String,
        val articles: List<ArticleItem>,
        val fromCache: Boolean
    ) : SearchUiState
    data class Empty(val query: String) : SearchUiState
    data class Error(val query: String, val message: String) : SearchUiState
}
