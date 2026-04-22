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
                                <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . 'assets/images/girl.png' ); ?>" alt="Girl">
                            </div>
                            <span>Girl</span>
                        </div>
                        <div class="pc-gender-option" data-value="boy">
                            <div class="pc-gender-icon">
                                <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . 'assets/images/boy.png' ); ?>" alt="Boy">
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
