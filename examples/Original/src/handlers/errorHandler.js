const getAllFiles = require("../utils/getAllFiles");
const path = require('path');
const { bot } = require('../../data.json');
const errorHandler = require('./errorHandler')
module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    for (const eF of eventFolders) {
        const eFiles = getAllFiles(eF);
        eFiles.sort((a,b) => a > b)
        const folderName = eF.replace(/\\/g, '/').split('/').pop()

        client.on(folderName, async (x) => {
            for (const eFile of eFiles) {
                const eFunc = require(eFile);
                errorHandler(async function() {
                    await eFunc(client, x)
                }/*, function() {
                    if (typeof(x.reply) === "function") {
                        createEmbed(`System`, "<top> Bot errored on executing command, send a screenshot of this to <@877231123476906035> in DM's: ```\n%s```".replace("%s", error), client).then(
                            embed => x.reply({embeds: [embed], content: '', ephemeral: false})
                        )
                    } else {
                        console.log(error)
                    }
                }*/)
            }
        })
    }
};