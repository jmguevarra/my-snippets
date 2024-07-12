<script type="text/javascript">
 $(document).ready(function(){
    $('select[name="timeline_to_purchase"]').addClass('--placeholder');
    $('select[name="timeline_to_purchase"]').focus(function(){
      $('select[name="timeline_to_purchase"]').removeClass('--placeholder');
    });
    $('select[name="timeline_to_purchase"]').blur(function(){
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
