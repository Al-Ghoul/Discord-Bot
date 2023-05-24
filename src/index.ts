import { Client, Events, GatewayIntentBits, Collection, type Interaction, type CacheType } from "discord.js";
import { token } from '~/config.json';
import * as fs from 'fs';
import * as path from 'path';

interface Command {
    data: string,
    execute: (interaction: Interaction<CacheType>) => void
}
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const extractedCommand = require(filePath);

        if (!!extractedCommand.data || !!extractedCommand.execute)
            client.commands.set(extractedCommand.data.name, extractedCommand);
        else
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred)
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        else
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(token);