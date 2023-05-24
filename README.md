A basic Discord music bot

First you'll need to clone the repo with 
```bash
git clone https://github.com/Al-Ghoul/Discord-Bot
```  
then run
```bash
yarn install --production
yarn deploy
```
or use [Docker](https://www.docker.com/get-started/)

```bash
docker build -t discord-bot .
```
The <code>-t</code> sets a tag name for ur container, and the <code>.</code> looks up for a <code>*DockerFile*</code> in the current directory, (You don't need to write any DockerFiles as I provided one with the repo) so you either <code>cd</code> (change directory) to your cloned repo or provide an absolute path such as <code>D:\Development\JavaScript\Discord-Bot</code>. if it contains any spaces or unusual characters make sure to put it in quotes.

Then you run the container with
```bash
docker run -d discord-bot
```
The <code>-d</code> runs the container in “detached” (in the background), then it'll take care of everything (i.e install dependencies and run the bot).