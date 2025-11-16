
export function preprocessSong( songText, {channelsEnabled, tempo, volume }){ //inspo by teacher (legend)


    let processedText = songText; 


    if(channelsEnabled){ 

        Object.entries(channelsEnabled).forEach(([channel, isEnabled]) => {

            if(!isEnabled){
                 // Channel is OFF - add underscore to mute
                 const regex = new RegExp(`^(${channel}):`, 'gm');
                 processedText = processedText.replace(regex, `_${channel}:`);
            }
            else{

                // Channel is ON - remove underscore if it exists
                const regex = new RegExp(`^_(${channel}):`, 'gm');
                processedText = processedText.replace(regex, `${channel}:`);
            }

        });
    }


    if (tempo) {

        processedText = processedText.replace(
            /setcps\([^)]*\)/, 
            `setcps(${tempo}/60/4)`
        );

    }


    if (volume) {
        processedText = processedText.replace(
            /\.(post)?gain\(([0-9.]+)\)/g, 
            (match, postPrefix, gainValue) => {
                const originalGain = parseFloat(gainValue);
                const scaledGain = (originalGain * volume).toFixed(2);
                const prefix = postPrefix ? 'postgain' : 'gain';
                return `.${prefix}(${scaledGain})`;
            }
        );

        processedText = processedText.replace(
            /const gain_patterns = \[([\s\S]*?)\]/,
            (match, arrayContent) => {
                // Replace simple numbers like "2" with scaled value
                const scaledContent = arrayContent.replace(
                    /"(\d+\.?\d*)"/g,
                    (m, num) => `"${(parseFloat(num) * volume).toFixed(2)}"`
                );
                // Replace numbers in patterns like {0.75 2.5}
                const fullyScaled = scaledContent.replace(
                    /(\d+\.?\d+)/g,
                    (m, num) => (parseFloat(num) * volume).toFixed(2)
                );
                return `const gain_patterns = [${fullyScaled}]`;
            }
        );
    }


    return processedText;


}