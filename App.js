import * as React from 'react';
import { TextInput, Text, TouchableOpacity, View, Button, StyleSheet } from 'react-native';
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
        <TextInput onChangeText={(texto) => this.setState({ senha: texto })}></TextInput>
        <Button title="Logar" onPress={() => this.ler()}></Button>
      </View>
    )
  }

  async ler() {
    try {
      let senha = await AsyncStorage.getItem(this.state.usuario);
      if (senha != null) {
        if (senha == this.state.senha) {
          //alert("Logado!!!");
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
        <TextInput onChangeText={(texto) => this.setState({ password: texto })}></TextInput>
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
      </Stack.Navigator>
    );
  }
}

class Tela3 extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>{"Relatórios Disponiveis"}</Text>
        <TouchableOpacity style={styles.button} onPress={() =>
          this.props.navigation.navigate('Tela4')}>
          <Text>Relatorio A</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>
          this.props.navigation.navigate('Tela5')}>
          <Text>Relatorio B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>
          this.props.navigation.navigate('Tela6')}>
          <Text>Relatorio C</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>
          this.props.navigation.navigate('Tela7')}>
          <Text>Relatorio D</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() =>
          this.props.navigation.navigate('Tela8')}>
          <Text>Relatorio E</Text>
        </TouchableOpacity>
      </View>
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
        </Card>
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
  }
})

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