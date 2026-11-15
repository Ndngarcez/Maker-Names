# Inventário antes da transformação em loja (2026-11-15)

Recuperação: tag backup/pre-loja-2026-11-15, commit aa2295d. Checkout limpo antes da mudança. Nenhuma base de dados foi consultada ou alterada. Recuperar a versão antiga com git switch --detach backup/pre-loja-2026-11-15 num checkout separado.

## Estrutura encontrada
- MakerNames.Api: ASP.NET Core 8, controladores, HTML/CSS/JS sem framework frontend.
- MakerNames.Core: geometria e geradores SVG/DXF/STL/CNC. Útil para fabrico interno; manter fonte fora do publish da loja.
- MakerNames.CncChecks: testes do motor de fabrico, manter fora do publish.
- UserStore: contas/sessões PBKDF2 e verificação de email; Microsoft.Data.SqlClient, tabela AppState com chave auth; fallback App_Data/auth.json. Não existe EF Core.
- EmailSender: SMTP existente e ficheiros locais de desenvolvimento, reutilizar transporte.
- StripeController: apenas webhooks de subscrições/quotas, não existe checkout de produtos. Substituir por checkout de pagamento único exclusivamente de teste.

## Remover da árvore da loja após este inventário
- DownloadLibrary: 783 ficheiros, 421,4 MiB; inclusão explícita no csproj.
- wwwroot/library: 436 ficheiros, 201,6 MiB.
- wwwroot/accessories: 1261 ficheiros, 83,8 MiB.
- wwwroot/fonts: 11 MiB, conservar fontes no diretório de ferramentas internas se necessário.
- Páginas antigas do gerador/biblioteca/comunidade e publicidade, controladores Library, Accessories, Community, Ads, ImageSearch, Generate e Cnc da API pública.
- Serviços DownloadLibraryStore, CommunityStore e CommunityAccessoryStore exclusivos da biblioteca.
- Referência da API a Core e dependências transitivas de desenho. Core e os seus testes continuam disponíveis para fabrico.

## Reutilização e proteção
Manter AuthController, transporte SMTP, SQL client, cabeçalhos HTTP e limitação de pedidos. Conservar os modelos de dados de contas antigos para não perder campos ao regravar utilizadores. Nunca apagar App_Data, configurações locais ignoradas pelo Git, segredos ou dados do Azure. Arquivar editor e fontes em tools/production, sem publicar. Manter a política Stonewall (outro produto) separada.

## Implementação
Catálogo com categorias, produtos e variantes; preços em cêntimos calculados no servidor. Carrinho local sem dados pessoais. Checkout com encomenda durável, token privado, idempotência e fotografia de preço/personalização; portes por zona, peso e valor. Administração autenticada com lista explícita de emails autorizados na configuração e proteção CSRF. Fotografias fora do publish. Emails com fila persistente/repetição. Stripe teste, verificação de assinatura e montante, eventos idempotentes. Sem pagamentos reais.

## Migração e limites
Tabelas Shop* novas na mesma ligação SQL, sem modificar AppState/auth. Desenvolvimento local em App_Data/shop.json; produção exige SQL para partilha segura entre instâncias. Configuração e exemplos ficam desativados para vendas até validação do proprietário. Textos legais são minutas para preencher e validar; relatórios de vendas não são faturas fiscais. Não cancelar automaticamente subscrições antigas no Stripe; verificar contratos existentes antes do lançamento.

## Deploy
Gerar nova publicação limpa, medir tamanho, confirmar ausência de bibliotecas/App_Data/segredos. Pacotes antigos na pasta superior não são o novo deploy. Não publicar no Azure automaticamente; o site existente e respetivos dados continuam intactos.

## Revisão de âmbito confirmada pelo proprietário
As instruções posteriores substituem o plano acima nesta entrega: Stripe fica adiado; manter o editor 3D existente, retirar CNC e exemplos de nomes preparados, trocar downloads por Adicionar ao carrinho.

Implementado:
- Editor e fontes continuam em wwwroot/v3 e wwwroot/fonts. Generate e ImageSearch foram preservados para o editor; Generate mantém fontes, SVG e STL de pré-visualização, sem rotas de pacote/download.
- Core continua referenciado para as pré-visualizações. Não foi movido para ferramentas internas.
- Biblioteca de nomes, controladores de biblioteca/comunidade/publicidade/CNC/Stripe e serviços exclusivos removidos. Quatro formas leves e os acessórios rápidos necessários foram conservados.
- Carrinho local guarda uma cópia integral do projeto, quantidade e nome; permite remover, alterar quantidades e persistir após recarregar. Limites e falhas de armazenamento tratados. Não guarda dados pessoais de checkout.
- Sem preços inventados, checkout, envio de encomendas ou pagamentos nesta entrega. O carrinho explica essa limitação. Administração e restante loja do plano inicial ficam para uma entrega posterior.
- Contas, dados, configuração e ficheiros ignorados pelo Git não foram apagados. Páginas informativas existentes preservadas; revisão editorial/legal ainda pendente.

Validação: build e publish Release concluídos; 2 testes Node do carrinho (gravação completa, recarregar, quantidades, remoção, vazio e quota); respostas HTTP 200 do editor, carrinho, fontes e geração SVG/STL. A validação visual no navegador integrado ficou impedida por timeout de localhost.
Publish limpo: 29,38 MiB, contra aproximadamente 738,4 MiB anteriormente; sem DownloadLibrary, library, CNC público, App_Data ou configuração Development. Não foi aplicado ao Azure.
