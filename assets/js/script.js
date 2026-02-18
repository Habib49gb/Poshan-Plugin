jQuery(document).ready(function ($) {

    // Gender Selection
    $('.pc-gender-option').on('click', function () {
        $('.pc-gender-option').removeClass('selected');
        $(this).addClass('selected');
        var gender = $(this).data('value');
        $('#pc-gender').val(gender);
        // You could update images here if needed to show "active" state
    });

    // Height Slider <-> Input Sync
    $('#pc-height-slider').on('input', function () {
        $('#pc-height-input').val($(this).val());
    });

    $('#pc-height-input').on('input', function () {
        var val = $(this).val();
        // Validation for min/max
        if (val < 30) val = 30;
        if (val > 200) val = 200;
        $('#pc-height-slider').val(val);
    });

    // Weight Slider <-> Input Sync
    $('#pc-weight-slider').on('input', function () {
        $('#pc-weight-input').val($(this).val());
    });

    $('#pc-weight-input').on('input', function () {
        var val = $(this).val();
        // Validation for min/max
        if (val < 2) val = 2;
        if (val > 150) val = 150;
        $('#pc-weight-slider').val(val);
    });

    // Calculate Results
    $('#pc-submit-btn').on('click', function (e) {
        e.preventDefault();

        var gender = $('#pc-gender').val();
        var dob = $('#pc-dob').val();
        var heightCm = parseFloat($('#pc-height-input').val());
        var weightKg = parseFloat($('#pc-weight-input').val());

        if (!dob) {
            alert('Please select a Date of Birth.');
            return;
        }

        // Parse Age in Months
        var birthDate = new Date(dob);
        var today = new Date();
        var ageYears = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            ageYears--;
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
        // Placeholder logic: Just for demo purposes since we lack the Z-score tables.
        // In a real app, you'd lookup WHO tables here.
        var stuntingStatus = 'Normal';
        // Example logic: if height is very low for age (mock check)
        // (This is NOT medically accurate without tables, just for UI demo)
        if (ageMonths > 12 && heightCm < (70 + (ageMonths * 0.5)) * 0.85) {
            stuntingStatus = 'Severely Stunted';
        }

        // 3. Underweight (Weight-for-Age)
        var underweightStatus = 'Normal';
        // Mock check
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

            return '<span class="pc-status-badge ' + cls + '">' + status + '</span>';
        }

        // Build HTML
        var html = '';

        // Summary Box
        html += '<div class="pc-result-summary">';
        html += '<div class="pc-summary-row"><span class="pc-summary-label">Gender: </span>' + (gender.charAt(0).toUpperCase() + gender.slice(1)) + '</div>';
        html += '<div class="pc-summary-row"><span class="pc-summary-label">Date of Birth: </span>' + dob + '</div>';
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
        html += '<button id="pc-back-btn" class="pc-back-btn">&larr; Back</button>';
        html += '<button id="pc-clear-btn" class="pc-clear-btn">Clear & New &rarr;</button>';
        html += '</div>';

        $('#pc-result-text').html(html);

        // Show/Hide
        $('.pc-form-group').hide(); // Hide form elements
        $('#pc-submit-btn').hide(); // Hide submit button
        $('#pc-result-container').fadeIn();
    });

    // Handle Back Button (Delegated for dynamic content)
    $(document).on('click', '#pc-back-btn', function () {
        $('#pc-result-container').hide();
        $('.pc-form-group').fadeIn();
        $('#pc-submit-btn').fadeIn();
    });

    // Handle Clear Button (Delegated for dynamic content)
    $(document).on('click', '#pc-clear-btn', function () {
        // Reset Inputs
        $('#pc-dob').val('');
        $('#pc-height-slider').val(60).trigger('input');
        $('#pc-weight-slider').val(10).trigger('input');

        // Reset Gender to Girl
        $('.pc-gender-option').removeClass('selected');
        $('.pc-gender-option[data-value="girl"]').addClass('selected');
        $('#pc-gender').val('girl');

        // Show Form
        $('#pc-result-container').hide();
        $('.pc-form-group').fadeIn();
        $('#pc-submit-btn').fadeIn();
    });
});
