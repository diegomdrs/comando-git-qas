const util = require('util');
const exec = util.promisify(require('child_process').exec);
const args = process.argv.slice(2)

// ex. Linux:   node gerador-artefato-multi.js --projeto=/kdi/git/apc-api,/kdi/git/apc-estatico --autor=c1282036 --task=900089
// ex. Windows: TODO

init()

function init() {

  let params = obterParametros();

  if (params.projeto && params.autor && params.task) {

    params.task.forEach(function (task) {

      console.log('\nTarefa nº ' + task + '\n')

      params.projeto.forEach(function (projeto) {

        executarComandoGitLog(projeto, params.autor, task).then(function (saidaComando) {
  
          let lista = obterLista(saidaComando.stdout, task, projeto);
  
          if (lista && lista.length > 0) {
  
            lista = removerDeletados(lista);
            lista.sort(ordenarLista)
  
            imprimirLista(lista)
          }
        }).catch(function (error) {
  
          console.log(error.cmd)
          console.log(error.stderr)
        })
      });
    })
  }
}

function removerDeletados(listaArtefato) {

  return listaArtefato.filter(function (artefatoFilter) {

    let possuiArtefatoCorrespondenteDeletado = listaArtefato.some(function (artefatoSome) {
      return (artefatoFilter.artefato === artefatoSome.artefato) && artefatoSome.tipoAlteracao === 'D'
    })

    return artefatoFilter.tipoAlteracao !== 'D' && !possuiArtefatoCorrespondenteDeletado
  })
}

function ordenarLista(artefatoA, artefatoB) {
  return artefatoA.artefato > artefatoB.artefato
}

function imprimirLista(lista) {

  lista.forEach(function (item) {

    console.log(item.tipoAlteracao + '\t' + 
      item.numeroAlteracao + '\t' + 
        item.artefato);
  });
}

async function executarComandoGitLog(projeto, autor, task) {

  let comando = 'git -C ' + projeto + ' log --no-merges --author=' + autor +
    ' --all --name-status --grep=' + task;

  console.log(comando + '\n')

  return await exec(comando);
}

function obterLista(saidaComando, task, projeto) {

  let listaArtefatosSaidaComando = saidaComando.match(/^((M|D|A){1}|R.*)\s.*$/gm)
  let listaSaida = []

  if (listaArtefatosSaidaComando && listaArtefatosSaidaComando.length) {

    listaArtefatosSaidaComando.forEach(function (artefatoSaida) {

      let tipoAlteracao = artefatoSaida.match(/^(M|D|A|R)/g)[0]
      let diretorioProjeto = projeto.match(/[^/|\\]*$/g)[0]
      let artefato = diretorioProjeto + '/' + artefatoSaida.match(/[^\s+]\w.*/g)[0]

      let artefatoModificaoEncontrado = listaSaida.find(function (objSaida) {
        return objSaida.artefato === artefato && objSaida.tipoAlteracao === 'M';
      })

      if (tipoAlteracao === 'A' || !artefatoModificaoEncontrado) {

        listaSaida.push({
          tipoAlteracao: tipoAlteracao,
          artefato: artefato,
          task: task,
          numeroAlteracao: 1
        })
      } else {

        artefatoModificaoEncontrado.numeroAlteracao += 1;
      }
    })
  }

  return listaSaida
}

function obterParametros() {

  let obj = {}

  args.forEach(function (arg) {

    let key = arg.split('=')[0].replace(/[^\w]/g, '')
    let value = arg.split('=')[1].split(',')

    obj[key] = value;
  });

  return obj
}
