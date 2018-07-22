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
  jQuery("#nanogallery2").nanogallery2( {
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
    items: convertToGalleryList(images)
  });
}

jQuery(document).ready(function () {
  // query DB
  $.getJSON("db.json", function(data) {
    var options = {
      shouldSort: true,
      threshold: 0.6,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["site", "copyright"]
    }
    all_images = data.images
    fuse = new Fuse(all_images, options)

    createNanoGallery(all_images)
  });
  
});