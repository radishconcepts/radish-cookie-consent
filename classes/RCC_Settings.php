<?php

if ( ! function_exists( 'add_filter' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'RCC_Settings' ) ) {

	class RCC_Settings {

		private $_group = null;
		private $_options = null;

		/**
		 * Initialize this class
		 */
		public function __construct( $group ) {

			//set the settings group
			$this->_group = $group;

			//and update with the lastest database values
			$this->get_options();
		}

		/**
		 * Get the value of a certain option
		 */
		public function get_option( $option_key ) {

			//check if the key exists in the stored data
			if ( key_exists( $option_key, $this->_options ) ) {

				//return the value if key is present
				return $this->_options[ $option_key ];
			} else {

				//return an empty string if key is not present
				return '';
			}
		}

		/**
		 * Get the stored settings from the options table
		 */
		public function get_options() {

			//update this class with the latest database values
			$this->_options = get_option( $this->_group, array() );
		}

		public function get_all_values() {
			return $this->_options;
		}

		/**
		 * Store an array of new values in the database
		 */
		public function store_options( $options ) {

			//store new values in the database
			update_option( $this->_group, $options );

			//update this class with the stored values
			$this->get_options();
		}
	}
}