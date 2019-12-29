class Tarefa {
    constructor(numTarefa, tipoAlteracao) {
        this.numTarefa = numTarefa,
        this.tipoAlteracao = tipoAlteracao,
        this.numeroAlteracao = 1
    }

    isTipoAlteracaoModificacao() { return this.tipoAlteracao === 'M' }
    isTipoAlteracaoDelecao() { return this.tipoAlteracao === 'D' }
    isTipoAlteracaoRenomear() { return this.tipoAlteracao === 'R' }
}

module.exports = Tarefa