import React from 'react'

const LoginPage = () => {

      const [formData, setFormData] = useState({
      username: '',
      password: '',
    });

      const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      
    </div>
  )
}

export default LoginPage
