
Controls Summary:

Play Button - Starts playing the music with current settings and preprocessed code
Stop Button - Stops the music playback
Volume Slider - Adjusts master volume (0.1x to 2.0x multiplier) by scaling all gain values in the code
BPM Input - Sets the tempo/speed of the music (60-200 BPM)
Channel Switches (Main_arp, Bassline, Drums, Drums 2) - Toggle individual instrument channels on/off by adding/removing underscore prefix to mute them
Load Settings - Upload a JSON file to restore saved volume, tempo, channel states, and code
Save Settings - Download current settings (volume, tempo, channels, code) as a JSON file with custom filename
Text Editor (left) - Edit the original Strudel code before preprocessing
Live Editor (right) - Shows the preprocessed code that's actually being played
D3 Waveform - Real-time visualization of audio amplitude from the last 80 events


Boostraps:
Most boostraps are v5.3 
https://getbootstrap.com/docs/5.3/getting-started/introduction/


Link to video:
https://www.loom.com/share/c4dc03004c4c4520ad16fdf981a248bc

AI tools used:

Claude.AI

Issue Faced : Child components were re-rendering unnecessarily when parent state changed, causing performance issues with frequently-updated controls like volume and tempo which caused breaking
(Prompt: Why is my volume breaking and lags despite the user range volume value is being updated correctly)
AI Help: Claude AI explained that functions recreated on every render cause child re-renders when passed as props. Recommended using useCallback to memoize functions and create stable references, 
which helped with performance and reduce lag with my function





