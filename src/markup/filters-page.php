<?php
/**
 * Partial for displaying filters for `page` post type.
 *
 * @package MEOMFilters
 */
?>

<div class="filters top-margin" data-meom-filters="filters">
    <h2><?php esc_html_e( 'Filter and search', 'meom-filters' ); ?></h2>

    <?php
        $config = function_exists( 'MEOMFilters\filters_config' ) ? MEOMFilters\filters_config() : '';
    ?>

    <form class="filters__form top-margin animated" data-meom-filters="form" data-meom-filters-post-type="page">
        <input type="hidden" name="language_code" value="<?php echo esc_attr( get_locale() ); ?>">
        <?php if ( function_exists( 'pll_current_language' ) ) : ?>
            <input type="hidden" name="lang" value="<?php echo esc_attr( pll_current_language() ); ?>">
        <?php endif; ?>

        <label class="filter__label" for="filters-search">
            <?php echo esc_html_x( 'Search', 'search label', 'meom-filters' ); ?>
        </label>
        <input class="filters__search-field" type="search" id="filters-search" name="<?php echo esc_attr( $config['search']['name'] ); ?>" data-meom-filters="search">

        <label for="filters-order" class="filter__label"><?php esc_html_e( 'Order by', 'meom-filters' ); ?></label>
        <select class="filters__order" id="filters-order" data-meom-filters="order" name="<?php echo esc_attr( $config['page']['order']['name'] ); ?>">
            <?php foreach ( $config['page']['order']['options'] as $option ) : ?>
                <option value="<?php echo esc_attr( $option['value'] ); ?>"><?php echo esc_html( $option['label'] ); ?></option>
            <?php endforeach; ?>
        </select>

        <button type="submit" class="filters__submit btn is-style-button-black" data-meom-filters="submit">
            <?php esc_attr_e( 'Show results', 'meom-filters' ); ?><span class="filters__submit-count" data-meom-filters="submit-count"> (4)</span>
        </button>
    </form>

    <div class="filters__selected" data-meom-filters="selected"></div>
</div>

<div class="filters-items top-margin" data-meom-filters="items">
    <?php get_template_part( 'partials/filters/spinner' ); ?>

    <div class="filters-items__content" data-meom-filters="items-content"></div>
</div>

<div class="filters__items_load-more-wrapper">
    <button class="filters-items__load-more btn" type="button" data-meom-filters="load-more">
        <?php esc_html_e( 'Load more', 'meom-filters' ); ?>
    </button>
</div>
