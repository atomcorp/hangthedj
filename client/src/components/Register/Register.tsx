import React from 'react';

const Register = (): JSX.Element => {
  return (
    <form>
      <label>
        Username: <input type="email" placeholder="Enter your username" />
      </label>
      <label>
        Email: <input type="email" placeholder="Enter your email" />
      </label>
      <label>
        Password: <input type="password" placeholder="Enter your password" />
      </label>
      <button>Submit</button>
    </form>
  );
};

export default Register;
