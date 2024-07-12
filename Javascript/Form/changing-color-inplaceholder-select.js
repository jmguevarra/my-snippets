<script type="text/javascript">
  $(document).ready(function(){
    $(this).addClass('--placeholder');
    $('select[name="timeline_to_purchase"]').change(function(){
      $(this).removeClass('--placeholder');
      if($(this).val() == '' || $(this).val() == null){
        $(this).addClass('--placeholder');
      }
    });
  });
/** select.--placeholder {
    color: rgba(0, 0, 0, 0.2) !important;
  } 
**/
</script>
