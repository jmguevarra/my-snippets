<script>
  jQuery(document).ready(function(){
    //redirection to O variant if utm_source is from google
    if(decodeURIComponent($.urlParam('utm_source')).includes("google")){
      const params = window.location.search;
      const hash = window.location.href.split('#')[1];
      window.location.href="https://register.avid.com.au/brentwoodforest/thank-you/o.html"+params+"#"+hash;
    }
  });
</script>
