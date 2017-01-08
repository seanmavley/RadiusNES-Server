# RadiusNES Server

This repository is the Radius Server part with an Express API endpoints attached part of the RadiusNES Stack. 

RadiusNES is a DaloRADIUS-like implementation using Node-radius as the RADIUS Server, Express JS as API and AngularJS 2 on the front-end and MongoDB as database backend.

## How to run locally

 - Download this repository, `git clone https://github.com/seanmavley/RadiusNES-Server`
 - `npm install`
 - You must MongoDB installed and working.
 - Run `nodemon DEBUG=myapp:* npm start`
 - Create new user to authenticate against. Do so via sending a REST POST to `localhost:port/users`. The post should look like this `{ "username": "username", "password": "password" }`
 - Test Authentication using this: `radtest username password localhost 1812 secret`. OR Test authentication via API sending same request to `localhost:port/radclient`


 More details will be added as time goes on about how the RadiusNES works.


## License

See the license file