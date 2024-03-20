import React, { useState } from "react";

import { TouchableOpacity, ScrollView, Text } from "react-native";
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

import CepModel from "../../models/Cep";
import fetchCep from "../../controllers/CepController";
import { Input } from "../../components/Input";
import fetchBanco from "../../controllers/BancoContoller";
import BancoModel from "../../models/Banco";

interface FormDataProps {
  id: any;
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

export default function Cadastro() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [valueRadio, setValueRadio] = React.useState("one");
  const [bancos, setBancos] = React.useState<BancoModel[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<FormDataProps>({
    resolver: yupResolver(schemaRegister) as any,
  });

  const onSubmit = (data: any) => console.log(data);

  const handleCepSearch = async () => {
    try {
      const result = await fetchCep(getValues("cep"));
      if (result) {
        setValue("rua", result?.logradouro);
        setValue("bairro", result?.bairro);
        setValue("cidade", result?.localidade);
        setValue("uf", result?.uf);
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

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
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
              User este banco
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
              size="xl"
              placeholder="Cep"
              onBlur={onBlur}
              onChangeText={onChange}
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

        <HStack space={3} my={3}>
          <Button
            style={{ flex: 1 }}
            colorScheme="secondary"
            onPress={handleSubmit(onSubmit)}
          >
            Salvar
          </Button>
          <Button style={{ flex: 1 }}>Cancelar</Button>
        </HStack>
      </Stack>
    </ScrollView>
  );
}
