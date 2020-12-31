Required software: npm,node,sql workbench, postman,mysql server or wamp
1. To install modules: npm install, to run server: node server.js
2. Create a local database and modify dbhost,dbname,dbpassword in config.env
3. run the sql file inside db folder once. (For admin password, use bcryptjs in node to hash it and change it in sql)
4. Change the security code in config.env
5. Use postman to login with admin and base_url/api/subject/syllabus
6. build react app and past it to backend IMMS folder