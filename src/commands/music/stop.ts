import { SlashCommandBuilder, type ChatInputCommandInteraction, type CacheType, GuildMember } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { destroyVoiceAndSubscription } from '~/lib';

const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stops and disconnects the bot.');

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

        destroyVoiceAndSubscription(guildId);
        await interaction.reply({ content: `Stopped by ${interaction.user.username}!`, ephemeral: true });

    } else {
        await interaction.reply({ content: "Something went wrong, please try again later.", ephemeral: true });
    }
}

export { data, execute };