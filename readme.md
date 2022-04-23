# servermesh-client
<img src="servermesh-client.gif" width="640" height="411">

This is a client for a larger server meshing project.
The main libraries are [three.js](https://threejs.org/) and [D3](https://d3js.org/).
Three.js is used for the creating a 3D world on a `<canvas>`, and D3 is used for the crosshair on an `<svg>`.
[Vite](https://vitejs.dev/) is used for building the project.

## Current status, future plans
Right now, this client just loads a single static region that is not yet provided by a server.
But this client will eventually allow users to fly around in a three-dimensional space made up of many regions, each handled by a different server.
Users will be able to interact with and modify objects within these regions, and each region state will be updated and shared across all clients as needed.
I've been interested in the server meshing plans for Star Citizen, and decided to play around with the idea using technology I'm familiar with.

Users fly around in a 3D space interacting with objects that slowly grow and move over time. Users try to collect enough of various types of objects/resources to complete their recipe. Objects are faster the smaller they are, and slow down as they continuously grow. Users compete against others to complete their recipe.

Users are collecting and then completing recipes that create new items the user will then have access to.