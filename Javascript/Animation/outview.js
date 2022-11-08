
 $(window).scroll(function(){
    inViewport();
  }); $(window).resize(function(){
    inViewport();
  }); function inViewport(){
    var absHeight = $(window).height()-40;
   // console.log("dfdf",absHeight)
    $('.out-view').each(function(){
      var divPos = $(this).offset().top,
          topOfWindow = $(window).scrollTop();

      if( divPos < topOfWindow + absHeight ){
        $(this).addClass('in-view');
      }
    });
  }
