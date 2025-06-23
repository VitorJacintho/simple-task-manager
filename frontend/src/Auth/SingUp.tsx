import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3333/api/auth/signup', formData);
      alert('Usuário criado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar usuário!');
    }
  };

  return (
    <div className="form">
      <h2>Criar Conta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome de Usuário</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Foto de Perfil (URL)</label>
          <input
            type="text"
            name="profilePicture"
            value={formData.profilePicture}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default SignUp;
