function iFlickr() {
    this.config = {};
    this.url    = 'http://api.flickr.com/services/rest/';

    /*
     * @param       config(object)
     * @return      Void
     * @description Initialization
     */
    this.init = function(config)
    {
        config.format       = 'json';
        config.jsoncallback = 'Ext.util.JSONP.callback';
        this.config         = config;
    }

    /*
     * @param       query(object) all parameters
     */
    this.sign = function(query)
    {
        var key,
            keys,
            signature;

        keys = [];
        signature = this.config.secret || '';

        // sort parameters alphabetically
        for (key in query)
            keys.push(key);
        keys.sort();

        for (key in keys)
            if (!Ext.isEmpty(keys[key]) && Ext.isString(keys[key]))
                signature += keys[key] + query[keys[key]];

        return md5(signature);
    }

    /*
     * @param       query(object)
     * @param       callback(function)
     * @return      Void
     * @description JSONP request
     */
    this.request = function(query, callback)
    {
        query['api_key']      = this.config.api_key;
        query['perms']        = this.config.permission;
        query['format']       = this.config.format;
        query['jsoncallback'] = this.config.jsoncallback;

        var params = Ext.apply({
            'api_sig': this.sign(query)
        }, query);

        Ext.util.JSONP.request({
            url: this.url,
            params: params,
            callback: callback
        });
    }

    /*
     * @return      Void
     * @description Login process with permissions
     */
    this.authorize = function()
    {
        this.auth_getFrob(function(response){
            if (response.stat == 'ok')
            {
                var key,
                    query,
                    params,
                    login_url;

                query = {
                    api_key: flickr.config.api_key,
                    perms:   flickr.config.permission,
                    frob:    response.frob._content
                }
                params = Ext.apply({
                    'api_sig': flickr.sign(query)
                }, query);
                login_url = 'http://www.flickr.com/services/auth/?';

                for (key in params)
                    login_url += key + '=' + params[key] + '&';

                db.executeQuery("SELECT contains FROM settings WHERE parameter = 'frob';", [], function(t, r){
                    if (r.rows.length > 0)
                        db.executeQuery("UPDATE settings SET contains = '" + response.frob._content + "' WHERE parameter = 'frob';", []);
                    else
                        db.executeQuery("INSERT INTO settings (parameter, contains) VALUES ('frob', '" + response.frob._content + "');", []);
                });

                document.getElementById('flickr-browser').innerHTML = '<iframe src="' + login_url + '" style="display:none;"></iframe>';
                //window.open(login_url, 'go-to-flickr-and-authorize');
            }
            // TODO: what if there is a problem
        });
    }

    /*
     * @namespace   auth
     * @param       callback(function)
     * @return      Void
     * @description Returns a frob to be used during authentication.
     *              This method call must be signed.
     */
    this.auth_getFrob = function(callback)
    {
        this.request({method: 'flickr.auth.getFrob'}, callback);
    }

    /*
     * @param       frob(string)
     * @param       callback(function)
     * @return      Void
     * @description Returns the auth token for the given frob, if one has been attached.
     *              This method call must be signed.
     */
    this.auth_getToken = function(frob, callback)
    {
        this.request({method: 'flickr.auth.getToken', frob: frob}, callback);
    }

    /*
     * @param       auth_token(string)
     * @return      Void
     * @description Returns the credentials attached to an authentication token.
     *              This call must be signed as specified in the authentication API spec.
     */
    this.auth_checkToken = function(auth_token)
    {
    }
}