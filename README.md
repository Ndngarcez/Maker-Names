# Maker Names

**Editor web de nomes personalizados para CNC, corte a laser e impressão 3D.**

O Maker Names permite compor nomes com diferentes fontes e elementos decorativos, visualizar o resultado e exportar ficheiros SVG, DXF e STL. O projeto reúne uma interface em HTML, CSS e JavaScript, uma API em ASP.NET Core e uma biblioteca C# dedicada à geração de geometria.

[Experimentar o site](https://makernames-web-budkfba4gtg7b6df.westeurope-01.azurewebsites.net/) · [Abrir o editor](https://makernames-web-budkfba4gtg7b6df.westeurope-01.azurewebsites.net/editor.html) · [Perfil do autor](https://github.com/Ndngarcez)

## Exemplo da biblioteca

![Modelo Amelia disponível na biblioteca do Maker Names](MakerNames.Api/wwwroot/library/names/amelia/preview.png)

*Pré-visualização de um modelo incluído na biblioteca de downloads do projeto.*

## Funcionalidades

- Editor de nomes com seleção de fontes, cores, espaçamento e ajustes de letras.
- Composição com acessórios e elementos decorativos.
- Pré-visualização do desenho e visualização 3D.
- Exportação em **SVG**, **DXF** e **STL**.
- Biblioteca de nomes preparados para download.
- Contas de utilizador, verificação de email e recuperação de palavra-passe.
- Integrações de email por SMTP e processamento de eventos Stripe, mediante configuração.

## Tecnologias

| Área | Tecnologias |
| --- | --- |
| Interface | HTML, CSS, JavaScript |
| API | C#, ASP.NET Core, .NET 8 |
| Geometria e geração | System.Drawing.Common, LibTessDotNet |
| Dados de autenticação | Ficheiro JSON local ou SQL Server, conforme a configuração |
| Documentação da API | Swagger / OpenAPI em desenvolvimento |
| Site publicado | Azure App Service |

## Organização do código

```text
MakerNames.Api/
  Controllers/     Endpoints da API
  Services/        Contas, emails, comunidade e biblioteca
  wwwroot/         Interface web, fontes e recursos visuais
  DownloadLibrary/ Modelos disponíveis para download
MakerNames.Core/
  Generators/      Geração de nomes e exportação SVG, DXF e STL
  Geometry/        Operações de geometria
  Moldels/         Modelos de dados (nome atual da pasta)
```

A API referencia a biblioteca Core. Esta separação organiza a lógica de geração fora dos controladores e da interface web.

## Executar localmente

**Requisitos:** Windows, Git e SDK .NET 8 ou superior compatível com o destino .NET 8. A geração gráfica depende de System.Drawing e requer Windows.

```powershell
git clone https://github.com/Ndngarcez/Maker-Names.git
cd Maker-Names
dotnet restore MakerNames.Api/MakerNames.Api.csproj
dotnet build MakerNames.Api/MakerNames.Api.csproj
dotnet run --project MakerNames.Api -- --desktop
```

O modo desktop inicia o servidor e abre o editor em `http://127.0.0.1:58731/editor.html?desktop=1`.

Para executar com o perfil HTTP de desenvolvimento:

```powershell
dotnet run --project MakerNames.Api --launch-profile http
```

O site fica disponível em `http://localhost:5052` e a documentação da API em `http://localhost:5052/swagger`.

## Configuração e dados locais

O `appsettings.json` publicado contém valores de exemplo. Os serviços externos precisam das respetivas credenciais, configuradas por variáveis de ambiente ou num ficheiro local excluído do Git.

| Variável de ambiente | Finalidade |
| --- | --- |
| `Smtp__Host`, `Smtp__Port`, `Smtp__EnableSsl` | Servidor de email |
| `Smtp__UserName`, `Smtp__Password`, `Smtp__FromEmail` | Autenticação e remetente de email |
| `Notifications__AdminEmail` | Destinatário das notificações administrativas |
| `Stripe__WebhookSecret` | Validação dos eventos recebidos do Stripe |
| `GoogleSearch__ApiKey`, `GoogleSearch__Cx` | Integração de pesquisa de imagens |
| `ConnectionStrings__AuthDatabase` | Base de dados SQL Server opcional para autenticação |

Sem ligação à base de dados, o serviço de contas utiliza `App_Data/auth.json`. Sem servidor SMTP configurado, os emails são guardados localmente em `App_Data/emails`.

A pasta `App_Data`, as configurações de desenvolvimento/produção e os ficheiros de compilação estão excluídos do Git. Não publiques palavras-passe, chaves de API nem dados reais de utilizadores.

## O que este projeto demonstra

- Integração de uma interface web com uma API em C#.
- Organização do código entre apresentação, serviços e geração de geometria.
- Conversão de nomes e desenhos em formatos usados em fabricação digital.
- Implementação de fluxos de contas e integração com serviços externos.
- Configuração e disponibilização de uma aplicação web no Azure.

## Autor

**Nuno Daniel Neto Garcez** — [GitHub: Ndngarcez](https://github.com/Ndngarcez)

### Descrição curta para currículo

> Maker Names — projeto web em C# / ASP.NET Core e JavaScript para criar nomes personalizados e exportar SVG, DXF e STL para CNC, corte a laser e impressão 3D. Inclui editor visual, biblioteca de modelos e gestão de contas, com demonstração publicada no Azure.
