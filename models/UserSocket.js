class CSocket {
    static clientSockets = [];

    static addClient(username, socket){
        clientSockets.push({username, socket});
    }

    static removeClient(username){
        clientSockets = clientSockets.filter(cs => cs.username !== username);
    }

    static emitEvent(event, target, data){
        let targets = target;
        if(!Array.isArray(target)){
            targets = [target];
        }

        targets.forEach(t => {
            let socket = clientSockets.find(cs.username === t);
            socket.emit(event, data);
        })
    }
}

module.exports = CSocket