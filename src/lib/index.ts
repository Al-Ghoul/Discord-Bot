import { createAudioPlayer, NoSubscriberBehavior, getVoiceConnection, PlayerSubscription } from "@discordjs/voice";

const VoiceSubscriptions = new Map<string, PlayerSubscription>;

const getOrCreateVoiceSubscription = (guildId: string) => {
    if (VoiceSubscriptions.has(guildId)) return VoiceSubscriptions.get(guildId);

    const voiceConnection = getVoiceConnection(guildId);
    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });

    const subscription = voiceConnection?.subscribe(player) as PlayerSubscription;
    VoiceSubscriptions.set(guildId, subscription);

    return subscription;
}

const destroyVoiceAndSubscription = (guildId: string) => {
    const subscription = VoiceSubscriptions.get(guildId);
    if (subscription) {
        subscription.player.stop();
        subscription.connection.destroy();
        subscription.unsubscribe();
    }

    VoiceSubscriptions.delete(guildId);
}

export { getOrCreateVoiceSubscription, destroyVoiceAndSubscription };