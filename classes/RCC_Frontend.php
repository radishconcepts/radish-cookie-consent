<?php

if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'RCC_Frontend' ) ) {

	class RCC_Frontend {

		private $_handle = 'rcc';
		private $_cookie_types = null;

		/**
		 * Main controller
		 */
		public function init() {

			//actions
			add_action( 'init', array( $this, 'load_languagefile' ) );
			add_action( 'init', array( $this, 'init_cookie_types' ) );
			add_action( 'wp_footer', array( $this, 'append_template' ) );
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts_and_styles' ) );
		}

		public function init_cookie_types() {
			$this->_cookie_types = apply_filters( 'rcc_cookie_types', array(
				'functional',
				'analytical',
				'tracking',
				'socialmedia',
				'advertising'
			) );
		}

		public function append_template() {
			global $rcc_settings_labels, $rcc_settings_cookies;

			//get the stored labels
			$rcc_settings        = new RCC_Settings( 'rcc-settings-labels' );
			$rcc_settings_labels = $rcc_settings->get_all_values();

			//get the stored cookie types and the corresponding specs
			$rcc_settings         = new RCC_Settings( 'rcc-settings-cookietypes' );
			$rcc_settings_cookies = $rcc_settings->get_all_values();

			//apply to template (either from this plugin or from parent/child-theme)
			$this->_get_template_part( 'cookiebar' );
		}

		/**
		 * Enqueue assets
		 */
		public function enqueue_scripts_and_styles() {

			//define the appropiate files to enqueue
			if ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) {
				$style_file  = '/assets/css/radish-cookie-consent.css';
				$script_file = '/assets/js/radish-cookie-consent.js';
			} else {
				$style_file  = '/assets/css/radish-cookie-consent.min.css';
				$script_file = '/assets/js/radish-cookie-consent.min.js';
			}

			//enqueue styles with cachebusting
			wp_enqueue_style( $this->_handle, RCC_PLUGIN_URI . $style_file, array(), filemtime( RCC_PLUGIN_PATH . $style_file ), 'screen' );

			//register script with cachebusting
			wp_register_script( $this->_handle, RCC_PLUGIN_URI . $script_file, array( 'jquery' ), filemtime( RCC_PLUGIN_PATH . $script_file ), true );

			//Create an array with some handy dandy parameters for our JS-application
			$radish_cookie_consent = array(
				'cookie_types' => array_map( 'sanitize_title', $this->_cookie_types ),
			);

			//add our localization params to the head
			wp_localize_script( $this->_handle, 'radish_cookie_consent', $radish_cookie_consent );

			//enqueue script
			wp_enqueue_script( $this->_handle );
		}

		/**
		 * Load translations
		 */
		public function load_languagefile() {

			load_plugin_textdomain( $this->_handle, false, RCC_LANGUAGE_PATH );
		}

		/**
		 * Retrieves a template part
		 *
		 * @since v1.5
		 *
		 * Taken from bbPress
		 *
		 * @param string $slug
		 * @param string $name Optional. Default null
		 *
		 * @uses  _locate_template()
		 * @uses  load_template()
		 * @uses  get_template_part()
		 *
		 * @return string The template filename if one is located.
		 */
		private function _get_template_part( $slug, $name = null, $load = true ) {

			// Execute code for this part
			do_action( 'get_template_part_' . $slug, $slug, $name );

			// Setup possible parts
			$templates = array();
			if ( isset( $name ) ) {
				$templates[] = $slug . '-' . $name . '.php';
			}

			$templates[] = $slug . '.php';

			// Allow template parts to be filtered
			$templates = apply_filters( 'rcc_get_template_part', $templates, $slug, $name );

			// Return the part that is found
			return $this->_locate_template( $templates, $load, false );
		}

		/**
		 * Retrieve the name of the highest priority template file that exists.
		 *
		 * Searches in the STYLESHEETPATH before TEMPLATEPATH so that themes which
		 * inherit from a parent theme can just overload one file. If the template is
		 * not found in either of those, it looks in the theme-compat folder last.
		 *
		 * Taken from bbPress
		 *
		 * @since v1.5
		 *
		 * @param string|array $template_names Template file(s) to search for, in order.
		 * @param bool $load If true the template file will be loaded if it is found.
		 * @param bool $require_once Whether to require_once or require. Default true.
		 *                            Has no effect if $load is false.
		 *
		 * @return string The template filename if one is located.
		 */
		private function _locate_template( $template_names, $load = false, $require_once = true ) {

			// No file found yet
			$located = false;

			// Try to find a template file
			foreach ( (array) $template_names as $template_name ) {

				// Continue if template is empty
				if ( empty( $template_name ) ) {
					continue;
				}

				// Trim off any slashes from the template name
				$template_name = ltrim( $template_name, '/' );

				// Check child theme first
				if ( file_exists( trailingslashit( get_stylesheet_directory() ) . 'rcc/' . $template_name ) ) {
					$located = trailingslashit( get_stylesheet_directory() ) . 'rcc/' . $template_name;
					break;

					// Check parent theme next
				} elseif ( file_exists( trailingslashit( get_template_directory() ) . 'rcc/' . $template_name ) ) {
					$located = trailingslashit( get_template_directory() ) . 'rcc/' . $template_name;
					break;

					// Check this plugin's templates folder last
				} elseif ( file_exists( RCC_TEMPLATES_PATH . $template_name ) ) {
					$located = RCC_TEMPLATES_PATH . $template_name;
					break;
				}
			}

			if ( ( true == $load ) && ! empty( $located ) ) {
				load_template( $located, $require_once );
			}

			return $located;
		}
	}
}
