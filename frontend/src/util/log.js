import fetch from 'node-fetch'

export const getLog = (url) => {
    return fetch(`https://fsu.hunterjarrell.com/log?repo=${url}`)
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
        }).then((data) => {
            const hierByTime = {};
            let previous = [
                {id: 'root'}
            ];

            for (let commit of data) {
                const key = commit.timestamp.toISOString();
                let current = previous;
                for (let del of commit.deletedFiles) {
                    const split = ('root/' + del).split('/');
                    const file = split[split.length - 1];
                    const path = split.slice(0, split.length - 1).join('/');
                    current = current.filter((val) => {
                        return val.id !== file && val.parent !== path;
                    });
                }

                for (let add of commit.addedFiles) {
                    let split = ('root/' + add).split('/');
                    const file = split[split.length - 1];
                    let path = split.slice(0, split.length - 1).join('/');
                    current.push({
                        id: file,
                        parentId: path,
                        isDir: false,
                    });
                    split = path.split('/').slice(0, split.length - 1);
                    while (path !== 'root') {
                        split = path.split('/').slice(0, split.length - 1);
                        if (current.findIndex(({id, parentId, isDir}) => id === path && parentId === split.join('/') && isDir === true) < 0) {
                            current.push({id: path, parentId: split.join('/'), isDir: true})
                        }
                        path = split.join('/');
                    }
                }

                hierByTime[key] = current.slice(0)
                previous = current.slice(0);
            }
            return hierByTime;
        }).then((hier) => {
            const commits = Object.keys(hier).map((key) => {
                return [key, hier[key]];
            });
            commits.sort((a, b) => new Date(a) - new Date(b))
            return commits;
        });
}
