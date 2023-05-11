<script defer type="text/javascript">
  $.fn.parallaxRoundel = function(top, speed, start, end) {
    var toptemp = top;
    var lastScrollTop = 0;
    var p = this;
    $(window).scroll(function() {
      var wScroll = $(window).scrollTop();
      if (wScroll >= start && wScroll <= end ) {
        if (wScroll > lastScrollTop) {
          toptemp = toptemp - speed;
        } else if(wScroll == 0) {
          toptemp = toptemp + speed;
        } else {
          toptemp = toptemp + speed;
        }
      } else if (wScroll == 0 || wScroll < start) {
        toptemp = top;
      }
      p.css('top' , (toptemp) + 'px');
      lastScrollTop = wScroll;
    });

  }
  $(document).ready(function() { 
    //Usage
    $('#lp-pom-box-641').parallaxRoundel(938, 0.75, 638, 1238);
  });
</script>
