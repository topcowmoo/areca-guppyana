// Import necessary modules and hooks
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import { Form, Button, Alert } from 'react-bootstrap';
import Auth from '../utils/auth';

// Define the LoginForm component
const LoginForm = () => {
  // State to hold form data
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  // Mutation hook for user login
  const [login, { error }] = useMutation(LOGIN_USER);
  // State for form validation
  const [validated] = useState(false);
  // State for showing alert
  const [showAlert, setShowAlert] = useState(false);

  // Function to handle input change in the form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Call login mutation and pass in form data
      const { data } = await login({
        variables: { ...userFormData },
      });

      // If successful, log in user
      Auth.login(data.login.token);
    } catch (e) {
      console.error(e);
    }

    // Clear form data after submission
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  // Render the LoginForm component
  return (
    <>
      {/* Form for user login */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert to show if login credentials are incorrect */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>

        {/* Email input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Password input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>

        {/* Submit button */}
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>

      {/* Display error message if there's an error */}
      {error && (
        <div className="my-3 p-3 bg-danger text-white">
          {error.message}
        </div>
      )}
    </>
  );
};

// Export the LoginForm component
export default LoginForm;
