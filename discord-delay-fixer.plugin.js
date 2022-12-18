/**
 * @name DiscordDelayFixer
 * @author John#0142
 * @authorId 241604896925679617
 * @description Stops notification sound delay by continually playing sounds to keep the audio engine active. Fixes delay when muting/unmuting or when using PTT
 * @version 2.2.0
 * @updateUrl https://raw.githubusercontent.com/John-Dean/DiscordDelayFixer/master/discord-delay-fixer.plugin.js
 * @source https://raw.githubusercontent.com/John-Dean/DiscordDelayFixer/master/discord-delay-fixer.plugin.js
 * @website https://github.com/John-Dean/DiscordDelayFixer
 */
const audio_file = new Audio('/assets/dd920c06a01e5bb8b09678581e29d56f.mp3');
//Audio file name lifted from list here: https://github.com/xXNightOPXx/-Darkz-BetterDiscord-V4.0/blob/e145240242246950a8f381d8ca1a550d2c17d606/Darkz%20Plugins%20%7BV4.0%7D%20Fixed/NotificationSounds.plugin.js#L72

module.exports = (() => {
	const config = {
		info: {
			name: 'Discord Delay Fixer',
			authors: [{
				name: 'John#0142',
				discord_id: '241604896925679617',
				github_username: 'John-Dean'
			}],
			version: '1.0.0',
			description: 'Stops notification sound delay by continually playing sounds to keep the audio engine active. Fixes delay when muting/unmuting or when using PTT',
			github: 'https://github.com/John-Dean/DiscordDelayFixer',
			github_raw: 'https://raw.githubusercontent.com/John-Dean/DiscordDelayFixer/master/discord-delay-fixer.plugin.js'
		},
		version: '1.0.0',
		changelogItems: [
			{
				version: '1.0.0',
				title: 'v10.0.0',
				type: 'added',
				items: [
					'Initial release'
				]
			}
		],
		get changelog(){
			const item = this.changelogItems.find(item => item.version === this.version);
			if(!item) return item;
			return [item];
		},
		defaultConfig: [{
			type: "slider",
			id: "delay",
			name: "Delay",
			note: "Delay between sounds being played (ms)",
			value: 500,
			min: 100,
			max: 2000,
			markers: Array.from(Array(20), (_, i) => 100 + (100 * i)),
			stickToMarkers: true
		}]
	};

	return !global.ZeresPluginLibrary ? class {
		constructor(){ this._config = config; }
		getName(){ return config.info.name; }
		getAuthor(){ return config.info.authors.map(a => a.name).join(', '); }
		getDescription(){ return config.info.description; }
		getVersion(){ return config.info.version; }
		load(){
			BdApi.showConfirmationModal('Library Missing', `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
				confirmText: 'Download Now',
				cancelText: 'Cancel',
				onConfirm: () => {
					require('request').get('https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js', async(error, response, body) => {
						if(error) return require('electron').shell.openExternal('https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js');
						await new Promise(r => require('fs').writeFile(require('path').join(BdApi.Plugins.folder, '0PluginLibrary.plugin.js'), body, r));
					});
				}
			});
		}

		start(){
			
		}

		stop(){ }
	} : (([Plugin, Api]) => {
		const plugin = (Plugin, Api) => {
			const {
				DiscordModules
			} = Api;
    
			const {
				DiscordConstants
			} = DiscordModules;
			
			let timer;
    

			return class clicker extends Plugin {
				onStart(){
					audio_file.onplay = function(){
						audio_file.pause();
					}
					
					function playSound(sound){
						sound.volume = 0.1
						sound.currentTime = 0
						sound.play(sound)
					}
					
					timer = setInterval(function(){
						playSound(audio_file)
					}, this.settings.delay);
				}

				stop(){
					try{
						clearTimeout(timer);
					} catch(error){}
				}

				change_delay(){
					this.stop();
					this.start();
				}

				createExceptions(){
					return this.settings.exceptions.split(",")
				}

				getSettingsPanel(){
					const panel = this.buildSettingsPanel();
					panel.addListener((id) => {
						if(id == "delay"){
							this.change_delay()
						}
					});
					return panel.getElement();
				}
			}
		}
    
		return plugin(Plugin, Api);
	})(global.ZeresPluginLibrary.buildPlugin(config));
})();
