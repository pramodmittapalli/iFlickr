var db,
    about,
    camera,
    flickr,
    session,
    settings,
    settingsToolbar,
    application,
    applicationToolbar,
    mainContainer;

session = null;
db = new JSBase();
db.connect('iFlickrDB');

flickr = new iFlickr();
flickr.init({
    api_key   : 'your-api-key',
    secret    : 'your-secret',
    permission: 'write'
});

