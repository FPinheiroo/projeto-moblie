import React, { useState } from 'react';
import { TextInput, Text, TouchableOpacity, View, Button, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card } from 'react-native-paper';
import { CheckBox } from 'react-native-elements';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

class Principal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      usuario: undefined,
      senha: undefined
    }
  }

  render() {
    return (
      <View>
        <Text>{"Usuário:"}</Text>
        <TextInput onChangeText={(texto) => this.setState({ usuario: texto })}></TextInput>
        <Text>{"Senha:"}</Text>
        <TextInput secureTextEntry onChangeText={(texto) => this.setState({ senha: texto })}></TextInput>
        <Button title="Logar" onPress={() => this.ler()}></Button>
      </View>
    )
  }

  async ler() {
    try {
      let senha = await AsyncStorage.getItem(this.state.usuario);
      if (senha != null) {
        if (senha == this.state.senha) {
          this.props.navigation.navigate('Tela3')
        } else {
          alert("Senha Incorreta!");
        }
      } else {
        alert("Usuário não foi encontrado!");
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
    }
  }

  async gravar() {
    try {
      await AsyncStorage.setItem(this.state.user, this.state.password);
      alert("Salvo com sucesso!!!")
    } catch (erro) {
      alert("Erro!")
    }
  }

  render() {
    return (
      <View>
        <Text>{"Cadastrar Usuário:"}</Text>
        <TextInput onChangeText={(texto) => this.setState({ user: texto })}></TextInput>
        <Text>{"Cadastrar Senha:"}</Text>
        <TextInput secureTextEntry onChangeText={(texto) => this.setState({ password: texto })}></TextInput>
        <Button title="Cadastrar" onPress={() => this.gravar()} />
      </View>
    )
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
      alert("Erro ao carregar os relatórios!");
    }
  }

  renderReportButton(title, reportData) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => this.props.navigation.navigate('RelatorioSalvo', { title, reportData })}>
        <Text>{`Ver ${title}`}</Text>
      </TouchableOpacity>
    );
  }

  deleteReport = async (reportKey) => {
    try {
      await AsyncStorage.removeItem(reportKey);
      this.loadReports();
      alert("Relatório deletado com sucesso!");
    } catch (error) {
      alert("Erro ao deletar o relatório!");
    }
  }

  renderSavedReportButton(title, reportData, reportKey) {
    return (
      <View style={styles.savedReportContainer} key={reportKey}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('RelatorioSalvo', { title, reportData })}>
          <Text>{`Ver ${title}`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => this.deleteReport(reportKey)}>
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
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <Text>{"Relatórios Disponíveis"}</Text>
        <TouchableOpacity style={styles.button} onPress={this.toggleModal}>
          <Text>Ver Relatórios</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.toggleModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Selecione um Relatório</Text>
              <TouchableOpacity style={styles.button} onPress={() => {
                this.toggleModal();
                this.props.navigation.navigate('Tela4');
              }}>
                <Text>Relatório A</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                this.toggleModal();
                this.props.navigation.navigate('Tela5');
              }}>
                <Text>Relatório B</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                this.toggleModal();
                this.props.navigation.navigate('Tela6');
              }}>
                <Text>Relatório C</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                this.toggleModal();
                this.props.navigation.navigate('Tela7');
              }}>
                <Text>Relatório D</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => {
                this.toggleModal();
                this.props.navigation.navigate('Tela8');
              }}>
                <Text>Relatório E</Text>
              </TouchableOpacity>
              <Button title="Fechar" onPress={this.toggleModal} />
            </View>
          </View>
        </Modal>
        <TouchableOpacity style={styles.button} onPress={this.toggleSavedModal}>
          <Text>Ver Relatórios Salvos</Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={this.state.savedModalVisible}
          onRequestClose={this.toggleSavedModal}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Relatórios Salvos</Text>
              {this.renderSavedReportButton("Relatório A", this.state.relatorioA, 'relatorioA')}
              {this.renderSavedReportButton("Relatório B", this.state.relatorioB, 'relatorioB')}
              {this.renderSavedReportButton("Relatório C", this.state.relatorioC, 'relatorioC')}
              {this.renderSavedReportButton("Relatório D", this.state.relatorioD, 'relatorioD')}
              {this.renderSavedReportButton("Relatório E", this.state.relatorioE, 'relatorioE')}
              <Button title="Fechar" onPress={this.toggleSavedModal} />
            </View>
          </View>
        </Modal>
      </ScrollView>
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
      alert("Relatório salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar o relatório!");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório A" />
          <Card.Content>
            <CheckBox
              title="Opção 1"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Opção 2"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Opção 3"
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
      alert("Relatório salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar o relatório!");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório B" />
          <Card.Content>
            <CheckBox
              title="Opção 1"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Opção 2"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Opção 3"
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
      alert("Relatório salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar o relatório!");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório C" />
          <Card.Content>
            <CheckBox
              title="Opção 1"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Opção 2"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Opção 3"
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
      alert("Relatório salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar o relatório!");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório D" />
          <Card.Content>
            <CheckBox
              title="Opção 1"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Opção 2"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Opção 3"
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
      alert("Relatório salvo com sucesso!");
    } catch (error) {
      alert("Erro ao salvar o relatório!");
    }
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Card>
          <Card.Title title="Relatório E" />
          <Card.Content>
            <CheckBox
              title="Opção 1"
              checked={this.state.check1}
              onPress={() => this.setState({ check1: !this.state.check1 })}
            />
            <CheckBox
              title="Opção 2"
              checked={this.state.check2}
              onPress={() => this.setState({ check2: !this.state.check2 })}
            />
            <CheckBox
              title="Opção 3"
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

    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
        {reportData ? (
          <View>
            <CheckBox
              title="Opção 1"
              checked={reportData.check1}
              disabled
            />
            <CheckBox
              title="Opção 2"
              checked={reportData.check2}
              disabled
            />
            <CheckBox
              title="Opção 3"
              checked={reportData.check3}
              disabled
            />
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
    paddingHorizontal: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    marginBottom: 10,
    padding: 10,
    borderColor: '#000000',
  },
  countContainer: {
    alignItems: 'center',
    padding: 10,
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
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator>
          {!this.state.loggedIn ? (
            <>
              <Tab.Screen name="Login" component={Nav2}
                options={{
                  tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home-account" color={color} size={size} />)
                  , headerShown: false
                }}
                initialParams={{ onLogin: this.handleLogin }}
              />
              <Tab.Screen name="Criar Usuário" component={Cadastro}
                options={{
                  tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account-details" color={color} size={size} />)
                }}
              />
            </>
          ) : (
            <>
              <Tab.Screen name="Meus Relatórios" component={Tela3}
                options={{
                  tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="file-document" color={color} size={size} />)
                }}
              />
              <Tab.Screen name="Perfil" component={Cadastro}
                options={{
                  tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="account" color={color} size={size} />)
                }}
              />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    )
  }
}

export default App;
