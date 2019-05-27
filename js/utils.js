define(['client', 'events'], function (client, events) {
    "use strict";

    return {
        client: client,
        get context() {
            return this.client.context;
        },
        ee: events,

        /**
         * Adds all peers from friend-list
         */
        addAll: function() {
            this.client.whitelist.forEach(conn => this.client.addPeer(conn));
        },

        /**
         * Connects to the peer server with specified ID
         * If no ID was specified random one is set
         * @param peerID ID for client
         */
        connect: (peerID) => {
            if (peerID) {
                $("#nickname").val(peerID);
            }

            $("#init").click();
        },

        /**
         * Outputs to console all subscriptions for specified
         * type of event
         * @param ev type of event (ee.MSG, ee.EVENTS)
         */
        listSubscriptions: function(ev) {
            for (let i in ev) {
                console.log(ev[i], ': ', this.ee.ee.getListeners(ev[i]));
            }
        },


        timer: {
            times: {},

            start: function(it) {
                let now = performance.now();

                this.times[it] = {
                    sum: 0,
                    last: Infinity
                };

                this.times[it]['last'] = now;
            },

            pause: function(it) {
                let now = performance.now();

                if (this.times[it] === undefined) {
                    console.log("Fucked up");
                }

                this.times[it]['sum'] += now - this.times[it]['last'];
            },

            resume: function(it) {
                let now = performance.now();

                if (this.times[it] === undefined) {
                    console.log("Fucked up");
                }

                this.times[it]['last'] = now;
            },

            stop: function(it) {
                if (this.times[it] === undefined) {
                    console.log("Fucked up");
                }

                this.pause(it);
                console.log(`${it} time is: ${this.times[it]['sum']}`);
            },
        }
    }
});
