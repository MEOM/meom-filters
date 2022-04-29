<?php
/**
 * Partial for displaying filters.
 *
 * @package MEOMFilters
 */
?>

<div class="filters top-margin" data-meom-filters="filters">
    <h2><?php esc_html_e( 'Filter and search', 'meom-filters' ); ?></h2>

    <?php
        $config = function_exists( 'MEOMFilters\filters_config' ) ? MEOMFilters\filters_config() : '';
    ?>

    <form class="filters__form top-margin animated" data-meom-filters="form" data-meom-filters-post-type="post">
        <input type="hidden" name="language_code" value="<?php echo esc_attr( get_locale() ); ?>">
        <?php if ( function_exists( 'pll_current_language' ) ) : ?>
            <input type="hidden" name="lang" value="<?php echo esc_attr( pll_current_language() ); ?>">
        <?php endif;

        foreach ( $config['post']['tax_query'] as $tax_filter ) :
            // Get terms.
            $filter_terms = get_terms(
                array(
                    'taxonomy' => $tax_filter['taxonomy'],
                )
            );

            if ( ! empty( $filter_terms ) && ! is_wp_error( $filter_terms ) ) :
                ?>
                <fieldset class="filters__fieldset">
                    <legend>
                        <h2 class=""><?php echo esc_html( get_taxonomy( $tax_filter['taxonomy'] )->label ); ?></h2>
                    </legend>
                    <?php
                    foreach ( $filter_terms as $filter_term ) : ?>
                        <div class="filters__input-wrapper">
                            <input
                                class="filters__tax-input filters__tax-<?php echo esc_attr( $tax_filter['taxonomy'] ); ?>"
                                type="checkbox"
                                id="filter-tax-<?php echo esc_attr( $tax_filter['taxonomy'] ); ?>-<?php echo esc_attr( $filter_term->slug ); ?>"
                                value="<?php echo esc_attr( $filter_term->slug ); ?>"
                                data-meom-filters="tax-<?php echo esc_attr( $tax_filter['taxonomy'] ); ?>"
                                name="<?php echo esc_attr( $tax_filter['name'] ); ?>"
                                >
                            <label class="filters__tax-label" for="filter-tax-<?php echo esc_attr( $tax_filter['taxonomy'] ); ?>-<?php echo esc_attr( $filter_term->slug ); ?>">
                                <?php echo esc_attr( $filter_term->name ); ?>
                            </label>
                        </div>
                        <?php
                    endforeach; ?>
                </fieldset>
                <?php
            endif;
        endforeach;
        ?>

        <label class="filter__label" for="filters-search">
            <?php echo esc_html_x( 'Search', 'search label', 'meom-filters' ); ?>
        </label>
        <input class="filters__search-field" type="search" id="filters-search" name="<?php echo esc_attr( $config['search']['name'] ); ?>" data-meom-filters="search">

        <label for="filters-order" class="filter__label"><?php esc_html_e( 'Order by', 'meom-filters' ); ?></label>
        <select class="filters__order" id="filters-order" data-meom-filters="order" name="<?php echo esc_attr( $config['post']['order']['name'] ); ?>">
            <?php foreach ( $config['post']['order']['options'] as $option ) : ?>
                <option value="<?php echo esc_attr( $option['value'] ); ?>"><?php echo esc_html( $option['label'] ); ?></option>
            <?php endforeach; ?>
        </select>

        <button type="submit" class="filters__submit btn is-style-button-black" data-meom-filters="submit">
            <?php esc_attr_e( 'Show results', 'meom-filters' ); ?><span class="filters__submit-count" data-meom-filters="submit-count"> (4)</span>
        </button>
    </form>
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
