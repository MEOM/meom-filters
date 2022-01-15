<?php
/**
 * Partial for displaying filters.
 *
 * @package Kala
 */
?>

<div class="filters top-margin js-filters">
    <h2><?php esc_html_e( 'Filter and search', 'meom-filters' ); ?></h2>

    <?php
    $tax_filters = [
        'category',
    ];
    ?>

    <form class="filters__terms top-margin animated js-filters-terms">
        <?php
        foreach ( $tax_filters as $tax_filter ) :
            // Get terms.
            $filter_terms = get_terms(
                array(
                    'taxonomy' => $tax_filter,
                )
            );

            if ( ! empty( $filter_terms ) && ! is_wp_error( $filter_terms ) ) :
                ?>
                <fieldset class="filters__fieldset">
                    <legend>
                        <h2 class=""><?php echo esc_html( get_taxonomy( $tax_filter )->label ); ?></h2>
                    </legend>
                    <?php
                    foreach ( $filter_terms as $filter_term ) : ?>
                        <div class="filters__input-wrapper">
                            <input class="filters__tax-input filters__tax-<?php echo esc_attr( $tax_filter ); ?> js-filters-tax-<?php echo esc_attr( $tax_filter ); ?>" type="checkbox" id="filter-tax-<?php echo esc_attr( $filter_term->slug ); ?>" value="<?php echo esc_attr( $filter_term->slug ); ?>">
                            <label class="filters__tax-label" for="filter-tax-<?php echo esc_attr( $filter_term->slug ); ?>">
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
        <input class="filters__search-field js-filters-search-field" type="search" id="filters-search" name="s" />

        <label for="filters-order-select" class="filter__label"><?php esc_html_e( 'Order by', 'meom-filters' ); ?></label>
        <select class="filters__order-select js-filters-order-select" id="filters-order-select">
            <option value="newest-first" selected><?php esc_html_e( 'Newest first', 'meom-filters' ); ?></option>
            <option value="oldest-first"><?php esc_html_e( 'Oldest first', 'meom-filters' ); ?></option>
            <option value="title-asc"><?php esc_html_e( 'By title asc', 'meom-filters' ); ?></option>
            <option value="title-desc"><?php esc_html_e( 'By title desc', 'meom-filters' ); ?></option>
        </select>

        <button type="submit" class="filters__submit btn is-style-button-black js-filters-submit">
            <?php esc_attr_e( 'Show results', 'meom-filters' ); ?><span class="filters__submit-count js-filters-submit-count"> (4)</span>
        </button>
    </form>
</div>

<div class="filters-items top-margin js-filters-items">
    <?php get_template_part( 'partials/filters/spinner' ); ?>

    <div class="filters-items__content js-filters-items-content"></div>
</div>

<div class="filters__items_load-more-wrapper">
    <button class="filters-items__load-more btn is-style-button-black js-filters-items-load-more" type="button">
        <?php esc_html_e( 'Load more houses', 'meom-filters' ); ?>
    </button>
</div>
