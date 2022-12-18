# Discord Delay Fixer
Plugin for BetterDiscord (https://betterdiscord.app/) that prevents the notification sound system from having delay by continuously playing sounds

Video showing issue: https://youtu.be/odVpSCGwwgg?t=10

## How does it work?

The plugin plays an audio file every 500ms by default, then immediately pauses it. This keeps the audio part of Discord from seemingly being released from memory so any notification sounds (PTT, muting etc.) will be instant instead of delayed
