import { SlashCommandBuilder, type ChatInputCommandInteraction, type CacheType, GuildMember } from 'discord.js';
import { AudioPlayerStatus, getVoiceConnection, } from '@discordjs/voice';
import { getOrCreateVoiceSubscription } from '~/lib';

const data = new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Plays currently paused audio.');

const execute = async (interaction: ChatInputCommandInteraction<CacheType>) => {
    if (interaction.member instanceof GuildMember) {
        const userChannel = interaction.member.voice.channel;
        const guildId = interaction.guildId as string;
        let currentConnectionInCurrentGuild = getVoiceConnection(guildId);

        if (userChannel === null) {
            await interaction.reply({ content: "Please connect to a voice channel first!", ephemeral: true });
            return;
        }

        if (currentConnectionInCurrentGuild != null && userChannel.members.has(interaction.client.user.id) === false) {
            await interaction.reply({ content: "The bot is already connected in another channel.", ephemeral: true });
            return;
        }

        if (currentConnectionInCurrentGuild == null) {
            await interaction.reply({ content: "The bot is not connected nor playing, please use /play.", ephemeral: true });
            return;
        }

        const subscription = getOrCreateVoiceSubscription(guildId);
        const player = subscription?.player;

        if (!player) {
            await interaction.reply({ content: "Failed to create a player!", ephemeral: true });
            return;
        }

        if (player.state.status === AudioPlayerStatus.Playing) {
            await interaction.reply('Already playing!');
        } else {
            player.unpause();
            await interaction.reply(`Resumed by ${interaction.user.username}`)
        }

    } else {
        await interaction.reply({ content: "Something went wrong, please try again later.", ephemeral: true });
    }
}

export { data, execute };