# Bot Discord
Node.js application with discord.js library.

___

## Chat commands

Create a poll for a defined period with two to three response options, 
users vote by reacting with an emoji.

```text
/poll
```

___

## Development

Create and fill the .env files.

```shell
cp .env.example .env && cp bot/.env.example bot/.env
```

Build and start containers.

```shell
docker-compose build
docker-compose up
```

Discord bot is ready.

| Application |                          |
|-------------|--------------------------|
| Bot         | connected to your server |
| PHPMyAdmin  | localhost:8081           |

### Utils

Access containers.

```shell
docker-compose exec bot sh # Access bot container.
docker-compose exec db sh # Access database container.
```

Restart bot container when containers are running.

```shell
docker-compose restart bot
```

___

