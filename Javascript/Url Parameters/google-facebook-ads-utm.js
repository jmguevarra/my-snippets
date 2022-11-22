<script defer="">
  $(document).ready(function() {
      // Detect URL Paramaters
      $.urlParam = function(name) {
          var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
          if (results == null) {
              return "";
          } else {
              return results[1] || 0;
          }
      }

      // Create variables
      var sourceParam;
      var sourceField;

      // Grab the source from any existing source paramater
      if (decodeURIComponent($.urlParam('utm_source')) != "") {
          sourceParam = decodeURIComponent($.urlParam('utm_source'));
      } else if (decodeURIComponent($.urlParam('source')) != "") {
          sourceParam = decodeURIComponent($.urlParam('source'));
      } else if (decodeURIComponent($.urlParam('Source')) != "") {
          sourceParam = decodeURIComponent($.urlParam('Source'));
      }

      // Detect source from referrer if no source is provided
      if (sourceParam == "" || sourceParam == undefined) {
          console.log($("#lp-pom-form-42 #referrer").val());
          if ($("#lp-pom-form-42 #referrer").val().indexOf("facebook") != -1) {
              sourceField = "facebook";
          } else if ($("#lp-pom-form-42 #referrer").val().indexOf("linkedin.com") != -1) {
              sourceField = "linkedin";
          } else if ($("#lp-pom-form-42 #referrer").val().indexOf("domain.com.au") != -1) {
              sourceField = "domain";
          } else if ($("#lp-pom-form-42 #referrer").val().indexOf("realestate.com.au") != -1) {
              sourceField = "rea";
          } else if (($("#lp-pom-form-42 #referrer").val().indexOf("google.com.au")) != -1 || ($("#lp-pom-form-42 #referrer").val().indexOf("www.googleadservices.com")) != -1) {
              sourceField = "googlesearch";
      		} else {
            sourceField = "";
          }
  		//Clean up source formatting
  } else if (sourceParam == "Facebook") {
      sourceField = "facebook";
  } else if (sourceParam == "REA") {
      sourceField = "rea";
  } else if (sourceParam == "reapp" || sourceParam == "REA-pp") {
      sourceField = "rea_app";
  } else if (sourceParam == "edm" || sourceParam == "Email") {
      sourceField = "email";
  } else if (sourceParam == "google" || sourceParam == "Google" || sourceParam == "googleadwords") {
      sourceField = "googlesearch";
  } else if (sourceParam == "retargeting") {
      sourceField = "googledisplay";
  } else {
    sourceField = sourceParam;
  }

  //Set hidden source or Source field
  $("#lp-pom-form-42 #source").val(sourceField);
  $("#lp-pom-form-42 #Source").val(sourceField);
  });
</script>
