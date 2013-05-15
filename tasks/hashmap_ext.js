/*
 * grunt-hashmap-ext
 * https://github.com/stryju/grunt-hashmap-ext
 *
 * Copyright (c) 2013 tomasz stryjewski
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function( grunt ) {
  grunt.registerMultiTask( 'hashmap_ext', 'Your task description goes here.', function(){

    var options = this.options({
      align : false,
      keep  : true
    });

    var mergedMap = {};

    this.files.forEach( function( file ){
      var map = grunt.file.readJSON( file.src );

      Object.keys( map ).forEach( function( src ){
        mergedMap[ src ] = map[ src ];
      } );
    } );

    var sources = Object.keys( mergedMap );

    var maxLength = Math.max.apply( Math, sources.map( function( src ){
      return src.length;
    } ) );

    var hashesArray = [];

    sources.forEach( function( src ){
      var dest = src.replace( /(\.[a-z0-9]+)$/, '-' + mergedMap[ src ] + '$1' );

      var hashesArrayEntry = '\'' +
        src +
        '\'' +
        ( options.align ? new Array( maxLength - src.length + 1 ).join( ' ' ) : '' ) +
        ' => \'' +
        dest +
        '\'';

      hashesArray.push( hashesArrayEntry );
    } );

    var outputString = '<?php\n$' + options.variable + ' = array(\n  ' +
      hashesArray.join( ',\n  ' ) +
      '\n);\n';

    grunt.verbose.writeln();
    grunt.verbose.writeln( outputString.yellow );
    grunt.verbose.writeln();

    // unique array
    var outputFiles = {};

    this.files.forEach( function( file ){
      outputFiles[ file.dest ] = 1;

      if ( ! options.keep ){
        grunt.log.writeln( 'removing JSON file ( ' + file.src.toString().cyan + ' )' );
        grunt.file[ 'delete' ]( file.src );
      }
    } );

    if ( ! options.keep ){
      grunt.log.warn( 'config JSON(s) removed' );
      grunt.log.writeln();
    }

    Object.keys( outputFiles ).forEach( function( dest ){
      grunt.log.writeln( 'writing output file ( ' + dest.cyan + ' )' );
      grunt.file.write( dest, outputString );
    } );

    grunt.log.oklns( 'output file(s) ready' );
    grunt.log.writeln();

    return true;
  });

};
