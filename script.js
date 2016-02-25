
function DomObj(){
  var self        =this;
  self.products   = [];
  self.selector   = "#content"

  self.loadAssets = function(){
    return $.when(self.getProducts('data.json'), self.getTemplate())
  }

  self.getProducts = function(url){
    return $.getJSON(url, function(response){
        for(i=0; i<response.sales.length ; i++){
          self.products.push( new productObj(response.sales[i], i)  );
        }
    });
  }

  self.getTemplate = function(){
    return $.get('product-template.html', function(template){
      self.template = template
    });
  }
    
  self.updateProductHtml = function(){
    for( i=0; i< self.products.length ; i++){
      self.products[i].updateHtml(self.template);
    }
  }

  self.addEventListeners = function() {
    $(self.selector).delegate('.close', 'click', self.onCloseClick)
  }

  self.onCloseClick = function(event){
    var container = $(event.target).closest('.product-container')
    container.on('transitionend', function(){
      container.addClass('hide')
    })
    container.addClass('fade');

  }
  
  self.updateDom = function(){
    var i=0
    thishtml='<div class="container-fluid">';
    for( i=0; i< self.products.length ; i++){
      if (i % 3 == 0 ){  thishtml += "<div class='row'>" }
      thishtml += self.products[i].htmlView;
      if ((i % 3 == 2) || i == (self.products.length-1) ){thishtml += "</div>"}
    }
    thishtml += '</div>'

    $(self.selector).html(thishtml)
    self.addEventListeners()
  }
  
}

function productObj(product, i){
  var self          = this;
  self.photo        = product.photos.medium_half
  self.title        = product.name
  self.tagline      = product.tagline
  self.url          = product.url
  self.preloadImage = (new Image()).src = self.photo
  self.description   = product.description
  self.htmlview     = ""
  self.index        = i
  self.custom_class = "col"+ ((i % 3) +1)
  
  self.updateHtml= function(template){
    self.htmlView = template.
                      replace('{image}', self.photo).
                      replace('{title}', self.title).
                      replace('{tagline}', self.tagline).
                      replace('{url}', self.url).
                      replace('{description}', self.description).
                      replace('{custom_class}', self.custom_class);
  }
}


var page = new DomObj();

// The earlier approach using timeouts was buggy. Promises are much more reliable.
page.loadAssets().done(function(){
  page.updateProductHtml()
  
  // I am trying to preload some images, so the page initially has images. I am waiting 200ms to get at least the first few back. 
  // Waiting any longer would be undesirable.
  setTimeout(function(){
    page.updateDom();
  }, 200);
})



