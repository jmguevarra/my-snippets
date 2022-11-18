<!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>-->
<script src="//cdn.jsdelivr.net/npm/bluebird@3.7.2/js/browser/bluebird.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.maskedinput/1.4.1/jquery.maskedinput.min.js"></script>
<script src="https://social-garden.s3-ap-southeast-2.amazonaws.com/assets/intTelInput/js/intlTelInput.min.js"></script>
<!--<script src="https://social-garden.s3-ap-southeast-2.amazonaws.com/assets/intTelInput/js/utils.js"></script>-->
<script defer>
  console.log("Version 1.0.1");
  // declaring variable elements for styling the field country code and phone - default
  // get the id's don't include the #
  const form = "lp-pom-form-42";
  const phoneField = "phone";
  const submitButton = "lp-pom-button-2102";
  const verificationField = "verification_code";
  const verificationFieldError = "lp-pom-text-1007";
  const verifyButton = "lp-pom-button-1003";
  const formSubmitButton = "lp-pom-button-43";
  const verificationContainer = "lp-pom-box-1002";
  $("#myModal").parent(".lp-code").addClass("modalZ");
  $("#" + formSubmitButton).css("visibility", "hidden");
  
  /* Create elements for phone messages */
  const spanValid = document.createElement("span");
  spanValid.setAttribute("id", "valid-msg");
  spanValid.classList.add("hide");
  spanValid.appendChild(document.createTextNode("✓ Valid"));

  const spanError = document.createElement("span");
  spanError.setAttribute("id", "error-msg");
  spanError.classList.add("hide");

  var phoneContainer = document.getElementById("container_phone");
  phoneContainer.appendChild(spanValid);
  phoneContainer.appendChild(spanError);

  /* End create elements for phone messages */

  var input = document.querySelector("#phone");
  var errorMsg = document.querySelector("#error-msg");
  var validMsg = document.querySelector("#valid-msg");
  let phoneFormat;
  let convertFormat;

  //input.value = "+639065016158";

  var errorMap = [
    "Invalid number",
    "Invalid country code",
    "Too short",
    "Too long",
    "Invalid number",
  ];

  /* Phone Field INT TEL config */
  var iti = window.intlTelInput(input, {
    initialCountry: "auto",
    nationalMode: true,
    formatOnDisplay: true,
    geoIpLookup: function (callback) {
      $.get("https://ipinfo.io?token=5991a1581f6f95", function () {}, "jsonp").always(function (
        resp
      ) {
        var countryCode = resp && resp.country ? resp.country : "";
        callback(countryCode);
      });
    },
    utilsScript:
      "https://social-garden.s3-ap-southeast-2.amazonaws.com/assets/intTelInput/js/utils.js?1562189064761",
  });
  /* End phone Field INT TEL config */

  /* Get Country Code */
  input.addEventListener("countrychange", function () {
    //var countryData = iti.getSelectedCountryData().dialCode;
    //console.log(`+${countryData}`); // e.g +639
    input.value = "";
    newFormat();
  });

  input.addEventListener("click", function(){
	console.log('Focused!');
    var trimmedInput = $.trim($("#phone").val());
    $("#phone").val(trimmedInput);
    console.log(trimmedInput);
  });
  
  function newFormat() {
    phoneFormat = input.placeholder;
    convertFormat = phoneFormat.split("");
    /* identity = (x) => x; */
    function identity(x) {
      return x;
    }
    let newFormat = convertFormat.map(identity);
    convertFormat.forEach(function (item, index) {
      if (item.match(/^[0-9][A-Za-z0-9 -]*$/g)) {
        newFormat[index] = 9;
        //console.log(`${item} - a number`);
      } else {
        //console.log(`${item} - not a number`);
      }
    });

    newFormat = newFormat.join().replace(/,/g, "");
    //console.log(`New Format ${newFormat}`);
    $("#phone").mask(newFormat, {
      placeholder: "",
      clearMaskOnLostFocus: false,
      autoclear: false
    });
  }

  iti.promise.then(function () {
    newFormat();
    console.log("Phone Masking Initialized");

  });

  /* End get COuntry Code */

  var reset = function () {
    input.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");
  };

 // on blur: validate
  input.addEventListener("blur", function () {
    reset();


    var numberType = iti.getNumberType();


    if (input.value.trim()) {
      if (iti.isValidNumber()) {

        if( numberType == 0 ){
            input.classList.add("error");
            errorMsg.innerHTML = 'SMS is not supported by landline phone number';
            errorMsg.classList.remove("hide");
            $("#" + phoneField)
          .closest(".lp-pom-form-field")
          .addClass("fieldError");

        }else{
            validMsg.classList.remove("hide");
            $("#" + phoneField)
            .closest(".lp-pom-form-field")
            .removeClass("fieldError");
        }
        
      } else {
        input.classList.add("error");
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("hide");
        $("#" + phoneField)
          .closest(".lp-pom-form-field")
          .addClass("fieldError");
      }
    }

    console.log(numberType);



  });

  // on keyup / change flag: reset
  input.addEventListener("change", reset);
  input.addEventListener("keyup", reset);

  /* Start Function for Form Flow */
  function first_step() {
    $("#" + formSubmitButton).hide();
    $("#" + submitButton).show();
    $("#" + verificationContainer).hide();
    $("#" + verificationContainer)
      .children()
      .hide();
  }
  function verfication() {
    $("#" + formSubmitButton).show();
    $("#" + submitButton).hide();
    $("#" + verificationContainer).show();
    $("#" + verificationContainer)
      .children()
      .show();
    $(".circle-loader").hide();
    $("#" + verificationFieldError).hide();
    $("#" + verificationField)
      .focus()
      .val("");
  }

  first_step(); // initiate Default
  /* End Function for Form Flow */

  /* Start Resend Auth Code */
  $(".redo_phone").click(function () {
    first_step();
  });
  $(".resend_phone").click(function () {
    resend();
  });
  /* End Resend Auth Code */

  /* Start Form Validations */
  // Event of form submission via pressing Enter
  $("#" + form + "form").on("keyup keypress", function (e) {
    var keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      //console.log("DID NOT SUBMIT");
      $("#" + submitButton).click(); // initiate submit button - to run function
      return false;
    } else {
      //console.log("SUBMITS");
    }
  });

  function submitForm() {
    $("#" + formSubmitButton).click();
  }

  /* Verification Field */
  $("#" + verificationField).attr("maxlength", "4");
  $("#" + verificationField).on("keypress keyup blur", function (event) {
    $(this).val(
      $(this)
        .val()
        .replace(/[^\d].+/, "")
    );
    if (event.which < 48 || event.which > 57) {
      event.preventDefault();
    } else {
      var code_length = $("#" + verificationField).val().length;
      // console.log(code_length);
      if (code_length == 4) {
        // console.log("GO VERIFY");
        $("#" + verificationFieldError).hide(); // hides error message
        $("#" + verifyButton).click(); // automates verify button
      } else {
        //console.log("NOT 4"); // error must enter 4 characters
      }
    }
  });

  // Validate name or only use alpha and .
  // Add Id's of the input field in names array
  const names = ["#first_name", "#last_name"];
  $.each(names, function (index, item) {
    $(item) // allow only numbers
      .unbind("keyup change input paste")
      .bind("keyup change input paste", function () {
        this.value = this.value.replace(/[^a-z,A-Z, ,\., \-]/g, "");
      });
    $(item).blur(function () {
      if (this.value.match(/[a-z,A-Z, ,\., \-]/g)) {
        //true
        $(this).closest(".lp-pom-form-field").removeClass("fieldError");
      } else {
        //false
        $(this).closest(".lp-pom-form-field").addClass("fieldError");
      }
    });
  });

  // Validate email address fields
  const emailAddress = ["#email"];
  $.each(emailAddress, function (index, item) {
    $(item).blur(function () {
      if (this.value.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        //true
        $(this).closest(".lp-pom-form-field").removeClass("fieldError");
      } else {
        //false
        $(this).closest(".lp-pom-form-field").addClass("fieldError");
      }
    });
  });

  let requiredFields = ["first_name", "last_name", "email", "phone", "region", "land_status", "dummy"];
  let allFieldsFilled = false;
  let fullNumber = "";
  let currentNumber = "";

  // Get the modal
  var modal = document.getElementById("myModal");
  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];
  // When the user clicks the button, open the modal

  // When the user clicks on <span> (x), close the modal
  /* span.onclick = function() {
  modal.style.display = "none";
} */

  $(".close").click(function () {
    modal.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
  /* window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} */

  $(window).click(function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  /* const resend = () => {
   */
  function resend() {
    $.ajax({
      url: "https://stage.folderhop.com/sms.php",
      type: "GET",
      data: { type: "send", number: currentNumber },
      success: function (data) {
        /* console.log(JSON.parse(data).status); */
        if (JSON.parse(data).status == "pending") {
          console.log("Auth Code Succesfully Sent.");
          $(".resend_msg").text("Pin Code Sent!");
        } else {
          console.log("Something went wrong..");
          //console.log(JSON.parse(data));
          $(".resend_msg").text("Something went wrong.. Failed to send!");
        }
        modal.style.display = "block";
      },
      error: function (error) {
        console.log("Problem sending Auth Code!");
        console.log(error);
      },
    });
  }

  $("#" + submitButton).click(function () {
    // start of each item check
    //console.log("Required Fields: " + requiredFields);

    $.each(requiredFields, function (index, item, array) {
      /* requiredFields.forEach((item, index, array) => { */

      var isLastElement = index == requiredFields.length - 1;

      if (isLastElement) {
        // This is the last one.
        /* console.log(`${allFieldsFilled} before check`); */
        if ($(".lp-pom-form-field").hasClass("fieldError")) {
          allFieldsFilled = false;
          //console.log(allFieldsFilled + " after check");
        } else {
          allFieldsFilled = true;
          //console.log(allFieldsFilled + " after check");
        }
      } else {
        if ($(".form_elem_" + item).hasClass("radio")) {
          /* console.log(`this item is a radio field ${item}`); */

          if ($(".form_elem_" + item).is(":checked")) {
            $($("#group_" + item))
              .closest(".lp-pom-form-field")
              .removeClass("fieldError");
          } else {
            $($("#group_" + item))
              .closest(".lp-pom-form-field")
              .addClass("fieldError");
          }
        } else if ($(".form_elem_" + item).hasClass("checkbox")) {
          /* console.log(`this item is a checkbox field ${item}`); */
        } else {
          /* console.log(`this item is either input or select field ${item}`); */

          let trimmedValue = $.trim($("#" + item).val());

          if (trimmedValue === "") {
            $("#" + item)
              .closest(".lp-pom-form-field")
              .addClass("fieldError");
          } else {
            if (
              item == "first_name" ||
              item == "last_name" ||
              item == "email" ||
              item == "phone"
            ) {
              if (
                $("#" + item)
                  .closest(".lp-pom-form-field")
                  .hasClass("fieldError")
              ) {
                // other fields have error
              } else {
                $("#" + item)
                  .closest(".lp-pom-form-field")
                  .removeClass("fieldError");
              }
            } else {
              $("#" + item)
                .closest(".lp-pom-form-field")
                .removeClass("fieldError");
            }
          }
        }
      }
    }); // end of each item check

    // TWILIO SEND AUTH CODE
    if (allFieldsFilled) {
      fullNumber = iti.getNumber();
      currentNumber = iti.getNumber();

      /* console.log(`${fullNumber} - fullnumber`); */
      $("#" + submitButton).addClass("disable-click");

       $.ajax({
        url: "https://stage.folderhop.com/sms.php",
        type: "GET",
        data: { type: "send", number: fullNumber },
        success: function (data) {
          if (
            JSON.parse(data).status == "pending" ||
            JSON.parse(data).status == "approved"
          ) {
            console.log("Auth Code Succesfully Sent.");
            verfication();
            $("#" + submitButton).removeClass("disable-click");
          } else if (JSON.parse(data).status == "denied") {
            console.log("Phone number is not valid");
            //console.log(JSON.parse(data));

            $("#" + submitButton).removeClass("disable-click");
          } else {
            console.log("Problem sending Auth Code! API error");
            //console.log(JSON.parse(data));
            forceRedirect();
          }
        },
        error: function (error) {
          console.log(error);
          console.log("Problem sending Auth Code! fallback");
          $("#" + submitButton).removeClass("disable-click");
        },
      }); 

      /* console.log("all fields good"); */
    }
  }); // end of submit click

  function forceRedirect() {
    setTimeout(function () {
      submitForm();
    }, 3500);
  }

  // TWILIO VERIFY AUTH CODE
  $("#" + verifyButton).click(function () {
    const verificationFieldTrimmed = $("#" + verificationField)
      .val()
      .replace(/\s+/g, "");

    if (verificationFieldTrimmed.length === 0) {
      $("#" + verificationField).addClass("verificationFieldError");
      $("#" + verificationFieldError).hide();
      $(".circle-loader").hide();
      $(".circle-loader").removeClass("load-complete");
      $(".checkmark").css("display", "none");
    } else if (
      verificationFieldTrimmed.length < 4 &&
      verificationFieldTrimmed.length > 0
    ) {
      $("#" + verificationField).addClass("verificationFieldError");
      $("#" + verificationFieldError).show();
      $(".circle-loader").hide();
      $(".circle-loader").removeClass("load-complete");
      $(".checkmark").css("display", "none");
    } else {
      // TWILIO VERIFY CODE
      /* console.log(fullNumber);
      console.log(verificationFieldTrimmed); */
      let cacheNumberToVerify;
      $.ajax({
        url: "https://stage.folderhop.com/sms.php",
        type: "GET",
        data: {
          type: "check",
          number: fullNumber,
          code: verificationFieldTrimmed,
        },
        beforeSend: function () {
          $("#" + verificationField).removeClass("verificationFieldError");
          $("#" + verificationFieldError).hide();
          $(".circle-loader").show(); // sending animation
          $(".circle-loader").removeClass("load-complete");
          $(".checkmark").css("display", "none");
          //console.log(`Trying to verify the phone number ${fullNumber}...`);
        },
        success: function (data) {
          let dataStatus = JSON.parse(data);
          cacheNumberToVerify = dataStatus.to;
          //console.log( `Verification result for the phone number ${cacheNumberToVerify} below: `  );
          if (dataStatus.status == "approved" && dataStatus.valid) {
            console.log("Succesfully verified.");
            $("#" + verificationField).removeClass("verificationFieldError");
            $("#" + verificationFieldError).hide();
            $(".circle-loader").show();
            $(".circle-loader").addClass("load-complete");
            $(".checkmark").css("display", "block"); // initiate form submit
             submitForm();  

            console.log("---Auth Code Matched!");
          } else {
            $("#" + verificationField).addClass("verificationFieldError");
            $("#" + verificationFieldError).show();
            $(".circle-loader").hide();
            $(".circle-loader").removeClass("load-complete");
            $(".checkmark").css("display", "none");
            console.log("---Auth Code does not Match!");
          }
          console.log(dataStatus);
        },
        error: function () {
          console.log("Problem verifying Auth Code!");
          forceRedirect(); 
        },
      });
    }
  }); // END OF TWILIO VERIFCATION BUTTON
</script>
