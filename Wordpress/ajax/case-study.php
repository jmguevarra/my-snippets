/* Case Studies - AJAX Handler */

// Handle AJAX request to fetch case studies
function ajax_get_case_studies() {
    // Check the nonce for security
    check_ajax_referer('case_study_nonce', 'security');

    // Get the selected filters
    $selected_industry = isset($_POST['industry']) ? $_POST['industry'] : []; // Expecting an array of industry
    $selected_services = isset($_POST['services']) ? $_POST['services'] : []; // Expecting an array of services

    // Get the current page number
    $paged = isset($_POST['paged']) ? absint($_POST['paged']) : 1; // Default to page 1 if not set
 
    // Get the parent page ID by title
    $parent_page = get_page_by_title('Case Studies');
    if (!$parent_page) {
        wp_send_json_error('Parent page "Case Studies" not found.');
    }

    // Query all child pages of the parent
    $args = array(
        'post_type'      => 'page',
        'posts_per_page' => 20, // Fetch all child pages -1 to show all or include number like 4,10,20 to limit
        'post_status'    => 'publish',
        'post_parent'    => $parent_page->ID, // Use the parent ID
        'orderby'        => 'date', // Optional: order by page order //menu_order,date
        'order'          => 'DESC', //DESC or ASC
        'paged'          => $paged, // Added: Current page number
    );


    // Apply industry filter if any
    if (!empty($selected_industry)) {
        $args['meta_query'][] = array(
            'key'     => 'case_study_tags_industry',  // ACF field key for industry
            'value'   => $selected_industry,          // Selected industry values
            'compare' => 'IN',                        // Compare to match any of the selected values
        );
    }


    // Apply services filter if any
    /*if (!empty($selected_services)) {
        // Loop through each selected service and apply a 'LIKE' query for each
        foreach ($selected_services as $selected_service) {
            $args['meta_query'][] = array(
                'key'     => 'case_study_tags_services',  // ACF field key for services
                'value'   => '"' . $selected_service . '"',  // Search for exact service in case_study_tags_services
                'compare' => 'LIKE',                        // Use LIKE to match each selected value
            );
        }
    }*/

       // Apply services filter if any
       if (!empty($selected_services)) {
        $meta_query = array('relation' => 'OR');

        // Loop through each selected service and apply a 'LIKE' query for each
        foreach ($selected_services as $selected_service) {
            $meta_query[] = array(
                'key'     => 'case_study_tags_services',  // ACF field key for services
                'value'   => '"' . $selected_service . '"',  // Search for exact service in case_study_tags_services
                'compare' => 'LIKE',                        // Use LIKE to match each selected value
            );
        }

        $args['meta_query'][] = $meta_query;
    }


    // Debugging the query arguments
    error_log("Query Args: " . print_r($args, true));

    $query = new WP_Query($args);
    $output = '';
    $pagination = '';
    $pagination_links = '';

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();

            // Get ACF fields
            $case_study_logo = get_field('case_study_logo'); 
            $case_study_description = get_field('case_study_description') ? get_field('case_study_description') : get_the_title();
            $case_study_thumbnail = get_field('case_study_thumbnail'); 
            $case_study_text_color = get_field('case_study_text_color');
            $case_study_tags_industry = get_field('case_study_tags_industry');
            $case_study_tags_services = get_field('case_study_tags_services');

            //Validation of Fields
            $thumbnail_url = is_array($case_study_thumbnail) ? $case_study_thumbnail['url'] : $case_study_thumbnail;
            $logo_url = is_array($case_study_logo) ? $case_study_logo['url'] : 'https://socialgarden.com.au/wp-content/uploads/2022/10/blank-logo-1.png';
            $text_class = (is_array($case_study_text_color) && in_array('Dark Text', $case_study_text_color)) ? 'text-dark' : 'text-light';
            
            //UI of Case Studies List
            $background_style = $thumbnail_url 
            ? 'background-image: url(' . esc_url($thumbnail_url) . '); background-size: cover; background-position: center;'
            : 'background-color: #20e28f;';

                    $output .= '<div class="col-md-6 mb-4 h-100">';
                    $output .= '    <div class="case-study-item" style="min-height: 365px; '. $background_style .' padding: 20px; color: white; ">';
                    
                        if (!empty($logo_url)) {
                            $output .= '        <div class="case-study-logo mb-3">';
                            $output .= '            <img src="' . esc_url($logo_url) . '" alt="' . esc_attr($case_study_description) . ' logo" style="max-width: 100px;">';
                            $output .= '        </div>';
                        }

                        $output .= '        <h4 class="' . esc_html($text_class) . '" style="max-width: 400px;" >' . esc_html($case_study_description) . '</h4>';
                        $output .= '        <a class="' . esc_html($text_class) . '" href="' . esc_url(get_permalink()) . '" class="text-white">Read Now <i class="fa fa-chevron-circle-right"></i></a>';
                        if (is_array($case_study_tags_services) && !empty($case_study_tags_services)) {
                            $output .= '<div class="col-md-12 mt-5 case-study-tags-display">';
                            $output .= '<span class="badge bg-primary text-dark me-1 small">' . esc_html($case_study_tags_industry) . '</span>';
                            foreach ($case_study_tags_services as $value) {
                                $output .= '<span class="badge bg-secondary text-white me-1 small ml-1">' . esc_html($value) . '</span>';
                            }
                            $output .= '</div>';
                        }

                    $output .= '    </div>';
                    $output .= '</div>';
        }


        // Pagination logic
        $big = 999999999; // Need an unlikely integer for pagination
        $pagination_links = paginate_links(array(
            'base'      => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
            'format'    => '?paged=%#%',
            'current'   => $paged,
            'total'     => $query->max_num_pages,
            'prev_text' => __('&laquo; Prev'),
            'next_text' => __('Next &raquo;'),
            'type'      => 'array', // Return pagination as an array
        ));
        
        // Initialize the pagination output
        $pagination = '';
        if (!empty($pagination_links)) {
            foreach ($pagination_links as $link) {
                $page_number = null;
        
                // Check for "Prev" link
                if (strpos($link, 'Prev') !== false) {
                    $page_number = max(1, $paged - 1); // Calculate previous page number
                }
                // Check for "Next" link
                elseif (strpos($link, 'Next') !== false) {
                    $page_number = min($query->max_num_pages, $paged + 1); // Calculate next page number
                }
                // For regular numbered links
                elseif (preg_match('/href="[^"]*paged=([0-9]+)[^"]*"/', $link, $matches)) {
                    $page_number = intval($matches[1]); // Extract the page number from the href
                } elseif (strpos($link, 'current') !== false) {
                    $page_number = $paged; // For the current page, set the correct page number
                }
        
                // Debugging: Log the page number extracted for each link
                error_log("Extracted page number: " . print_r($page_number, true));
        
                // If no page number is found, fallback to the current page
                $page_number = $page_number ?? $paged;
        
                // Add a custom `data-page` attribute
                $updated_link = preg_replace(
                    '/<a([^>]*)>/', 
                    '<a class="page-numbers" data-page="' . esc_attr($page_number) . '">',
                    $link
                );

                // Combine the updated link into the pagination output
                $pagination .= $updated_link;
            }
        }
        
    } else {
        $output .= '<p>No case studies found matching your criteria.</p>';
    }


    wp_reset_postdata();
    //wp_send_json_success($output);

    // Send response with both content and pagination
    wp_send_json_success(array(
        'content'    => $output,
        'pagination' => $pagination,
    ));
}
add_action('wp_ajax_get_case_studies', 'ajax_get_case_studies');
add_action('wp_ajax_nopriv_get_case_studies', 'ajax_get_case_studies');

// Enqueue the script
function enqueue_case_study_ajax_script() {
    wp_enqueue_script('case-study-ajax', get_template_directory_uri() . '/js/case-study-ajax.js', array('jquery'), null, true);
    wp_localize_script('case-study-ajax', 'ajaxurl', admin_url('admin-ajax.php'));
    wp_localize_script('case-study-ajax', 'case_study', array(
        'nonce' => wp_create_nonce('case_study_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'enqueue_case_study_ajax_script');
