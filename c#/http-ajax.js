$('#RetailerFeedbackForm').submit(function () {
            var datastring;
            datastring = new FormData($("#RetailerFeedbackForm").get(0));
            console.log("test: "+datastring);

            $.ajax({
                type: "POST",
                url: '/JobRequest/SendRetailerFeedback',
                data: datastring,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    ajaxindicatorstart();
                },
                success: function (data) {
                    console.log(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    errorNotify('Email', "An error occured while trying to send the email.");
                },
                complete: function () {
                    ajaxindicatorstop();
                }
            });
        });