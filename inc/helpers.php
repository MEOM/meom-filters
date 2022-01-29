<?php
/**
 * Helper function.
 *
 * @package MEOMFilters
 *
 * @link https://github.com/aucor/wp_query-route-to-rest-api
 */

namespace MEOMFilters;

/**
 * Get filters config from JSON.
 *
 * @return mixed Decoded JSON string.
 */
function filters_config() {
    $config_json = file_get_contents( __DIR__ . '/../filters-config.json' );
    $config      = json_decode( $config_json, true );

    return $config;
}
