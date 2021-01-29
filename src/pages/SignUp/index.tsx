import React, {useCallback, useRef} from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import {useNavigation} from '@react-navigation/native';
import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import {Container, Title, BackToSigInText, BackToSigIn} from './styles';
import api from '../../services/api';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}
const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório.'),
          email: Yup.string()
            .required('E-mail obrigatório.')
            .email('Digite um email válido.'),
          password: Yup.string().min(6, 'Mínimo de 06 letras.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Você já pode fazer login na aplicação.',
        );
        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
        }
        Alert.alert(
          'Erro no cadastro.',
          'Ocorreu um erro ao cadastrar, confira os seus dados.',
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flex: 1}}>
          <Container>
            <Image source={logoImg} />
            <View>
              <Title>Crie a sua conta </Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize="words"
                autoCorrect={false}
                name="name"
                icon="user"
                placeholder="Nome"
              />
              <Input
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
              />
              <Input
                secureTextEntry
                name="password"
                icon="lock"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>
            <Button
              onPress={() => {
                formRef.current?.submitForm();
              }}>
              Cadastrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSigIn
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="arrow-left" size={20} color="#fff" />
        <BackToSigInText>Voltar para o login</BackToSigInText>
      </BackToSigIn>
    </>
  );
};

export default SignUp;