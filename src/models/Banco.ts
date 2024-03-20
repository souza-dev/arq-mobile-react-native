export default class BancoModel {
    ispb: string;
    nome: string;
    codigo: string;
    nomeCompleto: string;
 
    constructor(ispb: string,
    nome: string,
    codigo: string,
    nomeCompleto: string) {
        this.ispb = ispb;
        this.nome = nome;
        this.codigo = codigo;
        this.nomeCompleto = nomeCompleto;
    }

}