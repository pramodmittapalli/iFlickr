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
    api_key   : 'd8a2f33b9100814f276afae3b8374072',
    secret    : 'a9ca03187c819923',
    permission: 'write'
});

