// Payload for creating an article
export interface CreateArticlePayload {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

// Shape of a single article in the server response
export interface ArticleData {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
}

// Server response when creating or fetching a single article
export interface ArticleResponse {
  article: ArticleData;
}

// Server response when fetching a list of articles
export interface MultipleArticlesResponse {
  articles: ArticleData[];
  articlesCount: number;
}
