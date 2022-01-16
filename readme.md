# MEOM filters

Note: this is **not** a plug and play WordPress plugin which you can just download and activate.

This is more like a starting point for filtering and searching any post types in WordPress. As a starting point check

- `src/markup` folder for markup.
- `src/js` folder for JS.
- `src/css` folder for CSS.

In most cases you probably want to handle markup in your theme or block. Same for JS and CSS although you can `import` assets directly from the plugin.

In other words, this plugin doesn't do anything on front end by default. That's up to your project.

## Dependencies

### PHP

[WP_Query Route To REST API](https://github.com/aucor/wp_query-route-to-rest-api) is the engine of MEOM filters.

It adds new route `/wp-json/wp_query/args/` to REST API. And in JS we can query content with similar logic than in [WP_Query](https://developer.wordpress.org/reference/classes/wp_query/).

Recommended method installing `WP_Query Route To REST API` plugin is using composer.

### JS

- [@wordpress/a11y](https://www.npmjs.com/package/@wordpress/a11y).
- [@wordpress/url](https://www.npmjs.com/package/@wordpress/url).

Recommended method is install those NPM modules in your project.

## Other filtering solutions

[FacetWP](https://facetwp.com/) can be better plug and play solution.