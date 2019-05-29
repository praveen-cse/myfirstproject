exports.plugin = {
  name: 'myPlugin',
  version: '1.0.0',
  register: async function (server, options) {
    console.log('Printing from ',options.name);
  }
};