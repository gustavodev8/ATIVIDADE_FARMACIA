import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function App() {
  const [tela, setTela] = useState('login'); // Pode ser 'login' ou 'home'
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [listaProdutos, setListaProdutos] = useState([]);

  // Função para logar
  const logar = () => {
    console.log("tentando logar em: http://172.26.17.143:3000/login");
    axios.post('http://172.26.17.143:3000/login', { email, senha })
      .then(res => {
        setUsuarioLogado(res.data);
        setTela('home');
      })
      .catch((err) => {
        console.log("Erro no login: ", err);
        if (err.response) {
          // O servidor respondeu com um erro (401, etc)
          if (err.response.status === 401) {
            Alert.alert("Erro de Login", err.response.data); // "Usuário não existe" ou "Senha incorreta"
          } else {
            Alert.alert("Erro", "Erro no servidor: " + err.response.status);
          }
        } else if (err.request) {
          // A requisição foi feita mas não houve resposta (erro de rede/IP)
          Alert.alert("Erro de Conexão", "Não foi possível conectar ao servidor. Verifique se o IP está correto e se está na mesma rede.");
        } else {
          Alert.alert("Erro", "Erro ao tentar logar.");
        }
      });
  };

  // Carregar produtos quando entrar na Home
  useEffect(() => {
    if (tela === 'home') {
      axios.get('http://172.26.17.143:3000/produtos')
        .then(res => setListaProdutos(res.data))
        .catch(err => console.log("Erro ao carregar produtos: ", err));
    }
  }, [tela]);

  // TELA DE LOGIN
  if (tela === 'login') {
    return (
      <View style={styles.containerCentro}>
        <View style={styles.cardLogin}>
          <Text style={styles.headerTitle}>Farmácia Central</Text>
          <Text style={styles.headerSubtitle}>acesse a conta pra ver as ofertas</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Digite seu e-mail" 
              placeholderTextColor="#999"
              onChangeText={setEmail} 
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Digite sua senha" 
              placeholderTextColor="#999"
              secureTextEntry 
              onChangeText={setSenha} 
            />
          </View>

          <TouchableOpacity style={styles.botaoLogin} onPress={logar}>
            <Text style={styles.botaoTexto}>ENTRAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // TELA DE VITRINE (HOME)
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.saudacao}>Olá, {usuarioLogado.nome}</Text>
          <Text style={styles.dataHoje}>Confira as ofertas de hoje</Text>
        </View>
        <TouchableOpacity onPress={() => setTela('login')}>
          <Text style={styles.linkSair}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      {usuarioLogado.recebe_promocao === 1 && (
        <View style={styles.bannerVip}>
          <Text style={styles.vipTexto}>CLIENTE FIDELIDADE</Text>
          <Text style={styles.vipSubtexto}>Descontos exclusivos aplicados</Text>
        </View>
      )}

      <FlatList
        data={listaProdutos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listaEspacamento}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.produtoNome}>{item.nome}</Text>
              <Text style={styles.produtoDescricao} numberOfLines={1}>Descrição do produto disponível na loja</Text>
            </View>
            
            <View style={styles.precoContainer}>
              {usuarioLogado.recebe_promocao === 1 ? (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.precoAnterior}>R$ {item.preco_normal}</Text>
                  <Text style={styles.precoAtual}>R$ {item.preco_desconto}</Text>
                </View>
              ) : (
                <Text style={styles.precoUnico}>R$ {item.preco_normal}</Text>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  containerCentro: { 
    flex: 1, 
    justifyContent: 'center', 
    backgroundColor: '#F8F9FA',
    padding: 24 
  },
  cardLogin: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5
  },
  headerTitle: { 
    fontSize: 26, 
    fontWeight: '700', 
    color: '#1A1A1A',
    textAlign: 'center'
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 4
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  input: { 
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1A1A1A'
  },
  botaoLogin: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 12
  },
  botaoTexto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1
  },
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE'
  },
  saudacao: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1A1A1A' 
  },
  dataHoje: {
    fontSize: 12,
    color: '#888'
  },
  linkSair: {
    color: '#DC3545',
    fontWeight: '600'
  },
  bannerVip: { 
    backgroundColor: '#28A745', 
    padding: 16, 
    margin: 20, 
    borderRadius: 8,
    alignItems: 'center'
  },
  vipTexto: { 
    color: 'white', 
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1
  },
  vipSubtexto: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11
  },
  listaEspacamento: {
    paddingHorizontal: 20,
    paddingBottom: 40
  },
  itemCard: { 
    backgroundColor: '#FFF',
    padding: 16, 
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomColor: '#F1F3F5'
  },
  itemInfo: {
    flex: 1,
    marginRight: 12
  },
  produtoNome: { 
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4
  },
  produtoDescricao: {
    fontSize: 12,
    color: '#888'
  },
  precoContainer: {
    alignItems: 'flex-end'
  },
  precoAnterior: { 
    fontSize: 12,
    textDecorationLine: 'line-through', 
    color: '#ADB5BD' 
  },
  precoAtual: { 
    fontSize: 18, 
    color: '#28A745', 
    fontWeight: '700' 
  },
  precoUnico: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057'
  }
});
