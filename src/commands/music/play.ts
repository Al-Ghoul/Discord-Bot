import { SlashCommandBuilder, type ChatInputCommandInteraction, type CacheType, GuildMember } from 'discord.js';
import { createAudioResource, getVoiceConnection, joinVoiceChannel, } from '@discordjs/voice';
import { getOrCreateVoiceSubscription } from '~/lib';
import ytsearch from 'yt-search';
import ytdl from 'ytdl-core';

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song in a voice channel.')
    .addStringOption(option =>
        option
            .setName('input')
            .setDescription('A youtube URL or a search keyword.')
            .setRequired(true)
    );

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
            currentConnectionInCurrentGuild = joinVoiceChannel({
                channelId: userChannel.id,
                guildId: userChannel.guild.id,
                adapterCreator: userChannel.guild.voiceAdapterCreator,
            });
        }

        const subscription = getOrCreateVoiceSubscription(guildId);
        const player = subscription?.player;

        if (!player) {
            await interaction.reply({ content: "Failed to create a player!", ephemeral: true });
            return;
        }

        const input = interaction.options.getString('input');
        if (!!!input || input.length === 0) {
            await interaction.reply({ content: "No input received, please make sure you provide either a youtube URL or a keyword!", ephemeral: true });
            return;
        }
        await interaction.reply({ content: `Searching 🔎 for ${input}...`, ephemeral: true });

        const videoFinder = async (query: string) => {
            const videoResult = await ytsearch(query);
            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(input);
        if (video) {
            const stream = ytdl(video.url, { filter: 'audioonly' });
            const resource = createAudioResource(stream, { inlineVolume: true });
            player.play(resource);
            await interaction.followUp({ content: `Playing ${video.title}.`, ephemeral: true });
        } else {
            await interaction.reply({ content: "Could NOT find any results, please try again!", ephemeral: true });
            return;
        }


    } else {
        await interaction.reply({ content: "Something went wrong, please try again later.", ephemeral: true });
    }
}

export { data, execute };