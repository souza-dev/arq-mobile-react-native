import React, { useCallback, useState } from "react";
import { View, FlatList, TouchableOpacity } from "react-native";
import Card, { CadastroProps } from "../../components/Card/Card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SearchIcon, Input } from "native-base";

import { styles } from "./styles";

interface Props {
  navigation: any;
}

export default function Contas({ navigation }: Props) {
  const [data, setData] = useState<CadastroProps[]>([]);
  const [search, setSearch] = useState("");

  function handleEdit(id: any) {
    navigation.navigate("Cadastro", { id: id });
  }

  useFocusEffect(
    useCallback(() => {
      handleFectchData();
    }, [])
  );

  async function handleFectchData() {
    try {
      const jsonValue = await AsyncStorage.getItem("@fromHook:cadastro");
      const data = jsonValue ? JSON.parse(jsonValue) : [];
      setData(data);
      return jsonValue;
    } catch (e: any) {
      console.log(e);
    }
  }

  const dadosFiltrados = data.filter(
    (item: CadastroProps) =>
      item?.primeiroNome.toLowerCase().includes(search.toLowerCase()) ||
      item?.segundoNome.toLowerCase().includes(search.toLowerCase()) ||
      item?.email.toLowerCase().includes(search.toLowerCase()) ||
      item?.rua.toLowerCase().includes(search.toLowerCase()) ||
      item?.bairro.toLowerCase().includes(search.toLowerCase()) ||
      item?.cidade.toLowerCase().includes(search.toLowerCase()) ||
      item?.uf.toLowerCase().includes(search.toLowerCase()) ||
      item?.banco.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: CadastroProps }) => {
    return <Card data={item} onPress={() => handleEdit(item.id)} />;
  };

  return (
    <View style={styles.container}>
      <Input
        value={search}
        size="xl"
        placeholder="Busca"
        onChangeText={setSearch}
        InputRightElement={
          <TouchableOpacity style={{ marginEnd: 10 }}>
            <SearchIcon size="5" my={2} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={dadosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}
