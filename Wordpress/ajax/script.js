jQuery(document).ready(function ($) {

    // Handle form submission
    $('form#case-study-filter').on('submit', function (e) {
        e.preventDefault();
        display_case_studies(1);
    });

    //Pagination
    jQuery(document).on('click', '#case-study-container .page-numbers', function (e) {
        e.preventDefault(); // Prevent the default link behavior
        const page = $(this).data('page'); // Get the data-page attribute value
        console.log('Page number clicked:', page); // Log the page number to the console
    
        // Perform your custom logic here
        if (page) {
            display_case_studies(page); // Replace with your custom function
        }
    });
    

    // Call display_case_studies on page load to initialize
    display_case_studies(1);

    function display_case_studies(page = 1){
        //console.log('heyy');
        const industry = [];
        $('input[name="industry[]"]:checked').each(function () {
            industry.push($(this).val());
        });
        //console.log(industry);

        const services = [];
        $('input[name="services[]"]:checked').each(function () {
            services.push($(this).val());
        });
        //console.log(services);
        //industry = ['Property'];

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'get_case_studies',
                industry: industry,
                services: services,
                security: case_study.nonce,
                paged: page,  // Send the current page number
            },
            beforeSend: function () {
                $('#case-study-results').html('<p>Loading...</p>');
                //console.log('wee -- loading');
            },
			success: function (response) {
				console.log(response, "test");
				if (response.success) {
                    if(response.data == ''){
                        $('#case-study-results').html('<p>No case studies found.</p>');
                    }else{

                        //$('#case-study-results').html(response.data);
                        $('#case-study-results').html(response.data.content); // Display the case studies
                        //console.log('wee'+response.data.content);
                        $('#case-study-pagination').html(response.data.pagination); // Display pagination
                    }
                } else {
                    $('#case-study-results').html('<p>No case studies found.</p>');
                }
            },
        });
    }
   
   // Handle checkbox changes for industries
    $('input[name="industry[]"]').on('change', function () {
        updateSelectedTags($(this));
    });

    // Handle checkbox changes for services
    $('input[name="services[]"]').on('change', function () {
        updateSelectedTags($(this));
    });

    // Function to update selected tags
    function updateSelectedTags($checkbox) {
        display_case_studies(1); // Update case studies
        const value = $checkbox.val();
        //console.log(value);
        const container = $('#selected-tags'); // Shared container for all tags

        if ($checkbox.is(':checked')) {
            // Create and append the tag
            const tag = $('<span>', {
                class: 'badge bg-secondary text-white me-2 tag',
                html: `${value} <button type="button" class="btn-close btn-close-white btn-close-sm" aria-label="Close">X</button>`
            });

            // Close button functionality to remove tag
            tag.find('.btn-close').on('click', function () {
                tag.remove();
                $checkbox.prop('checked', false); // Uncheck the checkbox
                display_case_studies(1); // Update case studies
                updateResetButton();
            });

            container.append(tag);
        } else {
            // Remove the tag if unchecked
            container.find('.tag').each(function () {
                if ($(this).text().trim().startsWith(value)) {
                    $(this).remove();
                }
            });
        }

        updateResetButton();
    }



    function updateResetButton() {
        const container = $('#selected-tags');
        const resetButtonId = 'reset-btn'; // Unique ID for the reset button
        let resetButton = $(`#${resetButtonId}`);
    
        // Check if there are any tags
        const hasTags = container.find('.tag').length > 0;
    
        if (hasTags) {
            // If reset button doesn't exist, create it
            if (resetButton.length === 0) {
                resetButton = $(`
                    <button id="${resetButtonId}" type="button" class="btn-reset d-flex align-items-center mt-2">
                        <span class="icon me-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <mask id="mask0_2108_1424" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_2108_1424)">
                                    <path d="M11 20.95C8.98333 20.7 7.3125 19.8208 5.9875 18.3125C4.6625 16.8042 4 15.0333 4 13C4 11.9 4.21667 10.8458 4.65 9.8375C5.08333 8.82917 5.7 7.95 6.5 7.2L7.925 8.625C7.29167 9.19167 6.8125 9.85 6.4875 10.6C6.1625 11.35 6 12.15 6 13C6 14.4667 6.46667 15.7625 7.4 16.8875C8.33333 18.0125 9.53333 18.7 11 18.95V20.95ZM13 20.95V18.95C14.45 18.6833 15.6458 17.9917 16.5875 16.875C17.5292 15.7583 18 14.4667 18 13C18 11.3333 17.4167 9.91667 16.25 8.75C15.0833 7.58333 13.6667 7 12 7H11.925L13.025 8.1L11.625 9.5L8.125 6L11.625 2.5L13.025 3.9L11.925 5H12C14.2333 5 16.125 5.775 17.675 7.325C19.225 8.875 20 10.7667 20 13C20 15.0167 19.3375 16.7792 18.0125 18.2875C16.6875 19.7958 15.0167 20.6833 13 20.95Z" fill="#868E96"/>
                                </g>
                            </svg>
                        </span>
                        <span class="text">Reset</span>
                    </button>
                `);
    
                // Add click event to reset button
                resetButton.on('click', function () {
                    // Clear all tags and uncheck all checkboxes
                    container.find('.tag').remove();
                    $('input[name="industry[]"], input[name="services[]"]').prop('checked', false);
                    display_case_studies(); // Update case studies
                    updateResetButton(); // Update/reset button visibility
                });
            }
    
            // Append the reset button to ensure it's always at the end
            container.append(resetButton);
        } else {
            // Hide the reset button if no tags are present
            resetButton.remove();
        }
    }




// Trigger when a checkbox is checked or unchecked
// Trigger when an industry checkbox is changed
$('.industry-checkbox').on('change', function() {
    updateServiceCounts(); // Call to update service counts based on selected industries
});
updateServiceCounts();
function updateServiceCounts() {
    // Get the selected industries
    var selectedIndustries = [];
    $('.industry-checkbox:checked').each(function() {
        selectedIndustries.push($(this).val());
    });

    // Trigger AJAX to get counts for each service based on selected industries
    $.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {
            action: 'get_case_studies_count_per_tags',
            industry: selectedIndustries, // Pass the selected industries
            services: [], // You can pass services as empty or let the backend handle all services
            security: case_study.nonce, // Ensure nonce is passed for security
        },
        beforeSend: function() {
            // Optionally show a loading message or animation here
        },
        success: function(response) {
            if (response.success) {
                // Loop through the returned service counts and update the display
                $.each(response.data, function(service, count) {
                    // Find the service checkbox and update its count
                    $('input[type="checkbox"][value="' + service + '"]')
                        .siblings('.service-count')
                        .text('(' + count + ')');
                });
            } else {
                console.log('No case studies found or issue with filters');
            }
        },
    });
}

    






});

jQuery(document).ready(function ($) {
    $('.service-search').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();

        // Iterate through the service items and filter based on search term
        $('.service-item').each(function () {
            var serviceText = $(this).text().toLowerCase();
            if (serviceText.includes(searchTerm)) {
                $(this).show(); // Show matching items
            } else {
                $(this).hide(); // Hide non-matching items
            }
        });
    });
});
