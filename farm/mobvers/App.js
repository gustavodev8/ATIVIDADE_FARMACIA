import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Alert, TouchableOpacity, Modal, Image } from 'react-native';
import axios from 'axios';

export default function App() {
  const [tela, setTela] = useState('login'); // pode serr tanto  'login' ou 'home'
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [listaProdutos, setListaProdutos] = useState([]);
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalAddAberto, setModalAddAberto] = useState(false);
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [produtoSendoEditado, setProdutoSendoEditado] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoPreco, setNovoPreco] = useState('');
  const [novaImagem, setNovaImagem] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Função para logar
  const logar = () => {
    console.log("tentando logar em: http://172.26.17.99:3000/login");
    axios.post('http://172.26.17.99:3000/login', { email, senha })
      .then(res => {
        setUsuarioLogado(res.data);
        setTela('home');
      })
      .catch((err) => {
        console.log("Erro no login: ", err);
        // MOCK LOGIN PARA TESTE SE O SERVIDOR ESTIVER FORA
        setUsuarioLogado({ nome: 'Visitante', recebe_promocao: 1 });
        setTela('home');
      });
  };

  // Carregar produtos quando entrar na Home
  useEffect(() => {
    if (tela === 'home') {
      axios.get('http://172.26.17.99:3000/produtos')
        .then(res => setListaProdutos(res.data))
        .catch(err => {
          console.log("erro de carregar produtos: ", err);
          // DADOS DE AMOSTRAGEM SE O SERVIDOR ESTIVER FORA
          setListaProdutos([
            { id: 1, nome: 'Paracetamol 500mg', preco_normal: '12.50', preco_desconto: '10.00', imagem: 'https://cdn.pixabay.com/photo/2016/11/02/10/44/pills-1791124_1280.jpg' },
            { id: 2, nome: 'Amoxicilina 250mg', preco_normal: '45.00', preco_desconto: '38.50', imagem: 'https://cdn.pixabay.com/photo/2017/08/25/11/24/pharmacy-2679803_1280.jpg' },
            { id: 3, nome: 'Vitamina C 1g', preco_normal: '22.90', preco_desconto: '19.00', imagem: 'https://cdn.pixabay.com/photo/2017/08/01/10/19/sunscreen-2564257_1280.jpg' },
          ]);
        });
    }
  }, [tela]);

  const adicionarProdutoLocal = () => {
    if (!novoNome || !novoPreco) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    const novo = {
      id: Date.now(),
      nome: novoNome,
      preco_normal: parseFloat(novoPreco).toFixed(2),
      preco_desconto: (parseFloat(novoPreco) * 0.9).toFixed(2),
      imagem: novaImagem || 'https://via.placeholder.com/150'
    };
    setListaProdutos([novo, ...listaProdutos]);
    setNovoNome('');
    setNovoPreco('');
    setNovaImagem('');
    setModalAddAberto(false);
    Alert.alert("Sucesso", "Produto adicionado (Amostragem)");
  };

  const prepararEdicao = (produto) => {
    setProdutoSendoEditado(produto);
    setNovoNome(produto.nome);
    setNovoPreco(produto.preco_normal.toString());
    setNovaImagem(produto.imagem);
    setModalEditAberto(true);
  };

  const salvarEdicaoLocal = () => {
    if (!novoNome || !novoPreco) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    setListaProdutos(listaProdutos.map(p => 
      p.id === produtoSendoEditado.id 
        ? { 
            ...p, 
            nome: novoNome, 
            preco_normal: parseFloat(novoPreco).toFixed(2),
            preco_desconto: (parseFloat(novoPreco) * 0.9).toFixed(2),
            imagem: novaImagem
          } 
        : p
    ));
    setModalEditAberto(false);
    setProdutoSendoEditado(null);
    setNovoNome('');
    setNovoPreco('');
    setNovaImagem('');
    Alert.alert("Sucesso", "Produto editado (Amostragem)");
  };

  const excluirProdutoLocal = (id) => {
    Alert.alert(
      "Confirmar",
      "Deseja excluir este produto? (Amostragem)",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", onPress: () => {
          setListaProdutos(listaProdutos.filter(p => p.id !== id));
        }, style: "destructive" }
      ]
    );
  };

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
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuAberto}
        onRequestClose={() => setMenuAberto(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuAberto(false)}
        >
          <View style={styles.menuLateral}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitulo}>Sobre o Projeto</Text>
              <TouchableOpacity onPress={() => setMenuAberto(false)}>
                <Text style={styles.fecharMenu}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuConteudo}>
              <Text style={styles.descricaoProjeto}>
                Esta aplicação foi desenvolvida como parte de uma atividade de Farmácia, 
                visando oferecer uma interface intuitiva para consulta de produtos e promoções exclusivas.
              </Text>
              
              <Text style={styles.labelCriadores}>Desenvolvido por:</Text>
              <Text style={styles.nomeCriador}>• Gustavo Pereira Santana</Text>
              <Text style={styles.nomeCriador}>• Yuri da Anunciação</Text>

              <View style={styles.divisorMenu} />
              
              <Text style={styles.labelCriadores}>Modo de Visualização:</Text>
              <TouchableOpacity 
                style={[styles.botaoModo, isAdmin ? styles.botaoModoAdmin : styles.botaoModoCliente]} 
                onPress={() => {
                  setIsAdmin(!isAdmin);
                  setMenuAberto(false);
                  Alert.alert("Modo Alterado", `Agora você está vendo como ${!isAdmin ? 'ADMINISTRADOR' : 'CLIENTE'}`);
                }}
              >
                <Text style={styles.textoModo}>{isAdmin ? 'ALTERAR PARA CLIENTE' : 'ALTERAR PARA ADMIN'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuRodape}>
              <Text style={styles.versaoTexto}>Versão 1.0.0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalAddAberto}
        onRequestClose={() => setModalAddAberto(false)}
      >
        <View style={styles.modalOverlayCentro}>
          <View style={styles.cardAdd}>
            <Text style={styles.menuTitulo}>Novo Produto</Text>
            <Text style={styles.headerSubtitle}>Apenas para amostragem</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (R$)"
              keyboardType="numeric"
              value={novoPreco}
              onChangeText={setNovoPreco}
              style={{ ...styles.input, marginTop: 12 }}
            />
            <TextInput
              style={styles.input}
              placeholder="URL da Imagem"
              value={novaImagem}
              onChangeText={setNovaImagem}
              style={{ ...styles.input, marginTop: 12 }}
            />

            <View style={styles.acoesAdd}>
              <TouchableOpacity 
                style={styles.botaoCancelar} 
                onPress={() => setModalAddAberto(false)}
              >
                <Text style={styles.textoCancelar}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.botaoConfirmar} 
                onPress={adicionarProdutoLocal}
              >
                <Text style={styles.botaoTexto}>ADICIONAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalEditAberto}
        onRequestClose={() => setModalEditAberto(false)}
      >
        <View style={styles.modalOverlayCentro}>
          <View style={styles.cardAdd}>
            <Text style={styles.menuTitulo}>Editar Produto</Text>
            <Text style={styles.headerSubtitle}>Ajuste os dados (Amostragem)</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do produto"
              value={novoNome}
              onChangeText={setNovoNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (R$)"
              keyboardType="numeric"
              value={novoPreco}
              onChangeText={setNovoPreco}
              style={{ ...styles.input, marginTop: 12 }}
            />
            <TextInput
              style={styles.input}
              placeholder="URL da Imagem"
              value={novaImagem}
              onChangeText={setNovaImagem}
              style={{ ...styles.input, marginTop: 12 }}
            />

            <View style={styles.acoesAdd}>
              <TouchableOpacity 
                style={styles.botaoCancelar} 
                onPress={() => setModalEditAberto(false)}
              >
                <Text style={styles.textoCancelar}>CANCELAR</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.botaoSalvar} 
                onPress={salvarEdicaoLocal}
              >
                <Text style={styles.botaoTexto}>SALVAR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setMenuAberto(true)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.saudacao}>Olá, {usuarioLogado.nome}</Text>
          <Text style={styles.dataHoje}>{isAdmin ? 'PAINEL ADMINISTRATIVO' : 'Confira as ofertas de hoje'}</Text>
        </View>
        {isAdmin && (
          <TouchableOpacity onPress={() => setModalAddAberto(true)} style={styles.addBtnHeader}>
            <Text style={styles.addBtnTexto}>+ NOVO</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => setTela('login')} style={{ marginLeft: 15 }}>
          <Text style={styles.linkSair}>Sair</Text>
        </TouchableOpacity>
      </View>
      
      {usuarioLogado.recebe_promocao === 1 && !isAdmin && (
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
          <TouchableOpacity 
            style={styles.itemCard} 
            onPress={() => isAdmin && prepararEdicao(item)}
            activeOpacity={isAdmin ? 0.7 : 1}
          >
            {item.imagem && (
              <Image source={{ uri: item.imagem }} style={styles.produtoImagem} />
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.produtoNome}>{item.nome}</Text>
              <Text style={styles.produtoDescricao} numberOfLines={1}>
                {isAdmin ? 'Toque para editar este produto' : 'Descrição do produto disponível na loja'}
              </Text>
              {isAdmin && (
                <TouchableOpacity onPress={() => excluirProdutoLocal(item.id)}>
                  <Text style={styles.btnExcluir}>Excluir Produto</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <View style={styles.precoContainer}>
              {usuarioLogado.recebe_promocao === 1 && !isAdmin ? (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.precoAnterior}>R$ {item.preco_normal}</Text>
                  <Text style={styles.precoAtual}>R$ {item.preco_desconto}</Text>
                </View>
              ) : (
                <Text style={styles.precoUnico}>R$ {item.preco_normal}</Text>
              )}
            </View>
          </TouchableOpacity>
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
  produtoImagem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
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
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
  },
  menuLateral: {
    width: '80%',
    height: '100%',
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 15,
  },
  menuTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  fecharMenu: {
    fontSize: 24,
    color: '#666',
    padding: 5,
  },
  menuConteudo: {
    flex: 1,
  },
  descricaoProjeto: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 25,
  },
  labelCriadores: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  nomeCriador: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 8,
    fontWeight: '500',
  },
  menuRodape: {
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingVertical: 20,
    alignItems: 'center',
  },
  versaoTexto: {
    color: '#AAA',
    fontSize: 12,
  },
  modalOverlayCentro: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  cardAdd: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  acoesAdd: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
  botaoCancelar: {
    padding: 12,
    marginRight: 8,
  },
  textoCancelar: {
    color: '#666',
    fontWeight: '600',
  },
  botaoConfirmar: {
    backgroundColor: '#28A745',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  botaoSalvar: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addBtnHeader: {
    backgroundColor: '#F1F3F5',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addBtnTexto: {
    color: '#007BFF',
    fontWeight: '700',
    fontSize: 12,
  },
  btnExcluir: {
    color: '#DC3545',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  divisorMenu: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 20,
  },
  botaoModo: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  botaoModoAdmin: {
    backgroundColor: '#6C757D',
  },
  botaoModoCliente: {
    backgroundColor: '#007BFF',
  },
  textoModo: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  }
});