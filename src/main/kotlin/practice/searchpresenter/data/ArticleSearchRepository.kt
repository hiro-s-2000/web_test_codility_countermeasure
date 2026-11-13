package practice.searchpresenter.data

import practice.searchpresenter.model.ArticleItem

interface ArticleSearchRepository {
    fun search(query: String): List<ArticleItem>
}
