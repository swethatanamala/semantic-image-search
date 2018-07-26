function convertToGalleryList(images){
  var galleryList = []
  for (var i = 0; i < images.length; i++) {
    var db_img = images[i]
    var imgData = {
      srct: db_img.url,
      kind: 'image',
      title: "" + db_img['id']}

    if (db_img.large_url){
      imgData.src = db_img.large_url
    }
    else{
      imgData.src = db_img.url
    }

    if (db_img.msVisionTags){
      imgData.imgtHeight = db_img.msVisionTags.metadata.height
      imgData.imgtWidth = db_img.msVisionTags.metadata.width

      try{
        var caption = db_img.msVisionTags.description.captions[0].text
        imgData.description = caption[0].toUpperCase() + caption.substring(1) + '.'
      }
      catch (err){
        
      }
    }
    galleryList.push(imgData)
  }

  return galleryList
}

function createNanoGallery(images){
  $("#nanogallery2").nanogallery2({
    <!-- ### gallery settings ### -->
    "itemsBaseURL": '',
    "thumbnailWidth": "auto",
    "thumbnailHeight": "400",
    "thumbnailBorderVertical": 0,
    "thumbnailBorderHorizontal": 0,
    "galleryDisplayMode": "moreButton",
    "galleryDisplayMoreStep": 4,
    "thumbnailAlignment": "center",
    "thumbnailHoverEffect2": "imageScaleIn80|labelAppear75",

    <!-- ### gallery content ### -->
    'items': convertToGalleryList(images)
  });
}

function createFuse(images){
    var fuse_search_keys = [
    {name: 'msVisionTags.tags.name', weight: 0.3},
    {name: 'msVisionTags.description.captions.text', weight: 0.4},
    {name: 'msVisionTags.color.dominantColors', weight: 0.3}
    ]

    var fuse_options = {
      shouldSort: true,
      threshold: 0.01,
      location: 0,
      tokenize: true,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: fuse_search_keys
    }
    return new Fuse(images, fuse_options)
}

function updateNanoGallery(new_images){
  $("#nanogallery2").nanogallery2('destroy')
  createNanoGallery(new_images)
}

function getSearchInput(){
  return $.trim($("#search-box").val())
}

$(document).ready(function () {
  // query DB
  $.getJSON("db.json", function(data) {
    all_images = data.images
    createNanoGallery(all_images)
    fuse = createFuse(all_images)
  }); 

  var oldSearchValue = getSearchInput()

  $("#search-box").bind('input', function(e) {
    var searchValue = getSearchInput()
    if (searchValue != oldSearchValue){
      if (searchValue == ""){
        updateNanoGallery(all_images)
      }
      else {
        var results = fuse.search(searchValue)
        updateNanoGallery(results)
      }
      oldSearchValue = searchValue
    }

  });
});
