module.exports = function (io, streams) {

    io.on('connection', function (client) {
        console.log('-- ' + client.id + ' joined --');
        client.emit('id', client.id);

        client.on('message', function (details) {
            var otherClient = io.sockets.connected[details.to];

            if (!otherClient) {
                return;
            }
            delete details.to;
            details.from = client.id;
            otherClient.emit('message', details);
        });

        client.on('call', function (message) {
            var key = message.key;
            var to = streams.getStreams()[key];
            if(!to){
                return;
            }
            var otherClient = io.sockets.connected[to];
            if (!otherClient) {
                return;
            }
            var details = {};
            details.from = client.id;
            details.type = "init";
            details.message = null;
            otherClient.emit('message', details);
        });

        client.on('readyToStream', function (options) {
            console.log('-- ' + client.id + ' is ready to stream --');
            client.key = options.key;
            streams.addStream(client.id, options.key);
        });

        client.on('update', function (options) {
            streams.update(client.id, options.key);
        });

        function leave() {
            console.log('-- ' + client.id + ' left --');
            if(client.key){
                streams.removeStream(client.key);
            }
        }

        client.on('disconnect', leave);
        client.on('leave', leave);
    });
};