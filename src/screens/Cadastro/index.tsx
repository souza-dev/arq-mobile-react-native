import React, { useState, useEffect } from "react";

import {
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import {
  Stack,
  Button,
  HStack,
  SearchIcon,
  Heading,
  Center,
  Icon,
  Modal,
  Box,
  Radio,
} from "native-base";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import uuid from "react-native-uuid";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-tiny-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { RootTabParamList } from "../../router";
import BancoModel from "../../models/Banco";
import fetchBanco from "../../controllers/BancoContoller";
import fetchCep from "../../controllers/CepController";
import { Input } from "../../components/Input";
import { ExcluirItemDialog } from "../../components/Dialog";
import { styles } from "./styles";

interface FormDataProps {
  id: string;
  primeiroNome: string;
  segundoNome: string;
  email: string;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  banco: string;
}

const schemaRegister = yup.object({
  primeiroNome: yup
    .string()
    .required("O primeiro nome é obrigatório")
    .min(3, "Informe no minimo 3 digitos"),
  segundoNome: yup
    .string()
    .required("O segundo nome é obrigatório")
    .min(3, "Informe no minimo 3 digitos"),
  email: yup
    .string()
    .required("Email é obrigatório")
    .email("E-mail informado não é valido"),
  cep: yup
    .string()
    .required("O CEP é obrigatório")
    .min(8, "Informe no minimo 8 digitos"),
  rua: yup
    .string()
    .required("O nome da rua é obrigatório")
    .min(3, "Informe no minimo 3 digitos"),
  numero: yup.string().required("Adicione o número da residência"),
  bairro: yup.string().required("Adicione o bairro"),
  cidade: yup
    .string()
    .required("Adicione a cidade")
    .min(3, "Informe no minimo 3 digitos"),
  uf: yup
    .string()
    .required("Adicione o UF")
    .min(2, "O codigo UF precisa ter dois caracteres"),
  banco: yup
    .string()
    .required("O banco é obrigatório")
    .min(3, "Informe no minimo 3 digitos"),
});
type CadastroRouterProp = BottomTabScreenProps<RootTabParamList, "Cadastro">;

export default function Cadastro({ route, navigation }: CadastroRouterProp) {
  const isEditing = !!route?.params?.id;

  const [loading, setLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searcherID, setSearcherID] = useState(false);

  const [modalVisible, setModalVisible] = React.useState(false); //Modal de escolha dos bancos.
  const [valueRadio, setValueRadio] = React.useState("one"); //value do Radio button na escolha do banco.
  const [bancos, setBancos] = React.useState<BancoModel[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<FormDataProps>({
    resolver: yupResolver(schemaRegister) as any,
  });

  useEffect(() => {
    if (isEditing) {
      handlerSearcher(route.params.id);
      setSearcherID(true);
    } else {
      setSearcherID(false);
      reset();
      setLoading(false);
    }
    return () => setLoading(true);
  }, [route, isEditing]);

  useEffect(() => {
    if (route?.params?.id) {
      handlerSearcher(route?.params?.id);
    } else {
      reset();
      setLoading(false);
    }
    return () => setLoading(true);
  }, [route]);

  const handleCepSearch = async () => {
    try {
      const result = await fetchCep(getValues("cep"));
      if (result) {
        setValue("rua", result?.logradouro);
        setValue("bairro", result?.bairro);
        setValue("cidade", result?.localidade);
        setValue("uf", result?.uf);
      } else {
        alert("CEP não encontrado");
      }
    } catch (e: any) {
      console.error("Error fetching data:", e);
    }
  };

  const handleBancoSearch = async () => {
    try {
      const result = await fetchBanco(getValues("banco"));
      if (result && result.length !== 0) {
        setBancos(result);
        setModalVisible(true);
      } else {
        alert("Não foi encontrados bancos com esse nome");
      }
    } catch (e: any) {
      console.error("Error fetching data:", e);
    }
  };

  async function handlerSearcher(id: string) {
    try {
      setLoading(true);
      const responseData = await AsyncStorage.getItem("@fromHook:cadastro");
      const dbData: FormDataProps[] = responseData
        ? JSON.parse(responseData)
        : [];

      const itemEncontrado = dbData?.find((item) => item.id === id);

      if (itemEncontrado) {
        Object.keys(itemEncontrado).forEach((key) =>
          setValue(
            key as keyof FormDataProps,
            itemEncontrado?.[key as keyof FormDataProps] as string
          )
        );
        setSearcherID(true);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  async function handleDelete(data: FormDataProps) {
    try {
      setLoading(true);
      const responseData = await AsyncStorage.getItem("@fromHook:cadastro");
      const dbData: FormDataProps[] = responseData
        ? JSON.parse(responseData)
        : [];

      const indexToRemove = dbData.findIndex((item) => item.id === data.id);

      if (indexToRemove !== -1) {
        dbData.splice(indexToRemove, 1);
        await AsyncStorage.setItem(
          "@fromHook:cadastro",
          JSON.stringify(dbData)
        );
        Toast.showSuccess("Registro excluido com sucesso");
        setShowDeleteDialog(false);
        setSearcherID(false);
        reset();
        navigation.navigate("Contas");
      } else {
        Toast.show("Registro não localizado!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handlerAlterRegister(data: FormDataProps) {
    try {
      setLoading(true);
      const responseData = await AsyncStorage.getItem("@fromHook:cadastro");
      const dbData: FormDataProps[] = responseData
        ? JSON.parse(responseData)
        : [];

      const indexToRemove = dbData.findIndex((item) => item.id === data.id);

      if (indexToRemove !== -1) {
        dbData.splice(indexToRemove, 1);
        const previewData = [...dbData, data];
        await AsyncStorage.setItem(
          "@fromHook:cadastro",
          JSON.stringify(previewData)
        );
        Toast.showSuccess("Cadastro alterado com sucesso");
        setLoading(false);
        setSearcherID(false);
        reset();

        navigation.navigate("Contas");
      } else {
        Toast.show("Registro não localizado!");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  async function handlerRegister(data: FormDataProps) {
    data.id = uuid.v4().toString();
    try {
      const responseData = await AsyncStorage.getItem("@fromHook:cadastro");
      const dbData = responseData ? JSON.parse(responseData) : [];
      const previewData = [...dbData, data];

      await AsyncStorage.setItem(
        "@fromHook:cadastro",
        JSON.stringify(previewData)
      );
      Toast.showSuccess("Cadastro realizado com sucesso");
      reset();
      navigation.navigate("Contas");
    } catch (err) {
      console.log(err);
    }
  }

  const handleCepChange = (inputText: string) => {
    const numericValue = inputText.replace(/\D/g, "");
    let formattedCep = numericValue.slice(0, 8);
    if (formattedCep.length > 5) {
      formattedCep = formattedCep.replace(/(\d{5})(\d)/, "$1-$2");
    }
    return formattedCep;
  };

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        avoidKeyboard
        justifyContent="center"
        bottom="4"
        size="lg"
      >
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Selecione o Banco</Modal.Header>
          <Modal.Body size={200} width={"100%"}>
            <Box>
              <ScrollView>
                <Radio.Group
                  name="myRadioGroup"
                  accessibilityLabel="Selecione o banco"
                  value={valueRadio}
                  onChange={(nextValue) => {
                    setValueRadio(nextValue);
                  }}
                >
                  {bancos.map((item: BancoModel) => (
                    <Radio value={item.nomeCompleto} my={1}>
                      <Text>{item.nomeCompleto}</Text>
                    </Radio>
                  ))}
                </Radio.Group>
              </ScrollView>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button
              flex="1"
              onPress={() => {
                setModalVisible(false);
                setValue("banco", valueRadio);
              }}
            >
              Use este banco
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Center>
        <Heading my={5}>Cadastro de Usuários</Heading>
      </Center>
      <Stack
        space={3}
        w="100%"
        mx="auto"
        p={"4"}
        bg={"white"}
        flex={1}
        justifyContent={"flex-end"}
      >
        <Controller
          control={control}
          name="primeiroNome"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              placeholder="Primeiro Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.primeiroNome?.message}
              InputLeftElement={
                <Icon as={MaterialCommunityIcons} name="account" mx={2} />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="segundoNome"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              placeholder="Segundo Nome"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.segundoNome?.message}
              InputLeftElement={
                <Icon as={MaterialCommunityIcons} name="account-tie" mx={2} />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
              InputLeftElement={
                <Icon as={MaterialCommunityIcons} name="email" mx={2} />
              }
            />
          )}
        />

        <Controller
          control={control}
          name="cep"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              keyboardType="numeric"
              size="xl"
              placeholder="Cep"
              onBlur={onBlur}
              onChangeText={(text) => onChange(handleCepChange(text))}
              value={value}
              errorMessage={errors.cep?.message}
              InputLeftElement={<Icon as={MaterialIcons} name="map" mx={2} />}
              InputRightElement={
                <TouchableOpacity
                  onPress={handleCepSearch}
                  style={{ marginEnd: 10 }}
                >
                  <SearchIcon size="5" my={2} />
                </TouchableOpacity>
              }
            />
          )}
        />

        <Controller
          control={control}
          name="rua"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              placeholder="Rua"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.rua?.message}
              InputLeftElement={
                <Icon
                  as={MaterialCommunityIcons}
                  name="home-map-marker"
                  mx={2}
                />
              }
            />
          )}
        />
        <Controller
          control={control}
          name="numero"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              placeholder="Numero"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.numero?.message}
              InputLeftElement={
                <Icon as={MaterialCommunityIcons} name="map-marker" mx={2} />
              }
            />
          )}
        />
        <Controller
          control={control}
          name="bairro"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              placeholder="Bairro"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.bairro?.message}
              InputLeftElement={
                <Icon as={MaterialCommunityIcons} name="map-legend" mx={2} />
              }
            />
          )}
        />

        <HStack space={3}>
          <Controller
            control={control}
            name="cidade"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="xl"
                placeholder="Cidade"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
                InputLeftElement={
                  <Icon as={MaterialCommunityIcons} name="home-city" mx={2} />
                }
              />
            )}
          />
          <Controller
            control={control}
            name="uf"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                size="xl"
                placeholder="UF"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.uf?.message}
              />
            )}
          />
        </HStack>

        <Controller
          control={control}
          name="banco"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="xl"
              placeholder="Banco"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.banco?.message}
              InputLeftElement={
                <Icon as={MaterialCommunityIcons} name="bank-outline" mx={2} />
              }
              InputRightElement={
                <TouchableOpacity
                  onPress={handleBancoSearch}
                  style={{ marginEnd: 10 }}
                >
                  <SearchIcon size="5" my={2} />
                </TouchableOpacity>
              }
            />
          )}
        />
        {searcherID ? (
          <HStack space={3} my={3}>
            <Button
              style={{ flex: 1 }}
              colorScheme="secondary"
              onPress={handleSubmit(handlerAlterRegister)}
            >
              Alterar
            </Button>
            <Button
              style={{ flex: 1 }}
              onPress={() => setShowDeleteDialog(true)}
            >
              Excluir
            </Button>
          </HStack>
        ) : (
          <HStack space={3} my={3}>
            <Button
              style={{ flex: 1 }}
              colorScheme="secondary"
              onPress={handleSubmit(handlerRegister)}
            >
              Salvar
            </Button>
            <Button
              style={{ flex: 1 }}
              onPress={() => {
                setSearcherID(false);
                reset();
              }}
            >
              Cancelar
            </Button>
          </HStack>
        )}
        <Modal
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        >
          <ExcluirItemDialog
            isVisible={showDeleteDialog}
            onCancel={() => setShowDeleteDialog(false)}
            onConfirm={handleSubmit(handleDelete)}
          />
        </Modal>
      </Stack>
    </KeyboardAwareScrollView>
  );
}
