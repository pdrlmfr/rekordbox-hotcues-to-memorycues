const fs = require('fs');
const xml2js = require('xml2js');

const xml = fs.readFileSync('in.xml');
const parser = new xml2js.Parser({ preserveWhitespace: true });

//TODO: Adicionar alteraçao apartir de x data DateAdded="2022-11-05"

parser.parseString(xml, (err, obj) => {
    if (err) {
        console.error(err);
    } else {
        obj.DJ_PLAYLISTS.COLLECTION[0].TRACK.forEach(track => {

            //Extract the key of a track from its name.
            if (track.$.Name) {
                const regex = /^(\d{1,2}[AB][mb]?)\s/;
                const match = regex.exec(track.$.Name);
                if (match) {
                    track.$.Tonality = match[1];

                }
            }

            if (track.POSITION_MARK) {
                track.POSITION_MARK.forEach(posMark => {

                    //Update the start value of a position marker by adding 0.05 
                    const value = posMark.$.Start
                    const startValue = parseFloat(+value + 0.05).toFixed(3);
                    posMark.$.Start = startValue.toString();

                    //Convert Hotcue to Memory Cue.
                    posMark.$.Num = '-1';
                    posMark.$.Name = '';
                });
            }
        });

        const builder = new xml2js.Builder({ preserveWhitespace: true });
        const xmlWithNewValues = builder.buildObject(obj);

        fs.writeFileSync('out.xml', xmlWithNewValues);
    }
});
