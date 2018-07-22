function convertToGalleryList(images){
  var galleryList = []
  for (var i = 0; i < images.length; i++) {
    galleryList.push({
      src: images[i].large_url,
      srct: images[i].url})
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
      'msVisionTags.tags.name',
      'msVisionTags.description.tags',
      'msVisionTags.captions.text',
      'msVisionTags.color.dominantColors',
      'url'
    ]

    var fuse_options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      includeScore: true,
      keys: fuse_search_keys
    }
    return new Fuse(all_images, fuse_options)
}

function updateNanoGallery(new_images){
  $("#nanogallery2").nanogallery2('destroy')
  createNanoGallery(new_images)
}

$(document).ready(function () {
  // query DB
  $.getJSON("db.json", function(data) {

    all_images = data.images
    createNanoGallery(all_images)
    fuse = createFuse(all_images)
  }); 
});
