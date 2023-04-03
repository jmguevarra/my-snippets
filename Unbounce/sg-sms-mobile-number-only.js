 // on blur: validate
  input.addEventListener("blur", function () {
    reset();
    if (input.value.trim()) {
      if (iti.isValidNumber()) { 
        if(iti.getSelectedCountryData().iso2 === "au" && iti.getNumberType() !== 1){ // In AU number must be mobile only. ref https://github.com/jackocnr/intl-tel-input/blob/master/src/js/utils.js#L119
          input.classList.add("error");
          var errorCode = iti.getValidationError();
          errorMsg.innerHTML = errorMap[5];
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
  });
