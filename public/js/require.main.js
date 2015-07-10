requirejs.config({
    baseUrl: "../js/",
    paths: {
        text: "modules/text",
        css: "modules/css",
        jquery: "libs/jquery.1.8.0",
        angular: "libs/angular."
    },
    packages: [
        {name: 'popMenu', location: 'modules/popMenu'}
    ]
});

// Start loading the main app file. Put all of
// your application logic in there.
/*
 requirejs(['apps/main']);*/
