<?php
/**
 * Plugin Name: Poshan Calculator
 * Description: A nutrition and growth calculator plugin. Use shortcode [poshan_calculator] to display the calculator.
 * Version: 1.0.0
 * Author: Your Name
 * Text Domain: poshan-calculator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

class Poshan_Calculator {

    public function __construct() {
        add_shortcode( 'poshan_calculator', array( $this, 'render_calculator' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );
    }

    public function enqueue_assets() {
        // Only enqueue if the shortcode is present or we are on a specific page (optional optimization)
        // For simplicity, we enqueue on all pages but scripts are lightweight.
        // Ideally, check if singular and has shortcode.
        global $post;
        if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'poshan_calculator' ) ) {
            wp_enqueue_style( 'poshan-calculator-style', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '1.0.0' );
            wp_enqueue_script( 'poshan-calculator-script', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array( 'jquery' ), '1.0.0', true );
        }
    }

    public function render_calculator( $atts ) {
        ob_start();
        ?>
        <div class="poshan-calculator-wrapper">
            <div class="pc-container">
                <!-- Gender Selection -->
                <div class="pc-form-group">
                    <label class="pc-label">GENDER *</label>
                    <div class="pc-gender-selection">
                        <div class="pc-gender-option selected" data-value="girl">
                            <div class="pc-gender-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
                                    <circle cx="32" cy="32" r="30" fill="#f5f5f5"/>
                                    <path d="M32 48c-8 0-14 4-14 9h28c0-5-6-9-14-9z" fill="#ffab40"/>
                                    <circle cx="32" cy="30" r="10" fill="#ffccbc"/>
                                    <path d="M32 12c-6 0-11 4-11 11v6c0 4 3 8 6 9h10c3-1 6-5 6-9v-6c0-7-5-11-11-11z" fill="#37474f"/>
                                    <path d="M21 23c0 8 4 14 11 14s11-6 11-14H21z" fill="#37474f"/> 
                                </svg>
                            </div>
                            <span>Girl</span>
                        </div>
                        <div class="pc-gender-option" data-value="boy">
                            <div class="pc-gender-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="100%" height="100%">
                                    <circle cx="32" cy="32" r="30" fill="#f5f5f5"/>
                                    <path d="M32 48c-8 0-14 4-14 9h28c0-5-6-9-14-9z" fill="#ff5252"/>
                                    <circle cx="32" cy="30" r="10" fill="#ffccbc"/>
                                    <path d="M32 14c-5 0-9 3-9 8v2c0 1 .5 2 1 2h16c.5 0 1-1 1-2v-2c0-5-4-8-9-8z" fill="#37474f"/>
                                </svg>
                            </div>
                            <span>Boy</span>
                        </div>
                        <input type="hidden" id="pc-gender" value="girl">
                    </div>
                </div>

                <!-- Date of Birth -->
                <div class="pc-form-group">
                    <label class="pc-label" for="pc-dob">DATE OF BIRTH *</label>
                    <div class="pc-input-wrapper">
                        <input type="date" id="pc-dob" class="pc-input" placeholder="mm/dd/yyyy">
                    </div>
                </div>

                <!-- Height -->
                <div class="pc-form-group">
                    <label class="pc-label">HEIGHT (CM) *</label>
                    <div class="pc-slider-container">
                        <input type="range" min="30" max="200" value="60" class="pc-slider" id="pc-height-slider">
                        <input type="number" min="30" max="200" value="60.0" class="pc-number-input" id="pc-height-input" step="0.1">
                    </div>
                </div>

                <!-- Weight -->
                <div class="pc-form-group">
                    <label class="pc-label">WEIGHT (KG) *</label>
                    <div class="pc-slider-container">
                        <input type="range" min="2" max="150" value="10" class="pc-slider" id="pc-weight-slider">
                        <input type="number" min="2" max="150" value="10.0" class="pc-number-input" id="pc-weight-input" step="0.1">
                    </div>
                </div>

                <!-- Submit Button -->
                <button id="pc-submit-btn" class="pc-submit-btn">Show Results &rarr;</button>

                <!-- Results Display (Hidden by default) -->
                <div id="pc-result-container" class="pc-result-container" style="display:none;">
                    <h3>Result</h3>
                    <p id="pc-result-text"></p>
                    <div class="pc-charts">
                        <!-- Placeholders for charts/graphs if needed -->
                    </div>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

new Poshan_Calculator();
