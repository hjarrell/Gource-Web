import fetch from 'node-fetch'

export const getLog = (url) => {
    return fetch(`http://fsu.hunterjarrell.com:5000/log?repo=${url}`)
        .then((lines) => lines.text())
        .then((lines) => {
            let allChanges = [];
            let user = null;
            let timestamp = null;
            let addedFiles = [];
            let modifiedFiles = [];
            let deletedFiles = [];
            for (let line of lines.split('\n')) {
                if (line.startsWith('user:')) {
                    user = line.substring(5).trim();
                } else if (line.startsWith(':')) {
                    const split = line.split('\t');
                    const fileName = split[1].trim();
                    const changeType = split[0].split(' ')[4].trim();
                    if (changeType === 'A') {
                        addedFiles.push(fileName);
                    } else if (changeType === 'M') {
                        modifiedFiles.push(fileName);
                    } else if (changeType === 'D') {
                        deletedFiles.push(fileName);
                    }
                } else if (line !== '') {
                    timestamp = new Date(Number.parseInt(line.trim()) * 1000)
                } else {
                    allChanges.push({
                        user,
                        timestamp,
                        addedFiles,
                        modifiedFiles,
                        deletedFiles,
                    });
                    user = null;
                    timestamp = null;
                    addedFiles = [];
                    modifiedFiles = [];
                    deletedFiles = [];
                }
            }
            return allChanges;
        });
}
