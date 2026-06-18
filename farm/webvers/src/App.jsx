import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const salvar = (e) => {
    e.preventDefault();
    setCarregando(true);
    axios.post('http://localhost:3000/cadastrar', { nome, email, senha })
      .then(() => {
        alert("Cadastro realizado com sucesso! Baixe nosso app para aproveitar os descontos.");
        setNome(''); setEmail(''); setSenha('');
      })
      .catch(() => alert("Erro ao cadastrar. Tente novamente mais tarde."))
      .finally(() => setCarregando(false));
  };

  return (
    <div className="landing-container">
      <header className="header">
        <div className="logo">Farmácia<span>Central</span></div>
        <div className="header-links">
          {/* Poderia adicionar links aqui se necessário */}
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Cuidar da sua saúde nunca foi tão vantajoso.</h1>
            <p>
              Cadastre-se agora em nossa plataforma web e libere descontos exclusivos 
              de até 40% em medicamentos e produtos de higiene através do nosso aplicativo móvel.
            </p>
            
            <div className="benefits">
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Descontos exclusivos para membros</span>
              </div>
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Acompanhamento de pedidos em tempo real</span>
              </div>
              <div className="benefit-item">
                <span className="check-icon">✓</span>
                <span>Histórico de compras simplificado</span>
              </div>
            </div>
          </div>

          <div className="caixa">
            <h2>Crie sua conta</h2>
            <p>Preencha os dados abaixo para começar.</p>
            
            <form onSubmit={salvar}>
              <div className="form-group">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  placeholder="Ex: João Silva" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>E-mail</label>
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Senha</label>
                <input 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  value={senha} 
                  onChange={e => setSenha(e.target.value)} 
                  required 
                />
              </div>

              <button type="submit" disabled={carregando}>
                {carregando ? 'PROCESSANDO...' : 'CADASTRAR AGORA'}
              </button>
            </form>
            
            <div className="footer-form">
              Ao se cadastrar, você concorda com nossos termos de uso.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
