// $("#icon1").hide();
// $("#icon2").hide();
// $("#pswd_icon").hide();
// function validation() { 
//   var check = true;

//   teacher_name=document.myform.name.value;
//   const teachernameRegex = /^[A-Za-z]+$/
//   if(!teachernameRegex.test(teacher_name)){
//     $("#icon1").show();
//     check = false;
//   }
  
//   email = document.myform.email.value;
//   const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/
//   if(!emailRegex.test(email)){
//     $("#icon2").show();
//     check = false;
//   }

//   pw1 = document.myform.pswd.value;
//   pw2 = document.myform.confirmpswd.value;
//   if(pw1 != pw2)  
//   {   
//       $("#pswd_icon").show();
//       check = false;
//   }
//   console.log(check);
//   return check;
// }  





  $('table').each(function(){
    $('th:first-child,thead td:first-child', this).each(function(){
      $(this).before('<th>ID</th>');
    });
    $('td:first-child', this).each(function(i){
      $(this).before('<td>'+(i+1)+'</td>');
    });
  });



function validate(){
  var check = true;
  
  const username = document.getElementById('name');
  const email = document.getElementById('email');
  const pswd = document.getElementById('pswd');
  const confirmpswd = document.getElementById('confirmpswd');
  
  const isValidEmail = email => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
  }
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();
  const passwordValue = pswd.value.trim();
  const password2Value = confirmpswd.value.trim();
  const teachernameRegex = /^[A-Za-z, ]+$/

  if(usernameValue === '') {
    setError(username, 'Username is required');
    check = false;
  } else if(!teachernameRegex.test(usernameValue)){
    setError(username, 'Invalid username');
    check = false;
  } else {
    setSuccess(username);
  }

  if(emailValue === '') {
    setError(email, 'Email is required');
    check = false;
  } else if (!isValidEmail(emailValue)) {
    setError(email, 'Provide a valid email address');
    check = false;
  } else {
    setSuccess(email);
  }

  if(passwordValue === '') {
    setError(pswd, 'Password is required');
    check = false;
  } else if (passwordValue.length < 8 ) {
    setError(pswd, 'Password must be at least 8 character.')
    check = false;
  } else {
    setSuccess(pswd);
  }

  if(password2Value === '') {
    setError(confirmpswd, 'Please confirm your password');
    check = false;
  } else if (password2Value !== passwordValue) {
    setError(confirmpswd, "Passwords doesn't match");
    check = false;
  } else {
    setSuccess(confirmpswd);
  }
  return check;
}


const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success')
}

const setSuccess = element => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
};