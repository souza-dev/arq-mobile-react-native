import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface IProps {
  nome: string;
  endereco: string;
  telefone: string;
  cidade: string;
  banco: string;
}

export function Cards({ nome, endereco, telefone, cidade, banco }: IProps) {
  return (
    <View style={styles.container}>
      <Text>{`${nome}`}</Text>
      <Text>{`Telefone: ${telefone}`}</Text>
      <Text>{`Endereço: ${endereco}`}</Text>
      <Text>{`Cidade: ${cidade}`}</Text>
      <Text>{`Banco: ${banco}`}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    margin: 10,
    borderRadius: 10,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  campo: {},
  dado: {},
});
