# DowntimeAlerter Project
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

**`UserName`**: user

**`Password`**: 4*!Vf2

App screenshots;

**`Login Screen`**

![alt text](https://user-images.githubusercontent.com/22480128/137471360-41a7c6d7-d04c-496a-877e-fda99537c341.png)

**`Home Page - DashBoard`**

![alt text](https://user-images.githubusercontent.com/22480128/137472789-df4422fb-f513-453e-a5eb-1f1d5dbe87f0.png)

**`Sites page - Add/Delete/Edit Site and Email Address(1 site to many email address)`**

![alt text](https://user-images.githubusercontent.com/22480128/137471396-2f64c980-5c99-4f1e-82b1-780a0ac3877e.png)
![alt text](https://user-images.githubusercontent.com/22480128/137471376-4ae66637-736a-45bc-be95-187d9518d1af.png)

**`Sended Mails`**

![alt text](https://user-images.githubusercontent.com/22480128/137471640-d9f85aec-595a-4883-97a6-d96a218b4d07.png)

**`Notification Logs Screen`**

![alt text](https://user-images.githubusercontent.com/22480128/137471379-ea95cf48-b8fd-423c-af85-a4e5dab0d279.png)

**`Error/Information Logs Screen`**

![alt text](https://user-images.githubusercontent.com/22480128/137471386-1fd8f370-44d0-4bc3-a0e8-e2183be45005.png)

For Add New Site: **`localhost:<your_port>/Site`**

For Notification Log List: **`localhost:yourport/NotificationLog`**

For Error/Information Log List: **`localhost:yourport/Log`**

For Hangfire Dashboard: **`localhost:yourport/hangfire`**

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
