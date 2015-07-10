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
    jsPath = buildPath+"/libs",
    imagePath = buildPath+"/images",
    stylePath = buildPath+"/styles",
    jadePath = buildPath;

var jqpluginsrc="public/libs/jquery.plugin/*.libs",
    libsrc="public/libs/libs/*.libs",
    appsrc="public/libs/apps/*.libs",
    requiresrc="public/libs/*.libs",
    imagesrc ="public/images/*.*",
    stylesrc="public/styles/",
    jadesrc="views/**/*.jade",
    htmlsrc="public/*.html";

/*libs*/
gulp.task("jshint",function () {
    gulp.src("public/libs/*/*.libs")
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task("libs.jquery.plugin",function () {
    return gulp.src(jqpluginsrc)
        /*.pipe(concat("jquery.plugin.libs"))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsPath+"/jquery.plugin"))
        .pipe(size());
});

gulp.task("libs.libs",function () {
    return gulp.src(libsrc)
        /*.pipe(concat("libs.libs"))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsPath+"/libs"))
        .pipe(size());
});

gulp.task("libs.app",function () {
    return gulp.src(appsrc)
        /*.pipe(concat("apps.libs"))*/
        .pipe(uglify())
        .pipe(gulp.dest(jsPath+"/apps"))
        .pipe(size());
});

gulp.task("libs.require",function () {
    return gulp.src(requiresrc)
        .pipe(uglify())
        .pipe(gulp.dest(jsPath))
        .pipe(size());
});


/*styles*/
gulp.task("style",["style-font"],function () {
    return gulp.src(stylesrc+"/*.css")
        /*.pipe(concat("styles.css"))*/
        .pipe(minifyCss())
        .pipe(gulp.dest(stylePath))
        .pipe(size());
});
/*styles-font*/
gulp.task("styles-font",function () {
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
        ["libs.jquery.plugin",
            "libs.libs",
            "libs.app",
            "libs.require",
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
    gulp.watch(jqpluginsrc, ["libs.jquery.plugin"]);
    gulp.watch(libsrc, ["libs.libs"]);
    gulp.watch(appsrc, ["libs.app"]);
    gulp.watch(requiresrc, ["libs.require"]);
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