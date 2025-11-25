import { useState } from 'react';

export default function useFormValidation(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const validationErrors = validate({ ...values, [name]: value });
    setErrors(validationErrors);
  };

  return { values, errors, handleChange, setValues };
}
