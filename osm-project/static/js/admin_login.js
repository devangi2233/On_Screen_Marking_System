var nameError = document.getElementById('name-error');
function validateName () {
  var name = document.getElementById('admin').value;

  if (name.length == 0 ) {
    nameError.innerHTML = 'Name is required' ;
    return false;
  }
  if (!name.match(/^[a-zA-Z]+$/)){
    nameError.innerHTML = 'Include only A-Z, a-z';
    return false;
  }
  nameError.innerHTML = ''
  return true;
}