/**
 * Algolia DocSearch Configuration
 *
 * DocSearch is a free search service by Algolia for documentation and open-source
 * projects. For commercial sites, you need either:
 * 1. Apply for free DocSearch at https://docsearch.algolia.com/apply/
 *    (typically approved for docs, open-source, and educational sites)
 * 2. Use Algolia's paid plans with InstantSearch
 *
 * To enable DocSearch:
 * 1. Apply at https://docsearch.algolia.com/apply/ with your site URL
 * 2. Once approved, Algolia will email you the credentials
 * 3. Fill in the values below
 * 4. Set enabled to true
 * 5. Uncomment the AlgoliaDocSearch component in Layout.astro
 *
 * For igawo.pl:
 * - Site URL: https://igawo.pl
 * - Since this is a commercial site, free DocSearch may not be approved.
 * - Consider Algolia's "Search" paid plan as an alternative.
 */

export const algoliaConfig = {
  enabled: false,
  appId: '',      // e.g. 'R2IYF7EK7D'
  apiKey: '',     // Search-only API key
  indexName: '',  // e.g. 'igawo'
  placeholder: {
    pl: 'Szukaj w dokumentacji...',
    en: 'Search documentation...',
    de: 'In der Dokumentation suchen...',
  },
};

/**
 * Alternative: Algolia InstantSearch (paid)
 * If DocSearch is not available, you can use Algolia's InstantSearch
 * with a custom index. This requires:
 * 1. An Algolia account (https://www.algolia.com/)
 * 2. Creating an index and uploading your content
 * 3. Installing algoliasearch + react-instantsearch
 *
 * The Pagefind internal search (already implemented) works without
 * any external service and is recommended as the primary search.
 * Algolia can be enabled as an upgrade path for more advanced features.
 */
