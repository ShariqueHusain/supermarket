
/*Initializes the all components and display it Blocks, Quickshop Wrapper etc.. */

function initializeComponents() {
  var block_id = 1;
  var quickshop_id = 1;

  $.each(productslist.products, function (key, product) {
    var i = 0;
    var starshtml = "";
    var product_template = $("#product-template").html();
    var rendered = "";
    var quickshopDiv = $("#quickshop-template").html();

    //Calculate the stars required for the display
    for (i = 0; i < product.rating; i++)
      starshtml += "<span>&#9733;</span>";

    //add the stars HTML as JSON property to the product and the block id
    $.extend(product, {stars: starshtml, blockid: block_id, quickshop_id: quickshop_id});

    rendered = Mustache.render(product_template, product);
    $(".js-products-list").append(rendered);

    if (block_id % 3 == 1) {
      var quickshop_rendered = "";
      var data = {quickshop_id: quickshop_id++};

      quickshop_rendered = Mustache.render(quickshopDiv, data);
      $(".js-products-list").append(quickshop_rendered);
    }
    block_id++;
  })
}

/*Changes the +/- sign on the click*/
$(document).on("click", ".js-category-div", function () {
  var rightContent = $(".rightcontent");

  if (rightContent.html() === "-")
    rightContent.html("+");
  else
    rightContent.html("-");

});


/**Filters the products based on Product types e.g. Dairy, Fruits, etc...***/
$(document).on("click", ".js-filter-link", function () {
  var filterdiv = $(this);
  var filter_type = filterdiv.data("filter-type");
  var bannerContainerDiv = $(".banner-container");

  //hide all the Quickshop wrappers, if any
  hideAllQuickShopWrappers();

  //If the navitem is selected then remove it on deselecting the type. And hide the respective products.
  if (filterdiv.hasClass("sidenav__navitem--selected")) {
    filterdiv.find(".closeitem").remove();
    filterdiv.removeClass("sidenav__navitem--selected");
    hideProductsByType(filter_type);
  }
  else {
    bannerContainerDiv.removeClass("show");
    bannerContainerDiv.addClass("hide");
    filterdiv.append("<div class='closeitem'>x</div>");
    filterdiv.addClass("sidenav__navitem--selected");
    showProductsByType(filter_type);
  }

  //If none of the Product category is selected then show all the products
  if ($(".sidenav__navitem--selected").length == 0) {
    bannerContainerDiv.removeClass("hide");
    bannerContainerDiv.addClass("show");
    //show all the products
    showAllProducts();
  }

});

/*Hide the products by their Product Type i.e. Bakery, Fruit, Vegetables etc..*/
function hideProductsByType(filter_type) {
  $(".block").each(function () {
    var blockdiv = $(this);
    var product_type = blockdiv.data("product-type");

    //hide the products 
    if (filter_type == product_type) {
      blockdiv.removeClass("show");
      blockdiv.removeClass("js-filtered");
      blockdiv.addClass("hide");
    }

  });
}

/*Show the products by their Product Type i.e. Bakery, Fruit, Vegetables etc..*/
function showProductsByType(filter_type) {
  $(".block").each(function () {
    var blockdiv = $(this);
    var product_type = blockdiv.data("product-type");
    var filtered_product = blockdiv.hasClass("js-filtered");

    //show the recent filtered product and hide the products that are not filtered
    if (filter_type == product_type) {
      blockdiv.removeClass("hide");
      blockdiv.addClass("show");
      blockdiv.addClass("js-filtered");
    }
    else if (!filtered_product) {
      blockdiv.removeClass("show");
      blockdiv.addClass("hide");
    }
  });
}

/**It shows all the products**/
function showAllProducts() {
  $(".block").each(function () {
    $(this).removeClass("hide");
    $(this).addClass("show");
  });
}

/**Sorts the products based on Price**/
$(document).on("change", ".js-sort-list", function () {
  var sort_type = $(this).val();

  if (sort_type == "price-low") {
    var result = $(".block").sort(function (a, b) {
      var contentA = parseFloat($(a).data("price"));
      var contentB = parseFloat($(b).data("price"));
      return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
    });
    $(".js-products-list").html(result);
  }
  if (sort_type == "price-high") {
    var result = $(".block").sort(function (a, b) {
      var contentA = parseFloat($(a).data("price"));
      var contentB = parseFloat($(b).data("price"));
      return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });
    $(".js-products-list").html(result);
  }
  if (sort_type == "rating") {
    var result = $(".block").sort(function (a, b) {
      var contentA = parseInt($(a).data("rating"));
      var contentB = parseInt($(b).data("rating"));
      return (contentA > contentB) ? -1 : (contentA < contentB) ? 1 : 0;
    });
    $(".js-products-list").html(result);
  }
});

//Hides all the quickshop wrappers which are active i.e. show class
function hideAllQuickShopWrappers() {
  var quickshopWrapperDiv = $(".quickshop-wrapper.show");

  quickshopWrapperDiv.each(function () {
    console.log(quickshopWrapperDiv);
    quickshopWrapperDiv.removeClass("show");
    quickshopWrapperDiv.empty();
    quickshopWrapperDiv.addClass("hide");
  });
}


$(document).on("click", ".js-quick-shop-btn", function () {
  var blockDiv = $(this).parent().parent();
  var quickshop_id = blockDiv.data("quickshop-id");
  var product = {};
  var quickshopInnerTemplate = $("#quickshop-inner-template").html();
  var quickshopWrapper = $(".quickshop-wrapper-id-" + quickshop_id);
  var quickshop_rendered = "";

  //prepare the data to display
  var imageUrl = blockDiv.find("img").attr("src");
  var title = blockDiv.find(".block__title").html();
  var description = blockDiv.find(".block__description").html();
  var price = blockDiv.find(".block__price").html();
  var stars = blockDiv.find(".block__ratings").html();

  $.extend(product, {imageUrl: imageUrl, title: title, description: description, price: price, stars: stars});

  quickshop_rendered = Mustache.render(quickshopInnerTemplate, product);

  quickshopWrapper.empty();
  quickshopWrapper.append(quickshop_rendered);
  quickshopWrapper.removeClass("hide");
  quickshopWrapper.addClass("show");

  $("html, body").animate({
    scrollTop: $(quickshopWrapper).offset().top
  }, 600);
});


/**The function to close the Quickshop Wrapper Pop-up Div**/
$(document).on("click", ".js-quickshop-wrapper-close", function () {
  var quickshopWrapperDiv = $(this).parent().parent();
  quickshopWrapperDiv.removeClass("show");
  quickshopWrapperDiv.addClass("hide");
  quickshopWrapperDiv.empty();
});