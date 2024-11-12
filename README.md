# Hosthis
## Description
Hosthis is a platform to host your nodejs website from your github repository.
Warning: only public repositories of Node.js projects can be hosted.

## Set up
3) Clone the project:
```bash
git clone https://forge.univ-lyon1.fr/hosthis-group/hosthis-front.git
```

2) Install dependecies:
```bash
npm install
```

3) Create network
```bash
docker network create hosthis-network
```

## Run
### Linux
```bash
docker compose up
```
### Windows - Docker desktop
```bash
docker compose up --watch
```

## Test
```bash
npm run test
```


## Production
### Build
```bash
npm run build
```
### Start
```bash
npm run start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Open [http://localhost:9090](http://localhost:9090) with your browser to see your metrics whith prometheus .
