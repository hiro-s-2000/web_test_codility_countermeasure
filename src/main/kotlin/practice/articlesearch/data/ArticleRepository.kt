package practice.articlesearch.data

import practice.articlesearch.model.Article

interface ArticleRepository {
    suspend fun searchArticles(query: String): List<Article>
}
