 

const popupBtns = document.querySelectorAll('.popup-download');
      popupBtns.forEach( popupBtn => {
          popupBtn.addEventListener('click', (e) => {

            e.preventDefault();
          

            MktoForms2.loadForm("//app-sn03.marketo.com", "272-QDC-229", 1746, (form) => {
                MktoForms2.lightbox(form).show();
                
                  form.onSuccess( (values, followUpUrl) => {
                      let brochure = popupBtn.getAttribute('href');

                      window.open(brochure);

                      return false;
                  });
              }
            );

          });
      });