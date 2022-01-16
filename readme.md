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

## General logic

General logic of MEOM filters is returning `HTML` from the REST queries. Which means we can use same template files as in PHP.

This saves a little bit of time when same markup can be used in PHP and in JS filtering logic.

## How to start modifying PHP

First, check `inc/filters.php` file. 

### Default data
From `default_data` you might want to change `empty` message.

### Change template file used in JS filtering
Locate code:
```php
// Build logic for this where you pull your HTML markup.
// Can be any post type and any template file.
if ( 'post' === $args['post_type'] ) {
    get_template_part( 'partials/post/post-item' );
}
```

In here change any template file from your theme or add any new post types your are filtering in your project.

For example:
```php
if ( 'product' === $args['post_type'] ) {
    get_template_part( 'partials/post/product-item' );
} else {
    get_template_part( 'partials/post/default-item' );
}
```

## How to start modifying markup and JS

- `src/markup/filters.php` file for markup.
- `src/js/meom-filters.js` file for JS.

In markup there are data attributes `data-meom-filters` which we use in JS. For example

- `data-meom-filters="form"` for filters form.
- `data-meom-filters="items-content"` where the query results are generated.

Feel free to change this logic using classes if needed.

Search for other `data-meom-filters` attributes to get an idea where they are used in HTML and in JS.

## General JS logic for filtering

Aucor WP_Query enables similar logic for REST JS queries. Therefore object called `args` looks similar than in PHP. 

```js
// Default filter arguments.
const args = {
    post_type: postType,
    posts_per_page: 4,
    paged: 1,
};
```

In the end these arguments are passed into endpoint using `fetch` JS API. And it returns HTML markup from wanted template file. Remember `inc/filters.php` file mentioned before.

Add any new arguments to `args` object. For example filter by `category`:

```js
const allCategories = getCheckedCheckboxes(
    'input[type="checkbox"][data-meom-filters="tax-category"]'
);
args.tax_query.push({
    taxonomy: 'category',
    field: 'slug',
    terms: allCategories,
});
```

Add any new taxonomy arguments using the same logic.

### State is in the URL query parameters
In the same time we add query arguments, we also update object `urlObject`. And update URL query parameters based on this.

This means that you can share the URL or refresh the page, and the query still works.

Check `initFilters` function where we update checkboxes or other fields based on URL. 

Add any new taxonomy checks using the same logic as seen inside the `initFilters` function.

## Other filtering solutions

[FacetWP](https://facetwp.com/) can be better plug and play solution.
