$(document).ready(function() {
    $('#gform_13').on('submit', function() {
        var formData = {};
        $(this).find('input, select, textarea').each(function() {
            var inputName = $(this).attr('name');
            var inputValue = $(this).val();
            formData[inputName] = inputValue;
        });
        sessionStorage.setItem('gfFormData', JSON.stringify(formData));
    });
});

$(document).on('gform_confirmation_loaded', function(event, formId) {
    if (formId == 13) {
        var formData = JSON.parse(sessionStorage.getItem('gfFormData'));  
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            'event': 'formSubmission',
            'formId': formData['gform_submit'],
            'first_name': formData['input_1'],
            'last_name': formData['input_2'],
            'phone': formData['input_3'],
            'email': formData['input_4'],
            'postcode': formData['input_5'],
            'interested_in': formData['input_9']
        });
        sessionStorage.removeItem('gfFormData');
    }
});
