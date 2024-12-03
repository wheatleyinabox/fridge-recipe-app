(dev container is optional, if vsc prompts you, you can decide)
1. download live server extension vscode by ritwick dey
2. go into recipes folder
3. `npm install`
4. add a .env based off of .env-sample
5. `npm run start`
6. run live server in vscode and click on the prompt that comes up

(for database)
start by adding the changes to server.js in backend 
cd to recipes folder
npm install 
npm install sqlite3
npm install sqlite
npm install axios

for frontend
cd to fridge-app folder
npm install
npm install axios

add necessary change to frontend tabs (tbd for merging)

run server using node server.js or smth in backend folder
run android app using npm run android in frontend folder

http://localhost:5000/getRecipes gives whats in the database atm
http://localhost:5000/addRecipe adds a set recipe

will add dynamic ip address
nothing in this frontend works
will add frontend adding recipe to database