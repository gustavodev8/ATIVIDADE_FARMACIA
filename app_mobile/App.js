import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import axios from 'axios';

export default function App() {
  const [tela, setTela] = useState('login'); // Pode ser 'login' ou 'home'
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [listaProdutos, setListaProdutos] = useState([]);

  // Função para logar
  const logar = () => {
    // TROQUE PELO SEU IP PARA TESTAR NO CELULAR
    axios.post('http://192.168.0.XX:3000/login', { email, senha })
      .then(res => {
        setUsuarioLogado(res.data);
        setTela('home');
      })
      .catch(() => Alert.alert("Erro", "Login ou senha inválidos"));
  };

  // Carregar produtos quando entrar na Home
  useEffect(() => {
    if (tela === 'home') {
      axios.get('http://192.168.0.XX:3000/produtos')
        .then(res => setListaProdutos(res.data));
    }
  }, [tela]);

  // TELA DE LOGIN
  if (tela === 'login') {
    return (
      <View style={styles.containerCentro}>
        <Text style={{ fontSize: 30, marginBottom: 20 }}>💊 FarmaApp</Text>
        <TextInput style={styles.campo} placeholder="E-mail" onChangeText={setEmail} />
        <TextInput style={styles.campo} placeholder="Senha" secureTextEntry onChangeText={setSenha} />
        <Button title="ENTRAR NO APP" onPress={logar} color="#007bff" />
      </View>
    );
  }

  // TELA DE VITRINE (HOME)
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Olá, {usuarioLogado.nome}!</Text>
      
      {usuarioLogado.recebe_promocao === 1 && (
        <View style={styles.tagVip}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>VOCÊ É CLIENTE VIP! DESCONTOS ATIVOS ✅</Text>
        </View>
      )}

      <FlatList
        data={listaProdutos}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={{ fontWeight: 'bold' }}>{item.nome}</Text>
            
            {usuarioLogado.recebe_promocao === 1 ? (
              <View>
                <Text style={styles.precoRiscado}>De: R$ {item.preco_normal}</Text>
                <Text style={styles.precoPromo}>Por: R$ {item.preco_desconto}</Text>
              </View>
            ) : (
              <Text>Preço: R$ {item.preco_normal}</Text>
            )}
          </View>
        )}
      />
      <Button title="Sair" onPress={() => setTela('login')} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  containerCentro: { flex: 1, justifyContent: 'center', padding: 40 },
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  campo: { borderBottomWidth: 1, marginBottom: 20, padding: 5 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  tagVip: { backgroundColor: 'green', padding: 10, marginVertical: 10, borderRadius: 5 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  precoRiscado: { textDecorationLine: 'line-through', color: 'gray' },
  precoPromo: { fontSize: 18, color: 'green', fontWeight: 'bold' }
});
