<div class="module-form enquiry-form-sec">
  <div class="page-center">
    <div class="enquiry-form">
      <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>
      <script>     
        hbspt.forms.create({
          region: "na1",
          portalId: "7549024",
          formId: "a5927db0-d4b5-422f-a4ff-ef2d32480dae",
          onFormSubmit: function($form) {
            const $subValues = $form.serializeArray();

            const rowData = {
              "values": {
                "firstname": $subValues.find(item => item.name === 'firstname').value,
                "lastname": $subValues.find(item => item.name === 'lastname').value,
                "email": $subValues.find(item => item.name === 'email').value,
                "mobilephone": $subValues.find(item => item.name === 'mobilephone').value,
              }
            };
            const config = {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(rowData)
            };
            console.log(rowData);
            alert("Hi");
            fetch('https://mp.kongo.melbourne/_hcms/api/hubdbaddcontact', config).then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
              }
              return response.json();
            }).then(data => {
              console.log("Added Contact");
            }).catch(error => {
              console.log("Error on adding contact: "+error);
            });
          }
        });
      </script>
    </div>
  </div>
</div>
