$(document).ready(function() {
  document.querySelector('input[name="postcode"]').addEventListener('input', function(event) {
    let inputValue = event.target.value;
    let numericValue = inputValue.replace(/[^0-9]/g, '');
    numericValue = numericValue.slice(0, 4);
    event.target.value = numericValue;
  });
});
