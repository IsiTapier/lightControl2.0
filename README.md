Installation:

Backend:

1. install NodeJs:      https://nodejs.org/en/download/package-manager
2. install packages:    npm install
3. install mongoDb:     https://www.mongodb.com/try/download/community
4. run dev mode first!  npm run start:dev
5. add devices (change in movingHeadService.ts)
6. run production mode: npm run start:prod

// Important: run npm run start:dev after pull


Frontend:

1. cd frontend
2. npm install
3. npm install -g @ionic/cli
4. ionic serve --prod --external

autostart:
win + r -> 'shell:common startup'

startFrontend.bat:
@echo off
cd /d "c:\Users\Isaja\Documents\lightControl2.0\frontend"
cmd /k "ionic serve --prod --external"
pause

startBackend.bat:
@echo off
cd /d "c:\Users\Isaja\Documents\lightControl2.0\backend"
cmd /k "npm run start:prod"
pause
