import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const salvar = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/cadastrar', { nome, email, senha })
      .then(() => {
        alert("vc está cadastrado agora use o app para ver os descontos.");
        setNome(''); setEmail(''); setSenha('');
      })
      .catch(() => alert("erro ao cadastrar."));
  };

  return (
    <div className="corpo">
      <div className="caixa">
        <h1>Farmácia Central </h1>
        <p>cadastre-se para ganhar descontos no nosso aplicativo</p>
        
        <form onSubmit={salvar}>
          <input type="text" placeholder="Seu nome" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="email" placeholder="Seu e-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Crie uma senha" value={senha} onChange={e => setSenha(e.target.value)} required />
          <button type="submit">CADASTRAR E GANHAR DESCONTOS</button>
        </form>
      </div>
    </div>
  );
}

export default App;
