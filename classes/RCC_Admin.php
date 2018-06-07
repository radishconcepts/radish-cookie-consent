<?php

if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'RCC_Admin' ) ) {

	class RCC_Admin {

		private $_capability = 'manage_options';
		private $_tabs = null;
		private $_cookie_types = null;

		/**
		 * Adds the rcc menu to the WP-admin
		 */
		public function init() {

			//make the role filterable for site-owners
			$this->_capability = apply_filters( 'rcc_manage_options', $this->_capability );

			//actions
			add_action( 'init', array( $this, 'init_tabs' ) );
			add_action( 'init', array( $this, 'init_cookie_types' ) );
			add_action( 'admin_menu', array( $this, 'rcc_menu' ) );
			add_action( 'admin_print_scripts', array( $this, 'load_js' ) );
			add_action( 'admin_footer', array( $this, 'admin_footer_js' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_css' ) );

			//filters
			add_filter( 'rcc_cookie_types', array( $this, 'sanitize_cookie_types' ), 9999 );
		}

		public function sanitize_cookie_types($cookie_types) {
			return array_map( 'sanitize_title', $cookie_types );
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

		/**
		 * Enqueue everything (CSS/JS) we need in the backend
		 */
		public function enqueue_admin_css() {
			//load and cache-buste the backend styling
			$file = '/assets/css/rcc-admin-styles.css';
			wp_enqueue_style( 'rcc-admin-styles', RCC_PLUGIN_URI . $file, array(), filemtime( RCC_PLUGIN_PATH . $file ) );
		}

		public function init_tabs() {
			//define all the tabs on our settings page
			$this->_tabs = array(
				'labels'      => __( 'Labels', 'rcc' ),
				'cookietypes' => __( 'Cookie types', 'rcc' ),
			);
		}

		/**
		 * Initialize the admin tabs
		 */
		public function admin_footer_js() {
			?>
            <script>
                jQuery(document).ready(function ($) {
                    $('.rcc-tabs').tabs();
                });
            </script>
			<?php
		}

		/**
		 * Make sure we load de tabs-script
		 */
		public function load_js() {
			wp_enqueue_script( 'jquery-ui-tabs' );
		}

		/**
		 * Adds the different types of menu pages to the WP-admin
		 */
		public function rcc_menu() {

			//add all the menu items
			add_menu_page( __( 'Cookie Consent', 'rcc' ), __( 'Cookie Consent', 'rcc' ), $this->_capability, 'rcc',
				array( $this, 'rcc_main_settings_page' ) );
		}

		/**
		 * Shows the content for the main page
		 */
		public function rcc_main_settings_page() {

			//bail if the user is not allowed to edit this
			if ( ! current_user_can( $this->_capability ) ) {
				wp_die( __( 'You do not have sufficient permissions to access this page.', 'rcc' ) );
			}

			//begin output
			$html = '';
			$html .= '<div class="wrap">';
			$html .= '<h2>' . __( 'Cookie Consent', 'rcc' ) . '</h2>';

			$html .= $this->_create_tabs();

			$html .= '</div>';

			echo $html;
		}

		/**
		 * Create the HTML for all the tabs
		 */
		private function _create_tabs() {

			$html       = '';
			$navigation = '';
			$content    = '';

			if ( is_array( $this->_tabs ) ) {

				$html .= '<div class="rcc-tabs">';

				foreach ( $this->_tabs as $tab_index => $tab_label ) {

					$method_name = '_render_tab_' . $tab_index;

					if ( method_exists( $this, $method_name ) ) {
						$navigation .= '<li><a href="#' . $tab_index . '">' . $tab_label . '</a></li>';
						$content    .= '<div id="' . $tab_index . '">' . call_user_func( array(
								$this,
								$method_name
							) ) . '</div>';
					}
				}

				$html .= '<ul>' . $navigation . '</ul>';
				$html .= $content;

				$html .= '</div><!-- .rcc-tabs -->';
			}

			return $html;
		}


		/**
		 * Shows the content for the 'API' tab, and saves the data upon submit
		 */
		private function _render_tab_cookietypes() {

			$html = '';

			$settings = new RCC_Settings( 'rcc-settings-cookietypes' );

			//save data on submit
			if ( isset( $_POST['rcc-settings-cookietypes-form'] ) && ( $_POST['rcc-settings-cookietypes-form'] == 'true' ) ) {

				if ( isset( $_POST['rcc-cookietypes'] ) && ( is_array( $_POST['rcc-cookietypes'] ) ) ) {

					$new_values = array();
					foreach ( $_POST['rcc-cookietypes'] as $cookie_type => $posted_cookie_type ) {

						$cookie_type_values = array(
							'enabled'            => ( $posted_cookie_type == 'show' ) ? true : false,
							'slug'               => $cookie_type,
							'label'              => sanitize_text_field( $_POST['rcc-cookie-label'][ $cookie_type ] ),
							'checked-by-default' => sanitize_text_field( $_POST['rcc-cookie-checked-by-default'][ $cookie_type ] ),
							'description'        => sanitize_text_field( $_POST['rcc-cookie-description'][ $cookie_type ] ),
						);

						$new_values[ $cookie_type ] = $cookie_type_values;
					}

					$settings->store_options( $new_values );
				}

				$feedback = __( 'The data has been saved', 'rcc' );
			}

			$cookie_types_setting = $settings->get_all_values();

			// header

			$html .= '<p>' . __( 'Which types of cookies should be addressed in the cookie bar?', 'rcc' ) . '</p>';

			if ( isset( $feedback ) ) {
				$html .= '<p class="rcc-saved">' . $feedback . '</p>';
			}

			$html .= '<form method="post" class="rcc-form" action="#cookietypes">';

			$html .= '<input type="hidden" name="rcc-settings-cookietypes-form" value="true">';

			foreach ( $this->_cookie_types as $cookie_type ) {

				$this_cookie_setting = isset( $cookie_types_setting[ $cookie_type ] ) ? $cookie_types_setting[ $cookie_type ] : array();

				$enabled = isset( $this_cookie_setting['enabled'] ) ? $this_cookie_setting['enabled'] : false;
				if ( isset( $this_cookie_setting['checked-by-default'] ) && ( $this_cookie_setting['checked-by-default'] === 'true' ) ) {
					$checked = true;
				} else {
					$checked = false;
				}
				$label       = isset( $this_cookie_setting['label'] ) ? $this_cookie_setting['label'] : '';
				$description = isset( $this_cookie_setting['description'] ) ? $this_cookie_setting['description'] : '';

				$html .= '<h2>' . sprintf( __( '%s cookies', 'rcc' ), ucfirst( $cookie_type ) ) . '</h2>';
				$html .= '<div class="switch-field">';
				$html .= '    <div class="switch-title">' . __( 'Visibility', 'rcc' ) . ':</div>';
				$html .= '      <input ' . checked( true, $enabled, false ) . ' type="radio" class="rcc-radio" name="rcc-cookietypes[' . $cookie_type . ']" id="rcc-cookietypes-' . $cookie_type . '-show" value="show" /><label class="label-radio-inline" for="rcc-cookietypes-' . $cookie_type . '-show">' . __( 'Show', 'rcc' ) . '</label>';
				$html .= '      <input ' . checked( false, $enabled, false ) . ' type="radio" class="rcc-radio" name="rcc-cookietypes[' . $cookie_type . ']" id="rcc-cookietypes-' . $cookie_type . '-hide" value="hide" /><label class="label-radio-inline" for="rcc-cookietypes-' . $cookie_type . '-hide">' . __( 'Hide', 'rcc' ) . '</label>';
				$html .= '</div>';

				$html .= '<div class="switch-field">';
				$html .= '    <div class="switch-title">' . __( 'Checked by default', 'rcc' ) . ':</div>';
				$html .= '      <input ' . checked( true, $checked, false ) . ' type="radio" class="rcc-radio" name="rcc-cookie-checked-by-default[' . $cookie_type . ']" id="rcc-cookie-checked-by-default-' . $cookie_type . '-true" value="true" /><label class="label-radio-inline" for="rcc-cookie-checked-by-default-' . $cookie_type . '-true">' . __( 'Checked', 'rcc' ) . '</label>';
				$html .= '      <input ' . checked( false, $checked, false ) . ' type="radio" class="rcc-radio" name="rcc-cookie-checked-by-default[' . $cookie_type . ']" id="rcc-cookie-checked-by-default-' . $cookie_type . '-false" value="false" /><label class="label-radio-inline" for="rcc-cookie-checked-by-default-' . $cookie_type . '-false">' . __( 'Unchecked', 'rcc' ) . '</label>';
				$html .= '</div>';

				$html .= '<p>';
				$html .= '<label for="rcc-cookie-label">' . __( 'Label', 'rcc' ) . '</label><br />';
				$html .= '<input type="text" class="rcc-input" name="rcc-cookie-label[' . $cookie_type . ']" value="' . esc_attr( $label ) . '" /><br />';
				$html .= '</p>';

				$html .= '<p>';
				$html .= '<label for="rcc-cookie-description">' . __( 'Description', 'rcc' ) . '</label><br />';
				$html .= '<textarea class="rcc-input" name="rcc-cookie-description[' . $cookie_type . ']">' . $description . '</textarea><br />';
				$html .= '</p>';

				$html .= '<hr />';
			}

			$html .= '<hr />';
			$html .= '<p class="submit">';
			$html .= '<input type="submit" name="Submit" class="button-primary" value="' . __( 'Save changes', 'rcc' ) . '" />';
			$html .= '</p>';
			$html .= '</form>';

			return $html;
		}

		/**
		 * Shows the content for the 'API' tab, and saves the data upon submit
		 */
		private function _render_tab_labels() {

			$settings = new RCC_Settings( 'rcc-settings-labels' );

			//save data on submit
			if ( isset( $_POST['rcc-settings-labels-form'] ) && ( $_POST['rcc-settings-labels-form'] == 'true' ) ) {

				//sanitize submitted data
				$title                     = isset( $_POST['rcc-title'] ) ? sanitize_text_field( $_POST['rcc-title'] ) : '';
				$content                   = isset( $_POST['rcc-content'] ) ? sanitize_text_field( $_POST['rcc-content'] ) : '';
				$approve_btn_label         = isset( $_POST['rcc-approve-btn-label'] ) ? sanitize_text_field( $_POST['rcc-approve-btn-label'] ) : '';
				$settings_btn_label        = isset( $_POST['rcc-settings-btn-label'] ) ? sanitize_text_field( $_POST['rcc-settings-btn-label'] ) : '';
				$toggle_settings_btn_label = isset( $_POST['rcc-toggle-settings-btn-label'] ) ? sanitize_text_field( $_POST['rcc-toggle-settings-btn-label'] ) : '';
				$cancel_btn_label          = isset( $_POST['rcc-cancel-btn-label'] ) ? sanitize_text_field( $_POST['rcc-cancel-btn-label'] ) : '';
				$read_more_link            = isset( $_POST['rcc-read-more-link'] ) ? esc_url( $_POST['rcc-read-more-link'] ) : '';
				$read_more_text            = isset( $_POST['rcc-read-more-text'] ) ? sanitize_text_field( $_POST['rcc-read-more-text'] ) : '';

				//store it
				$settings->store_options( array(
					'title'                     => $title,
					'content'                   => $content,
					'approve-btn-label'         => $approve_btn_label,
					'settings-btn-label'        => $settings_btn_label,
					'toggle-settings-btn-label' => $toggle_settings_btn_label,
					'cancel-btn-label'          => $cancel_btn_label,
					'read-more-link'            => $read_more_link,
					'read-more-text'            => $read_more_text,
				) );

				$feedback = __( 'The data has been saved', 'rcc' );
			}

			//begin output
			$html = '';

			// header
			$html .= '<h2>' . __( 'Labels', 'rcc' ) . '</h2>';

			if ( isset( $feedback ) ) {
				$html .= '<p class="rcc-saved">' . $feedback . '</p>';
			}

			$html .= '<form method="post" class="rcc-form" action="#labels">';

			$html .= '<input type="hidden" name="rcc-settings-labels-form" value="true">';

			$html .= '<p>';
			$html .= '<label for="rcc-title">' . __( 'Title', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-title" value="' . esc_attr( $settings->get_option( 'title' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-content">' . __( 'Content', 'rcc' ) . '</label><br />';
			$html .= '<textarea type="text" class="rcc-input" name="rcc-content" >' . stripslashes( $settings->get_option( 'content' ) ) . '</textarea><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-approve-btn-label">' . __( 'Approve button label', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-approve-btn-label" value="' . esc_attr( $settings->get_option( 'approve-btn-label' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-settings-btn-label">' . __( 'Settings button label', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-settings-btn-label" value="' . esc_attr( $settings->get_option( 'settings-btn-label' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-toggle-settings-btn-label">' . __( 'Toggle settings button label', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-toggle-settings-btn-label" value="' . esc_attr( $settings->get_option( 'toggle-settings-btn-label' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-cancel-btn-label">' . __( 'Cancel button label', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-cancel-btn-label" value="' . esc_attr( $settings->get_option( 'cancel-btn-label' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-read-more-link">' . __( 'Read more link', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-read-more-link" value="' . esc_attr( $settings->get_option( 'read-more-link' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<p>';
			$html .= '<label for="rcc-read-more-text">' . __( 'Read more text', 'rcc' ) . '</label><br />';
			$html .= '<input type="text" class="rcc-input" name="rcc-read-more-text" value="' . esc_attr( $settings->get_option( 'read-more-text' ) ) . '" /><br />';
			$html .= '</p>';

			$html .= '<hr />';
			$html .= '<p class="submit">';
			$html .= '<input type="submit" name="Submit" class="button-primary" value="' . __( 'Save changes', 'rcc' ) . '" />';
			$html .= '</p>';
			$html .= '</form>';

			return $html;
		}
	}

	/*
	 *
	 		$html .= '<p>';
			$html .= '<label for="cache-time">' . __( 'Cache time (minutes):', 'rcc' ) . '</label><br />';
			$html .= '<input type="number" min="0" class="rcc-input" name="cache-time" value="' . esc_attr( $settings->get_option( 'cache-time' ) ) . '" /><br />';
			$html .= '<small>' . __( 'Enter 0 to disable cache', 'rcc' ) . '</small>';
			$html .= '</p>';
	 */
}
