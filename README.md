# Hosthis
## Description
Hosthis is a platform to host your nodejs website from your github repository.
Warning: only public repositories of Node.js projects can be hosted.

## Set up
1) Clone the project:
```bash
git clone https://github.com/byodd/Hosthis.git
```

2) Clone the backend project and follow its instruction:
```bash
git clone https://github.com/Claquetteuuuh/hosthis-back.git
```

3) Install dependecies:
```bash
npm install
```

4) Create network
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
