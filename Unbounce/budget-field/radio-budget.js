/*Budget Fields Management*/
    $('input[name="budget_text"]').click(function(){
      $('input[name="budget_min"]').val('');
      $('input[name="budget_max"]').val('');
      $('input[name="budget_picklist"]').val('');

      if($(this).prop('checked')){
        const value = $(this).val();

        if(value == '$2M+'){
          $('input[name="budget_min"]').val('2000000');
          $('input[name="budget_max"]').val('2000000');
          $('input[name="budget_picklist"]').val('$2M+');
          return null;
        }

        const valuesArr = transformRange(value);
        const minValue = parseFloat(valuesArr[0]),
              maxValue = parseFloat(valuesArr[1]);
        const Mil = 1000000;
        let sgFMinValue = 0,
            sgFMaxValue = 0,
            sgFPicklistValue = '';

        sgFMinValue = minValue * Mil;
        sgFMaxValue = maxValue * Mil;

        if(valuesArr.length > 1){
          if(minValue >= 0.1 && maxValue < 1){
            const maxValueToHundred = maxValue * 1000;
            sgFPicklistValue = `$${(maxValueToHundred - 50)}K - $${maxValueToHundred}K`;
          }
          if(minValue >= 1 && maxValue <= 2){
            const roundedMin = parseFloat((maxValue - 0.1).toFixed(1));
            sgFPicklistValue = `$${roundedMin}M - $${maxValue}M`;
          }
          if(minValue >= 0.95 && maxValue == 1){
            sgFPicklistValue = '$950K - $1M';
          }
        }

        if(valuesArr.length == 1 && minValue >= 2){
          sgFMinValue = minValue * Mil;
          sgFMaxValue = minValue * Mil;
          sgFPicklistValue = `$${minValue}M+`;
        }

        $('input[name="budget_min"]').val(sgFMinValue);
        $('input[name="budget_max"]').val(sgFMaxValue);
        $('input[name="budget_picklist"]').val(sgFPicklistValue);
      }
    });

    function transformRange(rangeStr) {
      const match = rangeStr.match(/\$([\d.]+)([KkMm]?) - \$([\d.]+)([KkMm]?)/);

      if (!match) {
        return null;
      }

      let [, start, startUnit, end, endUnit] = match;
      if (startUnit.toLowerCase() == 'k') {
        start = (parseFloat(start) / 1000).toString();
      } else if (startUnit.toLowerCase()  == 'm') {
        start = parseFloat(start).toString();
      }

      if (endUnit.toLowerCase() == 'k') {
        end = (parseFloat(end) / 1000).toString();
      } else if (endUnit.toLowerCase()  == 'm') {
        end = parseFloat(end).toString();
      }

      return [start, end];
    }
    /*End Budget Fields Management*/
