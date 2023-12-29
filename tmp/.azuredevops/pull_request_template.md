#Checklist de História

#Checklist Geral
## Roteiro de Teste
- [ ]O roteiro de testes foi criado, validado e anexado ao Azure DevOps?
- [ ]Todos os testes realizados estão descritos no roteiro de testes?
- [ ]Foi feita a Validação em Dupla?

##Clean Code
- [ ] É possível saber o que cada uma das funções faz apenas olhando seu nome?
- [ ] As funções criadas são de responsabilidade única?
- [ ] Estamos utilizando funções puras (Não muda qualquer estado na aplicação/não provoca nenhum efeito colateral)?
- [ ] O nome das variáveis e funções são descritivos o suficiente?
- [ ] Os "magic numbers" foram substituidos por constantes? 
- [ ] Classes possui sua própria responsabilidade?
- [ ] Novos componentes foram criados de forma genérica para reutilização? 
- [ ] Os componentes criados/alterados podem ser modularizados? (em componentes menores)
- [ ] Namespaces possuí classes e componentes com responsabilidades em comum, que fazem sentido?

##Sonar
- [ ] Ao término da estória, após fazer o merge da branch com a master, todos os testes automatizados passaram?
- [ ] Códigos duplicados/inutlizável foram removidos/corrigidos?
- [ ] Imports não utilizados foram removidos
- [ ] As métricas do sonar foram mantidas e os novos métodos criados estão cobertos por testes unitários, sem bugs, sem vulnerabilidades e sem novos code smells? 
- [ ] Todos os codes smells foram resolvidos?
- [ ] Não foi adicionado nenhum bug
- [ ] Os testes unitários estão cobrindo em pelo menos 80% as camadas de serviços e entidades?

#Checklist Geral - Frontend
##Validação Geral
- [ ] Comentários, console.log e debuggers foram removidos do código?
- [ ] O código css está utilizando o arquivo css geral (default-styles.scss) para manter padronização?
- [ ] Foram feitas as traduções dos campos?
- [ ] Os problemas acusados pelo Lint nas classes alteradas foram resolvidos?
- [ ] O layout segue o protótipo (fonte, tamanho, cor, alinhamento, borda, cor de fundo, valor default, máscara, agrupamento)?
- [ ] Os campos de formulário permitem somente valores válidos, considerando o valor de outros campos também? e.g. intervalo de datas, verificação de números com pontos/vírgula de separação, validação de valores incorretos (!@#$%¨&*, letras, decimais, negativos) e outras regras
- [ ] Houve alteração em algum arquivo de propriedades (e.g. environment.ts)? Foi replicado corretamente para os arquivos dos ambientes? Está correto para os ambientes de Dev, QA e PRD?
- [ ] Não existem erros de ortografia (label, msgs, português, acentuação...)? 