
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

