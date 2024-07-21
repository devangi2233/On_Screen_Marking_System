var nameError = document.getElementById('name-error');
const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
function validate_teacher_name () {
  var name = document.getElementById('teacher_name').value;

  if (name.length == 0 ) {
    nameError.innerHTML = 'Name is required' ;
    return false;
  }

  if (!name.match(/^[a-zA-Z, ]+$/)){
    nameError.innerHTML = 'Include only A-Z, a-z';
    return false;
  }
  nameError.innerHTML = ''
  return true;
}

var emailError = document.getElementById('email-error');
function validate_email(){
    var email = document.getElementById('teacher_email').value;

    if (email.length == 0 ) {
        emailError.innerHTML = 'Email is required' ;
        return false;
    }

    if(!isValidEmail(email)){
        emailError.innerHTML = 'Invalid Email ID';
        return false;
    }
    emailError.innerHTML = ''
    return true;
}