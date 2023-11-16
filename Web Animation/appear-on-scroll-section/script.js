
<script>
  $(document).ready(function(){  
    $(window).scroll(function(){
      const secTopOffset = $('.onscroll-animsec').offset().top;
      const winYScroll = $(window).scrollTop();

      if(winYScroll >= secTopOffset - $(window).innerHeight()/ 2){
        $('.ree-lg-anim').addClass('show');
      }
    });
  });
</script>

