var gulp = require("gulp"),
    uglify = require("gulp-uglify"),
    jshint = require("gulp-jshint"),
    concat = require("gulp-concat"),
    size = require("gulp-filesize"),
    minifyCss = require("gulp-minify-css"),
    minifyHtml = require("gulp-minify-html"),
    minifyHtmlAll = require('gulp-minifier'),
    imageop = require("gulp-image-optimization"),
    jade = require("gulp-jade"),
    clean = require("gulp-clean"),
    browserSync = require("browser-sync"),
    runSequence  = require("run-sequence");

var buildPath="public/build",
    jsPath = buildPath+"/js",
    imagePath = buildPath+"/images",
    stylePath = buildPath+"/style",
    jadePath = buildPath;

var jqpluginsrc="public/js/jquery.plugin/*.js",
    libsrc="public/js/lib/*.js",
    appsrc="public/js/app/*.js",
    requiresrc="public/js/*.js",
    imagesrc ="public/images/*.*",
    stylesrc="public/style/",
    jadesrc="views/**/*.jade",
    htmlsrc="public/*.html";

/*js*/
gulp.task("jshint",function () {
    gulp.src("public/js/*/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task("js.jquery.plugin",function () {
    return gulp.src(jqpluginsrc)
        /*.pipe(concat("jquery.plugin.js"))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsPath+"/jquery.plugin"))
        .pipe(size());
});

gulp.task("js.lib",function () {
    return gulp.src(libsrc)
        /*.pipe(concat("lib.js"))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsPath+"/lib"))
        .pipe(size());
});

gulp.task("js.app",function () {
    return gulp.src(appsrc)
        /*.pipe(concat("app.js"))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsPath+"/app"))
        .pipe(size());
});

gulp.task("js.require",function () {
    return gulp.src(requiresrc)
        .pipe(uglify())
        .pipe(gulp.dest(jsPath))
        .pipe(size());
});


/*style*/
gulp.task("style",["style-font"],function () {
    return gulp.src(stylesrc+"/*.css")
        /*.pipe(concat("style.css"))*/
        .pipe(minifyCss())
        .pipe(gulp.dest(stylePath))
        .pipe(size());
});
/*style-font*/
gulp.task("style-font",function () {
    return gulp.src(stylesrc+"/*/*.*")
        .pipe(gulp.dest(stylePath));
});

/*image*/
gulp.task("image",function () {
    return gulp.src("public/images/*.*")
        .pipe(imageop({
            optimizationLevel: 1,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(imagePath));
});

/*jade to html*/
gulp.task("jade",function (cb) {
    return gulp.src(jadesrc)
        .pipe(jade())
        .pipe(gulp.dest(jadePath))
        .pipe(minifyHtmlAll({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest(jadePath))
        .pipe(size());
});
/*html*/
gulp.task("html",function () {
    return gulp.src(htmlsrc)
        .pipe(minifyHtmlAll({
            minify: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest(buildPath))
        .pipe(size());
});
/*build*/
gulp.task("build",function (back) {
    runSequence(
        "clean",
        "html",
        "jade",
        "style",
        ["js.jquery.plugin",
            "js.lib",
            "js.app",
            "js.require",
            "image"
        ]
        ,back)
});
/*clean*/
gulp.task("clean",function(){
    return gulp.src(buildPath+"/*",{read:false})
        .pipe(clean({force:true}))
});
/*watch*/
gulp.task("watch",function () {
    /*gulp.watch(["public/!**!/!*.*"],{debounceDelay:2000}).on("change",browserSync.reload);*/
    gulp.watch(jqpluginsrc, ["js.jquery.plugin"]);
    gulp.watch(libsrc, ["js.lib"]);
    gulp.watch(appsrc, ["js.app"]);
    gulp.watch(requiresrc, ["js.require"]);
    gulp.watch(imagesrc, ["image"]);
    gulp.watch(stylesrc, ["style"]);
    gulp.watch(htmlsrc, ["html"]).on("change",browserSync.reload);
    gulp.watch(jadesrc, ["jade"]).on("change",browserSync.reload);
});

/*sync testing*/
/*gulp.task("serve",function(){
 browsersync({
 server:{
 baseDir:"public",
 middleware:[]
 },
 port:5000
 });
 });*/
gulp.task('serve', function() {
    browserSync({
        proxy: "127.0.0.1:3000"
    });
});

/*start*/
gulp.task("default",function(){
    runSequence("build", "serve", "watch");
});