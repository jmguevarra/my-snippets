<script>
  
   window.ub.form.customValidators.phoneNumber = {
    isValid: function(value) {
      return /^[0-9]{10,}$/.test(value);
    },

    message: 'Please enter a minimum of 10 digits phone number',
  };
  window.ub.form.validationRules.phone.phoneNumber = true;



$('#postcode').keyup(function(){
     this.value = this.value.replace(/[^0-9]/g, '');
  });
</script>


