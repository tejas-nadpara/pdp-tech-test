$(document).ready(function(){
  $(".bs-devshop__product-subscription").on('click', 'li', function () {
      $(".bs-devshop__product-subscription li.active").removeClass("active");
      // adding classname 'active' to current click li 
      $(this).addClass("active");
      updateProductOptions();
  });
  
  $(".bs-devshop__subscription-cover").on('click change', 'input[type=radio]', function () {
    updateProductOptions();
  });

  $("variant-selects input[type=radio]:checked").trigger("click");
});

function updateProductOptions(){
  var varIndex = $("variant-selects input[type=radio]:checked").parent().index();
  console.log(varIndex);
  setTimeout(function(){ 
    if($("li.bs-devshop__subscription-wrap").hasClass("active")){
      // select subscription month frequancy
      $(".sls-purchase-options-container > .sls-option-container:eq(1) label").trigger("click");
      var sellingPlanID = $(".sls-purchase-options-container > .sls-option-container:eq(1) select option:eq("+ varIndex +")").val();
      $(".sls-purchase-options-container > .sls-option-container:eq(1) select").val(sellingPlanID);
      $(".sls-purchase-options-container [name=selling_plan]").val(sellingPlanID);    
    }else{
      // select one time purchase option
      $(".sls-purchase-options-container > .sls-option-container:eq(0) label").trigger("click");
    }
    updateProductPrice();
  },250);
}

function updateProductPrice(){
  var varIndex = $("variant-selects input[type=radio]:checked").parent().index();
  var dataObj = $("variant-selects input[type=radio]:checked").parent().find(".bs-devshop__oldPrice");
  var proPrice = parseInt(dataObj.attr("data-price"));
  var proCPrice = parseInt(dataObj.attr("data-cprice"));
  
  $("li.bs-devshop__one-time-wrap .bs-devshop__option-right").html(Shopify.formatMoney(proPrice, Shopify.money_format));
  var offPrice = (proPrice * 10) / 100;
  var subPrice = proPrice - offPrice;
  var subHTMLWrap = $("li.bs-devshop__subscription-wrap");
  subHTMLWrap.find(".bs-devshop__subscribe_price").html(Shopify.formatMoney(subPrice, Shopify.money_format));
  subHTMLWrap.find(".bs-devshop__off-price").html(Shopify.formatMoney(offPrice, Shopify.money_format));
  subHTMLWrap.find(".bs-devshop__compare-price").html(Shopify.formatMoney(proCPrice, Shopify.money_format));
  if(varIndex == 0){
    subHTMLWrap.find(".bs-devshop__delivery-frequancy").text("Every 1 month");
  }else if(varIndex == 1){
    subHTMLWrap.find(".bs-devshop__delivery-frequancy").text("Every 3 months");
  }else if(varIndex == 2){
    subHTMLWrap.find(".bs-devshop__delivery-frequancy").text("Every 6 months");
  }
  
}

var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = "${{amount}}";
Shopify.formatMoney = function(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
     return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};