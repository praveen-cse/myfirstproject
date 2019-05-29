const Boom = require('boom');
exports.plugin = {
  name: 'myScheme',
  version: '1.0.0',
  register: async function (server, options) {

      let impl = function (server, options) {
        const scheme = {
          authenticate: function (request, h) {
            try {
              if (options.key == request.headers.key){
                console.log('Authenticated')
              return h.authenticated({
                //console.log('Authenticated and welcome '+options.name);
                credentials: { "hello": "world"}
              });
            }
            else{
             console.log("UnAuthenticated");
             throw Boom.unauthorized(null,'custom');
           }
          }
            catch (err) {
              throw Boom.unauthorized(err);
            }
          }
        };
        return scheme;
      };
      
      // Create a route for example
      server.auth.scheme('my-scheme', impl);
  }
};