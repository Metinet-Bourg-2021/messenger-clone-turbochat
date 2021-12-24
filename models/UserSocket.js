class CSocket {
    static clientSockets = [];

    static addClient(username, socket){
        if(!this.clientSockets){
            this.clientSockets = [];
        }
        this.clientSockets.push({username, socket});
    }

    static removeClient(socketId){
        if(Number.isInteger(socketId) && this.clientSockets) {
            this.clientSockets = this.clientSockets.filter(cs => cs.socket.id !== socketId);
        }
    }

    static emitAll(event, data) {
        this.clientSockets.forEach(s => {
            s.socket.emit(event, data);
        })
    }

    static emitEvent(event, target, data){
        let targets = target;
        if(!Array.isArray(target)){
            targets = [target];
        }

        targets.forEach(t => {
            let usersocket = this.clientSockets.find(cs => cs.username === t);
            usersocket.socket.emit(event, data);
        })
    }
}

module.exports = CSocket