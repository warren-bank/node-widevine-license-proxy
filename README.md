### [_Widevine License Proxy_](https://github.com/warren-bank/node-widevine-license-proxy)

#### How to: Run the server(s):

```bash
wvlpd <options>

options:
========
--help
--version
--tls
--req-insecure
--port <number>
--use <filepath>
--tls-cert <filepath>
--tls-key <filepath>
--tls-pass <filepath>
```

#### Functionality:

Supports a plugin architecture for server configuration.

#### Server Configuration:

The `--use <filepath>` option can be repeated to configure multiple servers.
Each filepath points to a node (CommonJs) module.
The export signature of each module looks like:

```javascript
module.exports = {
  route: '/my-route', // unique path with optional params

  getCertificate: async function(req) {
    // input:
    //   const {method, headers, xhr, secure, protocol, path, params, query, body} = req

    // output resolves to:
    //   String (in base64 encoding), Buffer, TypedArray, or ArrayBuffer
  },

  getLicense: async function(req) {
    // input:
    //   const {method, headers, xhr, secure, protocol, path, params, query, body} = req

    // output resolves to:
    //   String (in base64 encoding), Buffer, TypedArray, or ArrayBuffer
  }
}
```

Where:

* the `req` object parameter is a deep clone of the [_Express_ `req` object](https://expressjs.com/en/4x/api.html#req.properties)<br>having a subset of its properties

#### Examples:

Please refer to the [_recipes_ directory](./.recipes/).

#### Legal:

* copyright: [Warren Bank](https://github.com/warren-bank)
* license: [GPL-2.0](https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt)
