/* ---------------------------------------------------------------------------
 * Swipper
 * --------------------------------------------------------------------------- */
//static
const pmeCarousel = jQuery ( '.pme-testimonial .swiper-container' ),
  pmeSwiperInstance = pmeCarousel.data( 'swiper' );
pmeSwiperInstance.on('slideChange', function(){
    let image = jQuery('.testimonial-image img');
        image.attr('srcset', '');
    
    switch(this.realIndex){
        case 0:
            image.attr('src', '/wp-content/uploads/2021/01/S.-Lavallee.jpg');
            break;
        case 1:
            image.attr('src', '/wp-content/uploads/2021/01/Marc-W.jpg');
            break;
        case 2:
            image.attr('src', '/wp-content/uploads/2021/01/Nicole-P.jpg');
            break;
    }
});


//Dynamic
OOL.swiperEvents = function(){
    const coteSwiperContainer = $('.cote-testimonial .swiper-container'),
          coteSwiper = coteSwiperContainer.data('swiper');
    
    coteSwiper.on('slideChange', function(){
        let clientImgSrc = this.imagesToLoad,
            clientImg = $('.testi-image img').attr('srcset', '');
        
        switch(this.realIndex){
            case 0:
                clientImg.attr('src', clientImgSrc[1].currentSrc);
                break;
            case 1:
                clientImg.attr('src', clientImgSrc[2].currentSrc);
                break;
            case 2:
                clientImg.attr('src', clientImgSrc[3].currentSrc);
                break;
        }
    });
    
};