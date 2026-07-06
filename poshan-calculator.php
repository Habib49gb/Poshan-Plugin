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
        // Register assets so they can be enqueued conditionally within the shortcode callback.
        wp_register_style( 'poshan-calculator-style', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '1.0.0' );
        wp_register_script( 'html2pdf', 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js', array(), '0.10.1', true );
        wp_register_script( 'poshan-calculator-script', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array( 'jquery', 'html2pdf' ), '1.0.0', true );
    }

    public function render_calculator( $atts ) {
        // Enqueue the registered assets only when the shortcode is processed.
        wp_enqueue_style( 'poshan-calculator-style' );
        wp_enqueue_script( 'html2pdf' );
        wp_enqueue_script( 'poshan-calculator-script' );

        // Generate JSON-LD Schema for SEO
        $schema = array(
            '@context' => 'https://schema.org',
            '@type'    => 'WebApplication',
            'name'     => 'Poshan Calculator',
            'url'      => esc_url( home_url( $_SERVER['REQUEST_URI'] ) ),
            'applicationCategory' => 'HealthApplication',
            'operatingSystem'     => 'All',
            'browserRequirements' => 'Requires HTML5/JavaScript support',
            'description'         => 'A nutrition and growth calculator plugin to assess BMI, stunting, wasting, and underweight status for children.',
            'offers'              => array(
                '@type'         => 'Offer',
                'price'         => '0',
                'priceCurrency' => 'USD'
            )
        );

        ob_start();
        ?>
        <script type="application/ld+json">
        <?php echo wp_json_encode( $schema ); ?>
        </script>
        
        <div class="poshan-calculator-wrapper">
            <form class="pc-container" id="poshan-calculator-form" novalidate>
                <!-- Gender Selection -->
                <div class="pc-form-group" role="radiogroup" aria-labelledby="pc-gender-label">
                    <span class="pc-label" id="pc-gender-label">GENDER *</span>
                    <div class="pc-gender-selection">
                        <div class="pc-gender-option selected" data-value="girl" role="radio" aria-checked="true" tabindex="0" aria-label="Girl">
                            <div class="pc-gender-icon">
                                <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . 'assets/images/girl.png' ); ?>" alt="Girl graphic">
                            </div>
                            <span>Girl</span>
                        </div>
                        <div class="pc-gender-option" data-value="boy" role="radio" aria-checked="false" tabindex="0" aria-label="Boy">
                            <div class="pc-gender-icon">
                                <img src="<?php echo esc_url( plugin_dir_url( __FILE__ ) . 'assets/images/boy.png' ); ?>" alt="Boy graphic">
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
                        <input type="date" id="pc-dob" class="pc-input" placeholder="mm/dd/yyyy" required aria-required="true">
                    </div>
                </div>

                <!-- Height -->
                <div class="pc-form-group">
                    <label class="pc-label" for="pc-height-input" id="pc-height-label">HEIGHT (CM) *</label>
                    <div class="pc-slider-container">
                        <input type="range" min="30" max="200" value="60" class="pc-slider" id="pc-height-slider" aria-label="Height in centimeters slider" aria-valuemin="30" aria-valuemax="200" aria-valuenow="60">
                        <input type="number" min="30" max="200" value="60.0" class="pc-number-input" id="pc-height-input" step="0.1" required aria-required="true">
                    </div>
                </div>

                <!-- Weight -->
                <div class="pc-form-group">
                    <label class="pc-label" for="pc-weight-input" id="pc-weight-label">WEIGHT (KG) *</label>
                    <div class="pc-slider-container">
                        <input type="range" min="2" max="150" value="10" class="pc-slider" id="pc-weight-slider" aria-label="Weight in kilograms slider" aria-valuemin="2" aria-valuemax="150" aria-valuenow="10">
                        <input type="number" min="2" max="150" value="10.0" class="pc-number-input" id="pc-weight-input" step="0.1" required aria-required="true">
                    </div>
                </div>

                <!-- Error Message -->
                <div id="pc-error-message" style="color: #d9534f; display: none; margin-bottom: 15px; font-weight: 600; text-align: center; font-size: 14px;" role="alert" aria-live="assertive"></div>

                <!-- Submit Button -->
                <button type="submit" id="pc-submit-btn" class="pc-submit-btn">Show Results &rarr;</button>

                <!-- Results Display (Hidden by default) -->
                <div id="pc-result-container" class="pc-result-container" style="display:none;" aria-live="polite" role="region" aria-labelledby="pc-result-title">
                    <h3 id="pc-result-title">Result</h3>
                    <div id="pc-result-text"></div>
                    <div class="pc-charts">
                        <!-- Placeholders for charts/graphs if needed -->
                    </div>
                </div>
            </form>
        </div>
        <?php
        return ob_get_clean();
    }
}

new Poshan_Calculator();

