# language: pt
Funcionalidade: Mate o mutante
  Para entender teste de mutação em poucos segundos
  Como visitante do portfólio
  Quero injetar mutantes no código e ver se a suíte de testes percebe a troca

  Contexto:
    Dado que o jogo "Mate o mutante" está carregado na seção "O que faço"

  Cenário: Injetar um mutante e ver o placar mudar
    Quando eu injeto um mutante
    Então o código mostra ">=" trocado por "<"
    E o anúncio diz "Morto pelo teste t1"
    E o placar mostra 1 morto, 0 sobreviventes e mutation score de 100%

  Cenário: Ver um mutante sobreviver
    Quando eu injeto 3 mutantes
    Então o anúncio diz "Sobreviveu: nenhum teste falhou"
    E o anúncio diz "Faltou um teste como saldo 30, preço 30: libera"
    E vejo a frase "Nenhuma suíte é perfeita. Por isso eu meço."
    E o placar mostra 2 mortos, 1 sobrevivente e mutation score de 67%

  Cenário: Reiniciar zera o placar
    Dado que eu já injetei 3 mutantes
    Quando eu clico em "Reiniciar"
    Então o placar mostra 0 mortos, 0 sobreviventes e mutation score de 0%
    E o código volta a ser "if (saldo >= preco) liberarModulo()"

  Cenário: Cliques repetidos não pulam rodadas
    Quando eu clico em "Injetar mutante" 3 vezes seguidas
    Então o anúncio diz "Mutante 1 de 7"
    E o placar mostra 1 morto, 0 sobreviventes e mutation score de 100%

  Cenário: Jogar só com teclado
    Quando eu navego com Tab até o botão "Injetar mutante"
    Então o botão "Injetar mutante" tem foco visível
    Quando eu pressiono Enter
    Então o anúncio diz "Mutante 1 de 7"
    Quando eu pressiono Espaço
    Então o anúncio diz "Mutante 2 de 7"
    Quando eu navego com Tab até o botão "Reiniciar"
    E eu pressiono Enter
    Então o placar mostra 0 mortos, 0 sobreviventes e mutation score de 0%
