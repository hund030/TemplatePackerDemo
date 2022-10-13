{
  "profiles": {
    "Microsoft Teams (browser)": {
      "commandName": "Project",
      "commandLineArgs": "host start --port 5130 --pause-on-error",
      "dotnetRunMessages": "true",
      "launchBrowser": true,
      "launchUrl": "https://teams.microsoft.com/l/app/%TEAMSAPPID%?installAppPackage=true&webjoin=true&appTenantId=%TENANTID%&login_hint=%USERNAME%",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "TEAMSFX_NOTIFICATION_LOCALSTORE_DIR": "../../.." // Path to project folder $(MSBuildProjectDirectory)
      }
    }
    //// Uncomment following profile to debug project only (without launching Teams)
    //,
    //"{{ProjectName}}": {
    //  "commandName": "Project",
    //  "commandLineArgs": "host start --port 5130 --pause-on-error",
    //  "dotnetRunMessages": "true",
    //  "environmentVariables": {
    //    "ASPNETCORE_ENVIRONMENT": "Development",
    //    "TEAMSFX_NOTIFICATION_LOCALSTORE_DIR": "../../.." // Path to project folder $(MSBuildProjectDirectory)
    //  }
    //}
  }
}
