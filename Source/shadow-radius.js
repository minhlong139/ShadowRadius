/*
---
script: shadow-radius.js

description: ShadowRadius - Mootools plugin to create shadow corners

license: MIT-style license.

authors:
- Bui Minh Long (http://minhlong139.plus.vn/) (minhlong139@gmail.com)

requires:
   core:1.2.3: 
   - Element.Style
   - Utilities.Selectors
   - BorderRadius (if radius>0)
*/

var ShadowRadius = new Class({
  
  Implements: [Options],

  options: {
    img_src: ['shadow0.png', 'shadow-y.png', 'shadow-x.png'],
    radiusTop: 0,
    radiusBottom: 0,
    radius: 0,
    key: 'shadow-radius-UJTYRoeiutewrghdsgguwerSDHFsdhweDgqxcnNVDsdfqweiuwertretsdkfaGSFD'
  },
  
  shadows: ['topRight', 'right', 'bottomRight', 'bottom', 'bottomLeft'],
  
  initialize: function(element, options) {
    this.element = element;
    this.element.borderWidth = parseInt(this.element.getStyle('border-top-width'));
    this.initOptions(options);
    this.build();
    if (this.options.radius>0) this.element.borderRadius({'radius': this.options.radius});
  },
  
  topRightStyles: {
    'position': 'relative',
    'width': 20,
    'height': 20
  },
  rightStyles: {
    'position': 'relative',
    'width': 20
  },
  bottomRightStyles: {
    'position': 'relative',
    'height': 20,
    'width': 20      
  },
  bottomStyles: {
    'position': 'relative',
    'height': 20
  },
  bottomLeftStyles: {
    'position': 'relative',
    'height': 20,
    'width': 20      
  },
  
  setupParentStatic: function(pos) {
    var border = this.element.borderWidth;
    var offsetLeft = this.options.radius==0?this.topRightStyles.width/2:0;
    var dict = 
      {'topRight': function(){
        $extend(this.topRightStyles, {
          'right': (-1)*(this.element.clientWidth-this.options.radiusTop+2*border-offsetLeft),
          'top': (-1)*(this.element.clientHeight+2*border)
        });
      }.bind(this),
      'right': function(){
        $extend(this.rightStyles, {
          'right': (-1)*(this.element.clientWidth-this.options.radiusTop+2*border-offsetLeft),
          'top': (-1)*(this.element.clientHeight+2*border)
        });
      }.bind(this),
      'bottomRight': function() {
        $extend(this.bottomRightStyles, {
          'right': (-1)*(this.element.clientWidth-this.options.radiusTop+2*border-offsetLeft),
          'top': (-1)*(this.element.clientHeight+2*border)
        });
      }.bind(this),
      'bottom': function() {
        $extend(this.bottomStyles, {
          'right': (-1)*(this.bottomRightStyles.width),
          'top': (-1)*(this.element.clientHeight+this.bottomRightStyles.height+2*border)      
        });
      }.bind(this),
      'bottomLeft': function() {
        $extend(this.bottomLeftStyles, {
          'left': 0,
          'top': (-1)*(this.element.clientHeight+this.bottomRightStyles.height+this.bottomLeftStyles.height+2*border)
        });
      }.bind(this)
    };
    dict[pos]();
  },
  
  setupImages: function() {
    $extend(this.topRightStyles, {
      'background-color': 'transparent',
      'background-repeat': 'no-repeat',
      'background-image': 'url('+this.options.img_src[0]+')',
      'background-position': '-20px 0'
    });
    $extend(this.rightStyles, {
      'background-color': 'transparent',
      'background-repeat': 'repeat-y',
      'background-image': 'url('+this.options.img_src[1]+')',
      'background-position': '0 0'
    });
    $extend(this.bottomRightStyles, {
      'background-color': 'transparent',
      'background-repeat': 'no-repeat',
      'background-image': 'url('+this.options.img_src[0]+')',
      'background-position': '-20px -20px'
    });
    $extend(this.bottomStyles, {
      'background-color': 'transparent',
      'background-repeat': 'repeat-x',
      'background-image': 'url('+this.options.img_src[2]+')',
      'background-position': '0 0'
    });
    $extend(this.bottomLeftStyles, {
      'background-color': 'transparent',
      'background-repeat': 'no-repeat',
      'background-image': 'url('+this.options.img_src[0]+')',
      'background-position': '0 -20px'
    });
  },
  
  initOptions: function(options) {
    this.setOptions(options);
    if (this.options.radius) this.setOptions({
      'radiusBottom': this.options.radius,
      'radiusTop':    this.options.radius
    });
  },
  
  build: function() {
    if (this.element.hasClass(this.options.key)) return;
    this.element.addClass(this.options.key);
    
    var lastItem = this.element;
    for(var i=0;i<this.shadows.length;i++) {
      this[this.shadows[i]] = new Element('div', {'class': this.shadows[i]}).inject(lastItem, 'after');
      lastItem = this[this.shadows[i]];
    }  
    for(var i=0;i<this.shadows.length;i++) {
      this.setupParentStatic(this.shadows[i]);
      this[this.shadows[i]].setStyles(this[this.shadows[i]+'Styles']);
    }
    if (this.options.img_src.length==3) {
      this.setupImages();
      var rightHeight = this.element.clientHeight-this.topRightStyles.height-this.bottomRightStyles.height/2+2*this.element.borderWidth;
      var bottomWidth = this.element.clientWidth-this.bottomLeftStyles.width-this.bottomRightStyles.width/2+2*this.element.borderWidth;
      this.right.setStyle('height', rightHeight);
      this.bottom.setStyle('width', bottomWidth);
      this.updateAllStyles();
    }
  },
  
  updateStyle: function(pos) {
    this[pos].setStyles(this[pos+'Styles']);
  },
  
  updateAllStyles: function() {
    for(var i=0;i<this.shadows.length;i++) {
      this[this.shadows[i]].setStyles(this[this.shadows[i]+'Styles']);
    }
  }  
});

Element.implement({
  shadowRadius: function (options) {
    var sr = new ShadowRadius(this, options);
    this.store('sr', sr);
    return sr;
  }
});
