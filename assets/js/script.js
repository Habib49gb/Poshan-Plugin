jQuery(document).ready(function ($) {

    // Helper function to escape HTML to prevent XSS
    function escapeHtml(string) {
        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '=': '&#x3D;'
            }[s];
        });
    }

    // Keyboard support for gender selection (Space and Enter keys)
    $('.pc-gender-option').on('keydown', function (e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            $(this).click();
        }
    });

    // Gender Selection Click
    $('.pc-gender-option').on('click', function () {
        $('.pc-gender-option').removeClass('selected').attr('aria-checked', 'false');
        $(this).addClass('selected').attr('aria-checked', 'true');
        var gender = $(this).data('value');
        $('#pc-gender').val(gender);
    });

    // Height Slider <-> Input Sync
    $('#pc-height-slider').on('input', function () {
        var val = $(this).val();
        $('#pc-height-input').val(val);
        $(this).attr('aria-valuenow', val);
    });

    // Height Number input - update slider during typing without interrupting focus
    $('#pc-height-input').on('input', function () {
        var val = parseFloat($(this).val());
        if (!isNaN(val)) {
            var sliderVal = val;
            if (sliderVal < 30) sliderVal = 30;
            if (sliderVal > 200) sliderVal = 200;
            $('#pc-height-slider').val(sliderVal).attr('aria-valuenow', sliderVal);
        }
    });

    // Height Number input - clamp value when user finishes typing
    $('#pc-height-input').on('change blur', function () {
        var val = parseFloat($(this).val());
        if (isNaN(val) || val < 30) {
            $(this).val('30.0');
            $('#pc-height-slider').val(30).attr('aria-valuenow', 30);
        } else if (val > 200) {
            $(this).val('200.0');
            $('#pc-height-slider').val(200).attr('aria-valuenow', 200);
        } else {
            $(this).val(val.toFixed(1));
        }
    });

    // Weight Slider <-> Input Sync
    $('#pc-weight-slider').on('input', function () {
        var val = $(this).val();
        $('#pc-weight-input').val(val);
        $(this).attr('aria-valuenow', val);
    });

    // Weight Number input - update slider during typing without interrupting focus
    $('#pc-weight-input').on('input', function () {
        var val = parseFloat($(this).val());
        if (!isNaN(val)) {
            var sliderVal = val;
            if (sliderVal < 2) sliderVal = 2;
            if (sliderVal > 150) sliderVal = 150;
            $('#pc-weight-slider').val(sliderVal).attr('aria-valuenow', sliderVal);
        }
    });

    // Weight Number input - clamp value when user finishes typing
    $('#pc-weight-input').on('change blur', function () {
        var val = parseFloat($(this).val());
        if (isNaN(val) || val < 2) {
            $(this).val('2.0');
            $('#pc-weight-slider').val(2).attr('aria-valuenow', 2);
        } else if (val > 150) {
            $(this).val('150.0');
            $('#pc-weight-slider').val(150).attr('aria-valuenow', 150);
        } else {
            $(this).val(val.toFixed(1));
        }
    });

    // Calculate Results - Bind to form submit to handle Enter key submissions as well
    $('#poshan-calculator-form').on('submit', function (e) {
        e.preventDefault();

        var gender = $('#pc-gender').val();
        var dob = $('#pc-dob').val();
        var heightCm = parseFloat($('#pc-height-input').val());
        var weightKg = parseFloat($('#pc-weight-input').val());

        $('#pc-error-message').hide();

        if (!dob) {
            $('#pc-error-message').text('Please select a Date of Birth.').fadeIn().focus();
            return;
        }

        // Validate DOB format / check if valid date
        var birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) {
            $('#pc-error-message').text('Please enter a valid Date of Birth.').fadeIn().focus();
            return;
        }

        // Validate range bounds
        if (isNaN(heightCm) || heightCm < 30 || heightCm > 200) {
            $('#pc-error-message').text('Please enter a height between 30 and 200 cm.').fadeIn().focus();
            return;
        }

        if (isNaN(weightKg) || weightKg < 2 || weightKg > 150) {
            $('#pc-error-message').text('Please enter a weight between 2 and 150 kg.').fadeIn().focus();
            return;
        }

        // Parse Age in Months
        var today = new Date();
        var ageYears = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            ageYears--;
        }

        if (ageYears > 18) {
            $('#pc-error-message').text('Please enter an age of 18 years or less.').fadeIn().focus();
            return;
        }

        if (ageYears < 0) {
            $('#pc-error-message').text('Date of birth cannot be in the future.').fadeIn().focus();
            return;
        }

        var ageMonths = (ageYears * 12) + m;
        if (today.getDate() < birthDate.getDate()) {
            ageMonths--; // Adjust for partial month
        }
        // Ensure non-negative
        if (ageMonths < 0) ageMonths = 0;

        // --- Simplified Logic for WHO Proxy ---
        // Real WHO standards depend on age (months) + gender. 
        // Without the full data tables (which are huge), we will use simplified logic/placeholders 
        // that match the requested UI structure.

        // 1. BMI
        var heightM = heightCm / 100;
        var bmi = weightKg / (heightM * heightM);
        bmi = bmi.toFixed(2);

        // 2. Stunting (Height-for-Age)
        var stuntingStatus = 'Normal';
        if (ageMonths > 12 && heightCm < (70 + (ageMonths * 0.5)) * 0.85) {
            stuntingStatus = 'Severely Stunted';
        }

        // 3. Underweight (Weight-for-Age)
        var underweightStatus = 'Normal';
        if (ageMonths > 12 && weightKg < (8 + (ageMonths * 0.2)) * 0.7) {
            underweightStatus = 'Underweight';
        }

        // 4. Wasting (Weight-for-Height) - closely related to BMI
        var wastingStatus = 'Normal';
        if (bmi < 16) wastingStatus = 'Severe Wasting';
        else if (bmi < 18.5) wastingStatus = 'Wasting';

        // Helper to get badge class
        function getBadgeHtml(status) {
            var cls = 'normal';
            if (status.includes('Severe') || status.includes('Severely')) cls = 'danger';
            else if (status.includes('Underweight') || status.includes('Wasting') || status.includes('Stunted')) cls = 'warning';

            return '<span class="pc-status-badge ' + cls + '">' + escapeHtml(status) + '</span>';
        }

        // Build HTML securely
        var html = '';

        // Summary Box
        html += '<div class="pc-result-summary">';
        html += '<div class="pc-summary-row"><span class="pc-summary-label">Gender: </span>' + escapeHtml(gender.charAt(0).toUpperCase() + gender.slice(1)) + '</div>';
        html += '<div class="pc-summary-row"><span class="pc-summary-label">Date of Birth: </span>' + escapeHtml(dob) + '</div>';
        html += '<br>';
        html += '<div class="pc-summary-row"><span class="pc-summary-label">Height: </span>' + heightCm + ' cm</div>';
        html += '<div class="pc-summary-row"><span class="pc-summary-label">Weight: </span>' + weightKg + ' kg</div>';
        html += '</div>';

        // Results List
        html += '<div class="pc-results-heading">Results:</div>';
        html += '<ul class="pc-result-list">';
        html += '<li class="pc-result-item">&bullet; Age (months): ' + ageMonths + '</li>';
        html += '<li class="pc-result-item">&bullet; BMI: ' + bmi + '</li>';
        html += '<li class="pc-result-item">&bullet; Stunting: ' + getBadgeHtml(stuntingStatus) + '</li>';
        html += '<li class="pc-result-item">&bullet; Underweight: ' + getBadgeHtml(underweightStatus) + '</li>';
        html += '<li class="pc-result-item">&bullet; Wasting: ' + getBadgeHtml(wastingStatus) + '</li>';
        html += '</ul>';

        // Buttons Container
        html += '<div class="pc-btn-container">';
        html += '<button type="button" id="pc-back-btn" class="pc-back-btn">&larr; Back</button>';
        html += '<button type="button" id="pc-clear-btn" class="pc-clear-btn">Clear & New</button>';
        html += '<button type="button" id="pc-pdf-btn" class="pc-pdf-btn">Download PDF</button>';
        html += '</div>';

        $('#pc-result-text').html(html);

        // Show/Hide
        $('.pc-form-group').hide(); // Hide form elements
        $('#pc-submit-btn').hide(); // Hide submit button
        $('#pc-result-container').fadeIn(function() {
            // Shift keyboard focus to the results container for screen readers
            $(this).attr('tabindex', '-1').focus();
        });
    });

    // Handle Back Button (Delegated for dynamic content)
    $(document).on('click', '#pc-back-btn', function () {
        $('#pc-result-container').hide();
        $('.pc-form-group').fadeIn();
        $('#pc-submit-btn').fadeIn(function() {
            // Restore focus back to the selected gender
            $('.pc-gender-option.selected').focus();
        });
    });

    // Handle Clear Button (Delegated for dynamic content)
    $(document).on('click', '#pc-clear-btn', function () {
        // Reset Inputs
        $('#pc-dob').val('');
        $('#pc-height-slider').val(60).trigger('input');
        $('#pc-weight-slider').val(10).trigger('input');
        $('#pc-height-input').val('60.0');
        $('#pc-weight-input').val('10.0');

        // Reset Gender to Girl
        $('.pc-gender-option').removeClass('selected').attr('aria-checked', 'false');
        $('.pc-gender-option[data-value="girl"]').addClass('selected').attr('aria-checked', 'true');
        $('#pc-gender').val('girl');

        // Show Form
        $('#pc-result-container').hide();
        $('.pc-form-group').fadeIn();
        $('#pc-submit-btn').fadeIn(function() {
            // Reset focus to gender options
            $('.pc-gender-option.selected').focus();
        });
    });

    // Handle PDF Download
    $(document).on('click', '#pc-pdf-btn', function () {
        var element = document.getElementById('pc-result-container');

        // Hide buttons before generating PDF
        $('.pc-btn-container').hide();
        var originalScroll = window.scrollY || document.documentElement.scrollTop;
        window.scrollTo(0, 0);

        var opt = {
            margin: 10,
            filename: 'poshan-result.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, backgroundColor: '#ffffff', useCORS: true, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(function () {
            // Restore buttons
            $('.pc-btn-container').show();
            window.scrollTo(0, originalScroll);
            // Restore focus back to download PDF button
            $('#pc-pdf-btn').focus();
        }).catch(function (err) {
            console.error("PDF generation error: ", err);
            $('.pc-btn-container').show();
            window.scrollTo(0, originalScroll);
            $('#pc-pdf-btn').focus();
        });
    });
});

