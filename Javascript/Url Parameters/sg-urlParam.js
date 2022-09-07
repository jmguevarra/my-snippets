<script type="text/javascript">
  
  const getUrlParam = function(param){
  	let keyParam = decodeURIComponent(window.location.search).slice(1).split('&');
    let keyValue = '';
    
    keyParam.forEach(function(obj){
    	let paramArr = obj.split('=');
      	if(paramArr[0] === param){
        	keyValue = paramArr[1];
        }
    });
    
    return keyValue;
  };
  
  $(document).ready(function(){
    if(getUrlParam('first_name') !== ''){
    	localStorage.setItem('first_name', getUrlParam('first_name'));
    }
	if(localStorage.getItem("first_name") !== null){
       $('.dynamic-first-name').text(localStorage.getItem("first_name"));
    }
   
  });
</script>