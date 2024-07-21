function validate(){
    var check = true;
    
    
    const reset_email = document.getElementById('reset_email');
    const reset_pswd = document.getElementById('reset_pswd');
   
    
    const isValidEmail = reset_email => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(reset_email).toLowerCase());
    }
    
    const emailValue = reset_email.value.trim();
    const passwordValue = reset_pswd.value.trim();
  
    if(emailValue === '') {
      setError(reset_email, 'Email is required');
      check = false;
    } else if (!isValidEmail(emailValue)) {
      setError(reset_email, 'Provide a valid email address');
      check = false;
    } else {
      setSuccess(reset_email);
    }
  
    if(passwordValue === '') {
      setError(reset_pswd, 'Password is required');
      check = false;
    } else if (passwordValue.length < 8 ) {
      setError(reset_pswd, 'Password must be at least 8 character.')
      check = false;
    } else {
      setSuccess(reset_pswd);
    }
  
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