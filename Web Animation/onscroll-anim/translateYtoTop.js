<script type="text/javascript">
  $(document).ready(function() {

    $(window).scroll(function(){
      
      $('.anim-scroll').each(function(index, element){
        let elTop = element.getBoundingClientRect().top,
            elBot = element.getBoundingClientRect().bottom;

        if (elTop < window.innerHeight && elBot > 0) {
          element.classList.add('visible');
        }
      });
      
    });
  });
</script>
