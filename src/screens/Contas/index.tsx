import React from "react";

import { View, Text, ScrollView } from "react-native";
import { NativeBaseProvider, Box } from "native-base";
import { Cards } from "../../components/Cards";

export default function Contas() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <Cards
          nome={"Thiago"}
          telefone="35 3623-7157"
          endereco="Rua Justina"
          cidade="Poços de Caldas"
          banco="Inter"
        />
        <Cards
          nome={"Thiago"}
          telefone="35 3623-7157"
          endereco="Rua Justina"
          cidade="Poços de Caldas"
          banco="Inter"
        />
        <Cards
          nome={"Thiago"}
          telefone="35 3623-7157"
          endereco="Rua Justina"
          cidade="Poços de Caldas"
          banco="Inter"
        />
        <Cards
          nome={"Thiago"}
          telefone="35 3623-7157"
          endereco="Rua Justina"
          cidade="Poços de Caldas"
          banco="Inter"
        />
        <Cards
          nome={"Thiago"}
          telefone="35 3623-7157"
          endereco="Rua Justina"
          cidade="Poços de Caldas"
          banco="Inter"
        />
        <Cards
          nome={"Thiago"}
          telefone="35 3623-7157"
          endereco="Rua Justina"
          cidade="Poços de Caldas"
          banco="Inter"
        />
      </ScrollView>
    </View>
  );
}
