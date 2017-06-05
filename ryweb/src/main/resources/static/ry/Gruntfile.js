;
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      demo: {
        src: [
          "./demo/widget/**/*",
          "./demo/widget/**"
        ]
      },
      build:{
        src:['./temp']
      }
    },
    typescript: {
      build: {
        src: ["./ts/**/*.module.ts","./ts/**/*.ts"],
        option: {
          module: 'amd', //or commonjs
          target: 'es5', //or es3
          sourceMap: true,
          declaration: false
        },
        dest: "./temp/main.js"
      }
    },
    ngtemplates: {
      app: {
        src: ["./ts/**/*.tpl.html"],
        dest: "./temp/myAppHTMLCache.js",
        options: {
          module: 'RongWebIMWidget', //name of our app
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }
      }
    },
    concat: {
      build: {
        files:[
          {
            src:[
              './temp/main.js',
              './temp/myAppHTMLCache.js'
            ],
            dest:'./js/RongIMWidget.js'
          }
        ]
      },
    },
    uglify:{
      release:{
        files:[
          {
            src:'./js/RongIMWidget.js',
            dest:'./js/RongIMWidget.min.js'
          }
        ]
      }
    },
    cssmin:{
      release:{
        src:'./css/RongIMWidget.css',
        dest:'./css/RongIMWidget.min.css',
      }
    },
    watch: {
      options: {
        spawn: false
      },
      build: {
        files: ["./ts/**"],
        tasks: ["build"]
      }
    },
    connect: {
      demo: {
        options: {
          port: 8000,
          hostname: '*',
          open: true,
          keepalive: true,
          base: ['./']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask("build", ["clean:build", "typescript",
    "ngtemplates:app","concat:build", "clean:build"
  ]);

  grunt.registerTask('release', ["build","uglify:release","cssmin:release"]);
}
