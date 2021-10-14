# DowntimeAlerterProject
Dowtime Alerter project detects whether sites are Up or Down and sends notifications.
In this project used;


-Asp.Net Core MVC

-Entity Framework

-Bootstrap

-Jquery

-Hangfire

-AutoMapper

-Serilog

For Login;

UserName: user

Password: 4*!Vf2

For Add New Site: localhost:yourport/Site

For Notification Log List: localhost:yourport/NotificationLog

For Error/Information Log List: localhost:yourport/Log

For Hangfire Dashboard: localhost:yourport/hangfire

For Mail Settings: DowntimeAlerter.MVC -> appsettings.json

Here are mail settings;


    "MailSettings":  

      {

        "Mail": "necipbasertest@gmail.com", 

        "DisplayName": "Downtime Alerter",

        "Password": "password",

        "Host": "smtp.gmail.com",

        "Port": 587

      }
  
Serilog Settings: DowntimeAlerter.MVC -> appsettings.json

Here are Serilog settings;

      "Serilog": 

      {  

        "MinimumLevel": "Information",

        "WriteTo": [

          {

            "Name": "MSSqlServer",

            "Args": {

              "connectionString": "Server=(localdb)\\MSSQLLocalDB;Database=DowntimeAlerter;Trusted_Connection=True;MultipleActiveResultSets=true",

              "tableName": "Logs",

              "autoCreateSqlTable": true

            }

          }

        ]

      }
  
Necip Başer
