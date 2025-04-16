export const checkValidData = (email, password, name = null) => {
    const isEmailValid = /[a-z0-9._%+!$&*=^|~#%'`?{}/-]+@([a-z0-9-]+\.){1,}([a-z]{2,16})/.test(email);
    const isPasswordValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);
  
    // Only validate name if it's passed (i.e., during Sign Up)
    if (name !== null) {
      const isNameValid = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/.test(name);
      if (!isNameValid) return "Please enter a valid Name";
    }
  
    if (!isEmailValid) return "Please enter a valid Email Id";
    if (!isPasswordValid) return "Please enter a valid Password";
  
    return null;
  };
  