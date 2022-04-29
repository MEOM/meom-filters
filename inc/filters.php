<?php
/**
 * Filters WP Query routes.
 *
 * @package MEOMFilters
 *
 * @link https://github.com/aucor/wp_query-route-to-rest-api
 */

namespace MEOMFilters;

/**
 * Modify default data.
 *
 * @param array $data Default data.
 * @return array Modified default data.
 */
function default_data( $data ) {
    $data = array(
        'html'     => false,
        'messages' => [
            'empty'   => esc_html__( 'No results found.', 'meom-filters' ),
            'success' => esc_html__( 'Filters applied successfully.', 'meom-filters' ),
        ],
    );

    return $data;
}
add_filter( 'wp_query_route_to_rest_api_default_data', __NAMESPACE__ . '\default_data' );

// Remove unneeded REST API hooks from the plugin.
add_filter( 'wp_query_route_to_rest_api_update_post_type_meta', '__return_false' );
add_filter( 'wp_query_route_to_rest_api_use_parent_class', '__return_false' );

/**
 * Modify data to return HTML.
 *
 * @param array  $data Data inside loop.
 * @param object $wp_query WP Query.
 * @param array  $args Arguments.
 * @return array Modified data.
 */
function modify_data( $data, $wp_query, $args ) {
    if ( ! empty( $wp_query->posts ) ) {
        $html = '';

        ob_start();

        global $post;

        foreach ( $wp_query->posts as $the_post ) {
            $post = $the_post; // phpcs:ignore

            // Build logic for this where you pull your HTML markup.
            // Can be any post type and any template file.
            if ( 'post' === $args['post_type'] ) {
                get_template_part( 'partials/post/post-item' );
            } elseif ( 'page' === $args['post_type'] ) {
                get_template_part( 'partials/post/post-item' );
            }
        }

        $html .= ob_get_clean();

        $data['html'] = $html;

        wp_reset_postdata();
    }

    return $data;
}
add_filter( 'wp_query_route_to_rest_api_after_loop_data', __NAMESPACE__ . '\modify_data', 10, 3 );
