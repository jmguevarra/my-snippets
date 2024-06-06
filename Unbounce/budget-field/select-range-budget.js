<script type="text/javascript">
  $(document).ready(function(){
    
    /*Budget Fields Management*/
    $('select[name="budget_text"]').change(function(){
      if($(this).val() == 'My budget/preference is not listed here' || $(this).val() == ''){
        $('input[name="budget_min"]').val('');
        $('input[name="budget_max"]').val('');
        $('input[name="budget_picklist"]').val('');
      	return;
      }
        
      const value = $(this).val(),
            removeChars = value.replace(/[$KkMm+]/g, ''),
            splitValue = removeChars.split('-');

      if(splitValue.length === 2){
        const minValue = parseFloat(splitValue[0].trim()),
              maxValue = parseFloat(splitValue[1].trim());

        if(minValue >= 100 && maxValue < 950){
          const sgSFPicklistValue = `$${(maxValue - 50)}K - $${maxValue}K`;
          $('input[name="budget_min"]').val(minValue * 1000);
          $('input[name="budget_max"]').val(maxValue * 1000);
          $('input[name="budget_picklist"]').val(sgSFPicklistValue);
        }
        if(minValue >= 1 && maxValue <= 2){
          const sgSFPicklistValue = `$${maxValue - 0.1}M - $${maxValue}M`;
          $('input[name="budget_min"]').val(minValue * 1000000);
          $('input[name="budget_max"]').val(maxValue * 1000000);
          $('input[name="budget_picklist"]').val(sgSFPicklistValue);
        }
        if(value == '$950K - $1M'){
          $('input[name="budget_min"]').val(950000);
          $('input[name="budget_max"]').val(1000000);
          $('input[name="budget_picklist"]').val('$950K - $1M');
        }
      }

      if(splitValue.length === 1 && /[Mm]/.test(value)){
        const minMaxValue = parseInt(removeChars.trim()),
              sgSFPicklistValue = `$${minMaxValue}M+`;
        $('input[name="budget_min"]').val(minMaxValue * 1000000);
        $('input[name="budget_max"]').val(minMaxValue * 1000000);
        $('input[name="budget_picklist"]').val(sgSFPicklistValue);
      }


    });
    /*End Budget Fields Management*/
  });
</script>
