import React from 'react';
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';
import { Audio } from 'expo-av';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class Principal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: undefined,
      senha: undefined,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require('/imgs/re.png')} style={styles.image} />
        <Text style={styles.label}>{'Usuário:'}</Text>
        <TextInput
          style={styles.input}
          onChangeText={(texto) => this.setState({ usuario: texto })}
        ></TextInput>
        <Text style={styles.label}>{'Senha:'}</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          onChangeText={(texto) => this.setState({ senha: texto })}
        ></TextInput>
        <Button title="Logar" onPress={() => this.ler()}></Button>
      </View>
    );
  }

  async ler() {
    try {
      let senha = await AsyncStorage.getItem(this.state.usuario);
      if (senha != null) {
        if (senha == this.state.senha) {
          this.props.navigation.navigate('Tela3');
        } else {
          alert('Senha Incorreta!');
        }
      } else {
        alert('Usuário não foi encontrado!');
      }
    } catch (erro) {
      console.log(erro);
    }
  }
}

class Cadastro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
      password: undefined,
    };
  }

  async playSound() {
    const { sound } = await Audio.Sound.createAsync(require('/imgs/som.mp3'));
    this.sound = sound;
    await this.sound.playAsync();
  }

  async gravar() {
    try {
      await AsyncStorage.setItem(this.state.user, this.state.password);
      this.playSound();
      alert('Salvo com sucesso!!!');
    } catch (erro) {
      alert('Erro!');
    }
  }

  componentWillUnmount() {
    if (this.sound) {
      this.sound.unloadAsync();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{'Cadastrar Usuário:'}</Text>
        <TextInput
          style={styles.input}
          onChangeText={(texto) => this.setState({ user: texto })}
        ></TextInput>
        <Text style={styles.label}>{'Cadastrar Senha:'}</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          onChangeText={(texto) => this.setState({ password: texto })}
        ></TextInput>
        <Button title="Cadastrar" onPress={() => this.gravar()} />
      </View>
    );
  }
}

class Nav2 extends React.Component {
  render() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Principal} />
        <Stack.Screen name="Tela3" component={Tela3} />
        <Stack.Screen name="Tela4" component={Tela4} />
        <Stack.Screen name="Tela5" component={Tela5} />
        <Stack.Screen name="Tela6" component={Tela6} />
        <Stack.Screen name="Tela7" component={Tela7} />
        <Stack.Screen name="Tela8" component={Tela8} />
        <Stack.Screen name="RelatorioSalvo" component={RelatorioSalvo} />
      </Stack.Navigator>
    );
  }
}

class Tela3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relatorioA: null,
      relatorioB: null,
      relatorioC: null,
      relatorioD: null,
      relatorioE: null,
      modalVisible: false,
      savedModalVisible: false,
    };
  }

  componentDidMount() {
    this.loadReports();
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.loadReports();
    });
  }

  componentWillUnmount() {
    this.focusListener();
  }

  loadReports = async () => {
    try {
      const relatorioA = await AsyncStorage.getItem('relatorioA');
      const relatorioB = await AsyncStorage.getItem('relatorioB');
      const relatorioC = await AsyncStorage.getItem('relatorioC');
      const relatorioD = await AsyncStorage.getItem('relatorioD');
      const relatorioE = await AsyncStorage.getItem('relatorioE');
      this.setState({
        relatorioA: JSON.parse(relatorioA),
        relatorioB: JSON.parse(relatorioB),
        relatorioC: JSON.parse(relatorioC),
        relatorioD: JSON.parse(relatorioD),
        relatorioE: JSON.parse(relatorioE),
      });
    } catch (error) {
      alert('Erro ao carregar os relatórios!');
    }
  };

  renderReportButton(title, reportData) {
    return (
      <TouchableOpacity
        style={[styles.button, this.state[title] && styles.buttonActive]}
        onPress={() => {
          this.setState({ [title]: !this.state[title] });
          this.props.navigation.navigate('RelatorioSalvo', {
            title,
            reportData,
          });
        }}
      >
        <Text>{`Ver ${title}`}</Text>
      </TouchableOpacity>
    );
  }

  deleteReport = async (reportKey) => {
    try {
      await AsyncStorage.removeItem(reportKey);
      this.loadReports();
      alert('Relatório deletado com sucesso!');
    } catch (error) {
      alert('Erro ao deletar o relatório!');
    }
  };

  renderSavedReportButton(title, reportData, reportKey) {
    return (
      <View style={styles.savedReportContainer} key={reportKey}>
        <TouchableOpacity
          style={[styles.button, this.state[reportKey] && styles.buttonActive]}
          onPress={() => {
            this.setState({ [reportKey]: !this.state[reportKey] });
            this.props.navigation.navigate('RelatorioSalvo', {
              title,
              reportData,
            });
          }}
        >
          <Text>{`Ver ${title}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.deleteReport(reportKey)}
        >
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      </View>
    );
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  toggleSavedModal = () => {
    this.setState({ savedModalVisible: !this.state.savedModalVisible });
  };

  render() {
    return (
      <ImageBackground
        source={require('/imgs/reee.png')}
        style={styles.background}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.overlay}>
          <Text style={styles.headerText}>{'Relatórios Disponíveis'}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={this.toggleModal}>
              <Text>Ver Relatórios</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={this.toggleSavedModal}
            >
              <Text>Ver Relatórios Salvos</Text>
            </TouchableOpacity>
          </View>
          <Modal
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={this.toggleModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Selecione um Relatório</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Tela4');
                  }}
                >
                  <Text>Relatório A</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Tela5');
                  }}
                >
                  <Text>Relatório B</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Tela6');
                  }}
                >
                  <Text>Relatório C</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Tela7');
                  }}
                >
                  <Text>Relatório D</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Tela8');
                  }}
                >
                  <Text>Relatório E</Text>
                </TouchableOpacity>
                <Button title="Fechar" onPress={this.toggleModal} />
              </View>
            </View>
          </Modal>
          <Modal
            transparent={true}
            visible={this.state.savedModalVisible}
            onRequestClose={this.toggleSavedModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Relatórios Salvos</Text>
                {this.renderSavedReportButton(
                  'Relatório A',
                  this.state.relatorioA,
                  'relatorioA'
                )}
                {this.renderSavedReportButton(
                  'Relatório B',
                  this.state.relatorioB,
                  'relatorioB'
                )}
                {this.renderSavedReportButton(
                  'Relatório C',
                  this.state.relatorioC,
                  'relatorioC'
                )}
                {this.renderSavedReportButton(
                  'Relatório D',
                  this.state.relatorioD,
                  'relatorioD'
                )}
                {this.renderSavedReportButton(
                  'Relatório E',
                  this.state.relatorioE,
                  'relatorioE'
                )}
                <Button title="Fechar" onPress={this.toggleSavedModal} />
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>
    );
  }
}

class Tela4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check1: false,
      check2: false,
      check3: false,
    };
  }

  saveReport = async () => {
    const reportData = {
      check1: this.state.check1,
      check2: this.state.check2,
      check3: this.state.check3,
    };

    try {
      await AsyncStorage.setItem('relatorioA', JSON.stringify(reportData));
      this.props.navigation.navigate('Tela3');
      alert('Relatório salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar o relatório!');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório A" />
          <Card.Content>
            <CheckBox
              title="Coerência no trabalho"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Bom relacionamento com os colegas"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Colaboração com o grupo"
              checked={this.state.check3}
              onPress={() => this.setState({ check3: !this.state.check3 })}
            />
          </Card.Content>
          <Card.Actions>
            <Button title="Salvar Relatório" onPress={this.saveReport} />
          </Card.Actions>
        </Card>
      </View>
    );
  }
}

class Tela5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check1: false,
      check2: false,
      check3: false,
    };
  }

  saveReport = async () => {
    const reportData = {
      check1: this.state.check1,
      check2: this.state.check2,
      check3: this.state.check3,
    };

    try {
      await AsyncStorage.setItem('relatorioB', JSON.stringify(reportData));
      this.props.navigation.navigate('Tela3');
      alert('Relatório salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar o relatório!');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório B" />
          <Card.Content>
            <CheckBox
              title="Sabe expressar opiniões"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Coerência no trabalho"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Projetos com ética"
              checked={this.state.check3}
              onPress={() => this.setState({ check3: !this.state.check3 })}
            />
          </Card.Content>
          <Card.Actions>
            <Button title="Salvar Relatório" onPress={this.saveReport} />
          </Card.Actions>
        </Card>
      </View>
    );
  }
}

class Tela6 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check1: false,
      check2: false,
      check3: false,
    };
  }

  saveReport = async () => {
    const reportData = {
      check1: this.state.check1,
      check2: this.state.check2,
      check3: this.state.check3,
    };

    try {
      await AsyncStorage.setItem('relatorioC', JSON.stringify(reportData));
      this.props.navigation.navigate('Tela3');
      alert('Relatório salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar o relatório!');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório C" />
          <Card.Content>
            <CheckBox
              title="Faz manutenção corretamente"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Não força o equipamento"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Boa utilização do maquinário"
              checked={this.state.check3}
              onPress={() => this.setState({ check3: !this.state.check3 })}
            />
          </Card.Content>
          <Card.Actions>
            <Button title="Salvar Relatório" onPress={this.saveReport} />
          </Card.Actions>
        </Card>
      </View>
    );
  }
}

class Tela7 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check1: false,
      check2: false,
      check3: false,
    };
  }

  saveReport = async () => {
    const reportData = {
      check1: this.state.check1,
      check2: this.state.check2,
      check3: this.state.check3,
    };

    try {
      await AsyncStorage.setItem('relatorioD', JSON.stringify(reportData));
      this.props.navigation.navigate('Tela3');
      alert('Relatório salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar o relatório!');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório D" />
          <Card.Content>
            <CheckBox
              title="Trajado corretamente de acordo com o exigido"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Utilizando Traje de segurança"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Utizando Equipamento de segurança"
              checked={this.state.check3}
              onPress={() => this.setState({ check3: !this.state.check3 })}
            />
          </Card.Content>
          <Card.Actions>
            <Button title="Salvar Relatório" onPress={this.saveReport} />
          </Card.Actions>
        </Card>
      </View>
    );
  }
}

class Tela8 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      check1: false,
      check2: false,
      check3: false,
    };
  }

  saveReport = async () => {
    const reportData = {
      check1: this.state.check1,
      check2: this.state.check2,
      check3: this.state.check3,
    };

    try {
      await AsyncStorage.setItem('relatorioE', JSON.stringify(reportData));
      this.props.navigation.navigate('Tela3');
      alert('Relatório salvo com sucesso!');
    } catch (error) {
      alert('Erro ao salvar o relatório!');
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório E" />
          <Card.Content>
            <CheckBox
              title="Agiu Éticamente"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Exerceu os direitos humanos"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Forneceu todas as informaçõe para seus superiores"
              checked={this.state.check3}
              onPress={() => this.setState({ check3: !this.state.check3 })}
            />
          </Card.Content>
          <Card.Actions>
            <Button title="Salvar Relatório" onPress={this.saveReport} />
          </Card.Actions>
        </Card>
      </View>
    );
  }
}

class RelatorioSalvo extends React.Component {
  render() {
    const { route } = this.props;
    const { title, reportData } = route.params;

    const checkboxTitles = {
      'Relatório A': ['Coerência no trabalho', 'Bom relacionamento com os colegas', 'Colaboração com o grupo'],
      'Relatório B': ['Sabe expressar opiniões', 'Coerência no trabalho', 'Projetos com ética'],
      'Relatório C': ['Faz manutenção corretamente', 'Não força o equipamento', 'Boa utilização do maquinário'],
      'Relatório D': ['Trajado corretamente de acordo com o exigido', 'Utilizando Traje de segurança', 'Utizando Equipamento de segurança'],
      'Relatório E': ['Agiu Éticamente', 'Exerceu os direitos humanos', 'Forneceu todas as informaçõe para seus superiores']
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        {reportData ? (
          <View>
            <CheckBox title={checkboxTitles[title][0]} checked={reportData.check1} disabled />
            <CheckBox title={checkboxTitles[title][1]} checked={reportData.check2} disabled />
            <CheckBox title={checkboxTitles[title][2]} checked={reportData.check3} disabled />
          </View>
        ) : (
          <Text>Nenhum dado salvo para este relatório.</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Optional overlay for readability
  },
  image: {
    width: 100, // Ajuste a largura e altura conforme necessário
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: {
    marginVertical: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: '#0000FF',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  savedReportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  handleLogin = () => {
    this.setState({ loggedIn: true });
  };

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          {!this.state.loggedIn ? (
            <>
              <Tab.Screen
                name="Login"
                component={Nav2}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="home-account"
                      color={color}
                      size={size}
                    />
                  ),
                  headerShown: false,
                }}
                initialParams={{ onLogin: this.handleLogin }}
              />
              <Tab.Screen
                name="Criar Usuário"
                component={Cadastro}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="account-details"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
            </>
          ) : (
            <>
              <Tab.Screen
                name="Meus Relatórios"
                component={Tela3}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="file-document"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
              <Tab.Screen
                name="Perfil"
                component={Cadastro}
                options={{
                  tabBarIcon: ({ color, size }) => (
                    <MaterialCommunityIcons
                      name="account"
                      color={color}
                      size={size}
                    />
                  ),
                }}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

export default App;
