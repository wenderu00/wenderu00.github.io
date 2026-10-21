# language: pt
Funcionalidade: Mate o mutante
  Como visitante do portfólio
  Quero injetar mutantes no código e ver os testes caçarem cada um
  Para entender em poucos segundos o que é teste de mutação

  Contexto:
    Dado que estou no minijogo "Mate o mutante"

  Cenário: Injetar um mutante muda o código e o placar
    Quando eu injeto um mutante
    Então o código mostra o operador "<" destacado
    E o placar mostra 1 morto, 0 sobreviventes e score de 100%
    E o resultado é anunciado para leitores de tela

  Cenário: Um mutante sobrevive porque falta um teste de fronteira
    Quando eu injeto 3 mutantes
    Então o código mostra o operador ">" destacado
    E vejo a frase "Nenhuma suíte é perfeita. Por isso eu meço."
    E o placar mostra 2 mortos, 1 sobrevivente e score de 67%

  Cenário: Reiniciar zera o placar e restaura o código
    Dado que eu injetei 3 mutantes
    Quando eu reinicio o jogo
    Então o placar mostra 0 mortos, 0 sobreviventes e score de 0%
    E o código volta a ser "if (saldo >= preco) liberarModulo()"

  Cenário: Com movimento reduzido não há corrida
    Dado que prefiro movimento reduzido
    E que estou no minijogo "Mate o mutante"
    Quando eu injeto um mutante
    Então o placar mostra 1 morto, 0 sobreviventes e score de 100%
    E a cena não carrega o Rive
