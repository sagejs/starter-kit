<#
.SYNOPSIS
Build helper

.DESCRIPTION
USAGE
    .\build.ps1 <command>

COMMANDS
    dev             run `dotnet run --project .\Sage.AppHost`
    test            run `dotnet test`
    watch           run `dotnet watch --project .\Sage.AppHost`
    codegen         runs project and generates Kiota bindings for web app
    help, -?        show this help message
#>

[CmdletBinding()]
Param(
    [Parameter(Position = 0)]
    [ValidateSet("dev", "watch", "test", "codegen", "help")]
    [string]$Command,
    [Parameter(Position = 1, ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

function Command-Dev
{
    dotnet run --project ./Sage.AppHost $Arguments
}

function Command-Watch
{
    dotnet watch --project ./Sage.AppHost $Arguments
}

function Command-Test
{
    dotnet test $Arguments
}

function Command-Codegen
{
    $res = Invoke-WebRequest "https://localhost:7059/health"
    $appHost = $null
    if ($res.StatusCode -ne 200)
    {
        Write-Host "Server not running, starting app host..."
        $appHost = Start-Job -ScriptBlock { dotnet run --project ./Sage.AppHost }

        foreach ($attempt in (1..60))
        {
            try
            {
                Write-Host "Attempting to connect to Web API #$attempt..."
                $res = Invoke-WebRequest "https://localhost:7059/health"
                if ($res.StatusCode -eq 200)
                {
                    break
                }
            }
            catch
            {
                Write-Host "Failed to connect to Web API #$attempt..."
            }

            Start-Sleep 1
        }

        Receive-Job $appHost
    }

    Write-Host "Connected to server!"

    try
    {
        Write-Host "Generating client..."
        kiota generate --output ./Sage.WebApp/app/api -l TypeScript -d https://localhost:7059/openapi/v1.json -c ApiClient --clean-output
        Write-Host "Generated client!"
    }
    finally
    {
        if ($null -ne $appHost)
        {
            Stop-Job $appHost
            Remove-Job $apphost

            Get-Job
        }
    }
}

function Command-Help
{
    Get-Help $PSCommandPath
}

Switch ($Command)
{
    "dev"  {
        Command-Dev
    }
    "watch" {
        Command-Watch
    }
    "test"  {
        Command-Test
    }
    "codegen" {
        Command-Codegen
    }
    "help" {
        Command-Help
    }
    default {
        Command-Help
    }
}