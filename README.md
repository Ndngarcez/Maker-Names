# Maker Names

Aplicação em C# / ASP.NET Core (.NET 8) para criar nomes personalizados e exportar SVG, STL e DXF.

- `MakerNames.Api`: API, serviços e interface web em `wwwroot`.
- `MakerNames.Core`: geração de nomes e geometria.

## Executar localmente

Instala o SDK .NET 8 ou superior e executa na raiz:

```powershell
dotnet restore MakerNames.Api/MakerNames.Api.csproj
dotnet run --project MakerNames.Api -- --desktop
```

O modo desktop abre o editor em http://127.0.0.1:58731/editor.html?desktop=1.

## Configuração

O ficheiro appsettings.json contém apenas valores de exemplo. Configura os serviços externos através de variáveis de ambiente, por exemplo `Smtp__Password`, `Stripe__WebhookSecret`, `GoogleSearch__ApiKey` e `ConnectionStrings__AuthDatabase`. Os serviços externos precisam da respetiva configuração para funcionar.

Os dados locais em App_Data (contas, sessões e emails), configurações de desenvolvimento e ficheiros de compilação são excluídos do Git.

A geração gráfica usa System.Drawing e requer Windows.
