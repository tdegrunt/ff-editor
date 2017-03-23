var $ = require('tinyselector');
var context = require('../../context.js');
var Items = context.Items;

module.exports = new Items()
.add({
  text: '<i class="fa fa-font"></i>',
  tooltip: '문단',
  fn: function(e) {
    var placeholder = $(this.owner().dom()).attr('placeholder');
    this.owner().insert(new context.Paragraph().placeholder(placeholder));
  }
})
.add({
  text: '<i class="fa fa-picture-o"></i>',
  tooltip: '이미지 파일',
  fn: function(e) {
    var part = this.owner();
    part.context().selectFiles(function(err, files) {
      if( err ) return context.error(err);
      if( !files.length ) return;
      
      if( files.length === 1 ) {
        part.insert(new context.Image(files[0]));
      } else {
        var row = new context.Row();
        files.forEach(function(file) {
          row.add(new context.Image(file));
        });
        part.insert(row);
      }
    });
  }
})
.add({
  text: '<i class="fa fa-instagram"></i>',
  tooltip: '이미지',
  fn: function(e) {
    var part = this.owner();
    
    context.prompt('Please enter the image URL.', function(src) {
      if( !src ) return;
      
      if( ~src.indexOf('instagram.com') ) {
        var vid = src.split('//')[1];
        vid = vid && vid.split('/p/')[1];
        vid = vid && vid.split('/')[0];
        
        if( vid ) src = 'https://www.instagram.com/p/' + vid + '/media';
      }
      
      part.insert(new context.Image(src));
    });
  }
})
.add({
  text: '<i class="fa fa-youtube-square"></i>',
  tooltip: '동영상',
  fn: function(e) {
    var part = this.owner();
    
    context.prompt('Please enter the video URL', function(src) {
      if( !src ) return;
      
      if( ~src.indexOf('youtube.com') ) {
        var vid = src.split('v=')[1];
        vid = vid && vid.split('&')[0];
        vid = vid && vid.split('#')[0];
        
        if( !vid ) return context.error('URL을 정확히 입력해주세요');
        src = 'https://www.youtube.com/embed/' + vid;
      } else if( ~src.indexOf('vimeo.com') ) {
        var vid = src.split('//')[1];
        vid = vid && vid.split('/')[1];
        vid = vid && vid.split('?')[0];
        vid = vid && vid.split('&')[0];
        vid = vid && vid.split('#')[0];
        
        if( !vid ) return context.error('URL을 정확히 입력해주세요');
        src = 'https://player.vimeo.com/video/' + vid;
      }
      
      part.insert(new context.Video(src));
    });
  }
})
.add({
  text: '<i class="fa fa-arrows-h"></i>',
  tooltip: '구분선',
  fn: function(e) {
    this.owner().insert(new context.Separator());
  }
})
.add({
  text: '<i class="fa fa-paperclip"></i>',
  tooltip: '첨부파일',
  fn: function(e) {
    var part = this.owner();
    part.context().selectFile(function(err, file) {
      if( err ) return context.error(err);
      
      part.insert(new context.File(file));
    });
  }
});