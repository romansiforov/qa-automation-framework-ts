export class StringHelper {
  /**
   * Turns an article title into the slug Conduit puts in the URL.
   * Strips accents, lowercases, trims, drops characters other than letters, digits,
   * spaces, and hyphens, then collapses whitespace into single hyphens.
   * Alphanumeric suffixes from `DataGenerator` are kept. The result is capped at 50
   * characters, which is the slug length Conduit stores, and it stays URL-safe so it
   * matches the decoded `URL.pathname` without extra percent-encoding.
   */
  static getSlugFromTitle(title: string): string {
    const withoutAccents = title.normalize('NFKD').replace(/\p{M}/gu, '');

    return withoutAccents
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 50)
      .replace(/-+$/g, '');
  }

  /**
   * Builds the article path, for example `/article/my-title` when `baseRoute` is `Urls.Article`.
   * The slug is already URL-safe, so this string equals the decoded `URL.pathname`.
   */
  static getArticleUrlByTitle(title: string, baseRoute: string): string {
    const route = baseRoute.replace(/\/+$/, '');
    const slug = StringHelper.getSlugFromTitle(title);
    return `${route}/${slug}`;
  }

  /**
   * First non-empty line. Markdown renders each paragraph as its own element.
   */
  static getFirstBodyLine(body: string): string {
    return (
      body
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line.length > 0) ?? body
    );
  }
}
