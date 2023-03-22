
// scroll To Top button ------------------------------------------------
const scrollToTopButton = document.querySelector("#scrollToTop a");

function scrollToTop() {
   if (window.scrollY < window.innerHeight) {
      scrollToTopButton.classList.replace("show", "hide");
   }else{
      scrollToTopButton.classList.replace("hide", "show")
   }
}
onscroll = scrollToTop;


// -------------------------------------- Start best coffee section slider --------------------------------------
var bestCoffeeImgs = document.querySelectorAll(".best-coffee-imgs img");
var bestCoffeeDots = document.querySelectorAll(".best-coffee-dots li");

var bestContent = document.querySelector(".best-coffee .best-content");
let activeIndex = 0;

function updateClasses() {
   bestCoffeeDots.forEach((item) => item.classList.remove("active"));
   bestCoffeeImgs.forEach((item) => {
      item.style.visibility = "hidden";
      item.style.opacity = 0;
   });
   bestCoffeeDots[activeIndex].classList.add("active");

   bestCoffeeImgs[activeIndex].style.visibility = "visible";
   bestCoffeeImgs[activeIndex].style.opacity = 1;
}

function changeIndex() {
   activeIndex = activeIndex < bestCoffeeImgs.length - 1 ? activeIndex + 1 : 0;
   updateClasses();
}

bestCoffeeDots.forEach((element) => {
   element.addEventListener("click", (e) => {
      activeIndex = +e.target.getAttribute("order") - 1;
      updateClasses();
   });
});

var bestSlider = setInterval(changeIndex, 4000);

bestContent.addEventListener("mouseover", function () {
   clearInterval(bestSlider);
});
bestContent.addEventListener("mouseout", function () {
   bestSlider = setInterval(changeIndex, 6000);
});
// -------------------------------------- End best coffee section slider --------------------------------------

productsLink = "json/productsData.json";
menuLink = "json/menuData.json";

// get data function -------------------------------------
function getData(link) {
   var xhttp = new XMLHttpRequest();
   var data;
   xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
         data = JSON.parse(this.responseText);
      }
   };
   xhttp.open("GET", link, false);
   xhttp.send();
   return data;
}

// products data
var productsData = getData(productsLink);

// menu data
var menuData = getData(menuLink);

// ------------------------------------- show products -------------------------------------
var ourShopSection = document.querySelector(".our-shop .products");

function showProducts(data) {
   ourShopSection.innerHTML = "";
   data &&
      data.forEach((e) => {
      ourShopSection.innerHTML += `
      <div class="col">
         <div class="card h-100" product-type="Hot Coffee">
            <a href="#" class="overflow-hidden position-relative rounded-top">
               <img src="${e.imgSrc}" class="card-img-top w-100" alt="${ e.name }">
            </a>
            <span class="sale-badge"> Sale </span>
            <div class="position-relative">
               <div class="card-icons d-flex gap-3 justify-content-center w-100 position-absolute mx-auto">
                  <p class="addToCartbtn shadow" data-id="${ e.id }"
                  data-bs-toggle="tooltip" title="Add to Shopping Cart"
                  onClick="addToCartF(${e.id})">
                     <i class="fa fa-shopping-basket" ></i>
                  </p>
                  <p class="addToFavorite shadow" data-bs-toggle="tooltip" title="Add to Wash List"
                  onclick="addToFavorite(${e.id})">
                     <i class="fa fa-heart" ></i> </p>
                  <p class="shadow" data-bs-toggle="tooltip" title="Show Details">
                     <i class="fa fa-eye" ></i> </p>
               </div>
            </div>
            <div class="card-body">
               <h5 class="card-title">${e.name}</h5>
               <p class="card-text">${e.description}</p>
               <p class="text-warning">
                  <i class="fa-solid fa fa-star"></i>
                  <i class="fa-solid fa fa-star"></i>
                  <i class="fa-solid fa fa-star"></i>
                  <i class="fa-solid fa-star-half-stroke"></i>
                  <i class="fa-regular fa-star"></i>
               </p>
               <h4 class="d-flex justify-content-between">
               ${
                  e.decount ?
                  `<span class="text-decoration-line-through">$${e.price}</span>
                  <span class="text-info"> $${e.newPrice} </span>`
                  : `$${e.price}`
               }
               </h4>
            </div>

            <button class="addToCartbtn btn btn-info text-light m-3 mt-0" data-id="${ e.id }"
            onClick="addToCartF(${e.id})">
               <i class="fa fa-shopping-basket me-2"></i>
               Add to Cart
            </button>
         </div>
      </div>`;
   });
}
showProducts(productsData);

// ------------------------------------- filter products -------------------------------------
var productTypesItem = document.querySelectorAll(".product-types li");

productTypesItem.forEach((item) =>
   item.addEventListener("click", function (e) {
      productTypesItem.forEach((remove) => remove.classList.remove("active"));
      e.target.classList.add("active");

      if (e.target.type != /All/i) {
         var filteredData = productsData.filter((f) =>
         f.type.toLowerCase().includes(e.target.type.toLowerCase())
         );
         showProducts(filteredData);
      } else {
         showProducts(productsData);
      }
   })
);

// ------------------------------------- show menu -------------------------------------
var ourMenuSection = document.querySelector(".our-menu .row");
ourMenuSection.innerHTML = "";
menuData &&
   menuData.forEach((e) => {
      ourMenuSection.innerHTML += `<div class="col">
      <div class="menu-item card flex-row gap-3 p-3 align-items-center shadow">
         <div> <img src="${e.imgSrc}" alt="${e.name}" width="70"> </div>
         <div class="menu-info  flex-grow-1">
            <h5>${e.name}</h5>
            <small class="m-0">${e.description}</small>
         </div>
         <div class="menu-price">
            <h5 class="m-0">$<span>${e.price}</span></h5>
         </div>
      </div>
   </div>`;
   });

// --------------------------------Start add item to shopping cart -------------------------------------
var shoppingCart = [];

var totalCartItems = 0;
var subTotalPrice = 0;
var addToCartbtn = document.querySelectorAll(".addToCartbtn");
var cartProducts = document.querySelector("#cartProducts");

var cartBadge = document.querySelector(".navbar .cart-badge");
var itemCount = document.querySelector(".offcanvas-cart .item-count");
var totalMoney = document.querySelector(".offcanvas-cart .total-money");

var clearCart = document.querySelector(".clearCart");

var emptyCartImg = document.querySelector(".empty-cart");

var emptyCartDiv = `
<div class="empty-cart h-100 d-flex align-items-center">
   <img src="images/empty-cart.png" alt="empty cart" width="100%">
</div>`;

// assign items count into site ----------
function totalMoneyF() {
   subTotalPrice = 0;
   shoppingCart.forEach(function (e) {
      subTotalPrice += e.decount ? e.newPrice * e.quantity : e.price * e.quantity;
   });
   totalMoney.innerHTML = subTotalPrice.toFixed(2);
}

// assign items count into site ----------
function totalCartItemsF() {
   totalCartItems = 0;
   shoppingCart.forEach(function (e) {
      totalCartItems += e.quantity;
   });
   itemCount.innerHTML = totalCartItems;
   cartBadge.innerHTML = totalCartItems;
}

function addToCartF(id) {
   productIndex = productsData.findIndex((i) => i.id === id);

   if (
      shoppingCart.length > 0 &&
      shoppingCart.find((e) => e.id === id) != undefined
   ) {
      shoppingCart[shoppingCart.findIndex((i) => i.id === id)].quantity += 1;
      renderCartItems();
      totalCartItemsF();
      totalMoneyF();
   } else {
      shoppingCart.push({ ...productsData[productIndex], quantity: 1 });
      renderCartItems();
      totalCartItemsF();
      totalMoneyF();
   }
}

// render Cart Items
function renderCartItems() {
   cartProducts.innerHTML = "";
   shoppingCart.forEach((e) => {
      cartProducts.innerHTML += `
      <div class="product-item d-flex align-items-center gap-2 position-relative mb-4">
         <div class="remove-item position-absolute top-0 start-0">
            <button class="btn btn-sm btn-primary text-white" data-id="${ e.id }" type="button" title="Remove"
            onclick="removeItemFromCart(${e.id})">
               <i class="fa-solid fa-trash-can"></i>
            </button>
         </div>
         <div> <img src="${e.imgSrc}" alt="${e.name}" width="90"> </div>
         <div class="flex-grow-1">
            <h5>${e.name}</h5>
            <span>${e.description}</span>
            <div class="d-flex justify-content-between">
               <h5 class="d-flex w-100">
                  <span class="old-price ${ e.decount && `text-decoration-line-through` } ">
                     $${e.price}
                  </span>
                  <span class="new-price flex-grow-1 text-center text-info ">
                     ${e.decount ? `$${e.newPrice}` : ""}
                  </span>
               </h5>
               <div>
                  <div class="btn-group mb-0">
                     <button class="btn btn-sm btn-info text-white h-50" type="button" title="Increase 1"
                     onClick="decrement(${e.id})" data-id="${e.id}">
                        <i class="fa-solid fa-minus "></i>
                     </button>
                     <h4 class="item-quantity px-3" data-product-id="${e.id}">${e.quantity}</h4>
                     <button class="btn btn-sm btn-info text-white h-50" type="button" title="Decrease 1"
                     onClick="increment(${e.id})" data-id="${e.id}">
                        <i class="fa-solid fa-plus"></i>
                     </button>
                  </div>
               </div>
            </div>
            <hr class="m-1">
         </div>
      </div>`;
   });
}

// increment/decrement quantity of items in shopping cart---------------
function increment(id) {
   shoppingCart[shoppingCart.findIndex((i) => i.id === id)].quantity += 1;
   renderCartItems();
   totalCartItemsF();
   totalMoneyF();
}

function decrement(id) {
   shoppingCart[shoppingCart.findIndex((i) => i.id === id)].quantity > 1
      ? (shoppingCart[shoppingCart.findIndex((i) => i.id === id)].quantity -= 1)
      : 1;
   renderCartItems();
   totalCartItemsF();
   totalMoneyF();
}

//  removeItemFromCart
function removeItemFromCart(id) {
   shoppingCart.splice(
      shoppingCart.findIndex((i) => i.id === id),
      1
   );
   renderCartItems();
   totalCartItemsF();
   totalMoneyF();
   shoppingCart.length == 0 && (cartProducts.innerHTML = emptyCartDiv);
}

clearCart.addEventListener("click", function () {
   shoppingCart = [];
   renderCartItems();
   totalCartItemsF();
   totalMoneyF();
   cartProducts.innerHTML = emptyCartDiv;
});

// -------------------------------- End add item to shopping cart -------------------------------------

// --------------------------------Start add item to Favorite cart -------------------------------------

var favoriteCart = [];
var totalFavoriteItems = 0;

var addToFavoritebtn = document.querySelectorAll(".addToFavorite");
var favoriteProducts = document.querySelector("#favoriteProducts");

var favoriteBadge = document.querySelector(".navbar .favorite-badge");
var itemCountFavorite = document.querySelector(".offcanvas-favorite .item-count");

var clearFavorite = document.querySelector(".clear-favorite");

var emptyFavoriteDiv = `
<div class="empty-favorite h-100 d-flex align-items-center">
   <img src="images/empty-wishlist.svg" alt="empty-wishlist" width="100%">
</div>`;

function renderFavoriteCart() {
   favoriteProducts.innerHTML = "";
   favoriteCart.map( (e) =>
      (favoriteProducts.innerHTML += `<div class="product-item d-flex align-items-center gap-2 position-relative mb-4">
         <div class="remove-item position-absolute top-0 start-0">
            <button class="btn btn-sm btn-primary text-white" type="button" title="Remove"
            onclick="removeFavoriteItem(${e.id})">
               <i class="fa-solid fa-trash-can"></i>
            </button>
         </div>
         <div>
            <img src="${e.imgSrc}" alt="${e.name}" width="90">
         </div>
         <div class="flex-grow-1">
            <h5>${e.name}</h5>
            <span>${e.description}</span>
            <div class="d-flex justify-content-between">
               <h5 class="d-flex w-100">
                  <span class="old-price ${e.decount && "text-decoration-line-through" }">$${e.price}</span>
                  <span class="new-price flex-grow-1 text-center text-info ">${ e.decount ? `$${e.newPrice}` : "" } </span>
               </h5>
               <div>
                  <div>
                     <button class="btn btn-info text-white" type="button" title="Add To Cart"
                     onclick="addToCartF(${e.id})">
                        <i class="fa fa-shopping-basket" aria-hidden="true"></i>
                     </button>
                  </div>
               </div>
            </div>
            <hr class="m-1">
         </div>
      </div>`)
   );
}

function addToFavorite(id) {
   if (favoriteCart.find((e) => e.id === id) != undefined) {
      alert("This item aready added to favorite list");
   } else {
      favoriteCart.push(productsData[productsData.findIndex((e) => e.id === id)]);
      renderFavoriteCart();
      favoriteBadge.innerHTML = favoriteCart.length;
      itemCountFavorite.innerHTML = favoriteCart.length;
   }
}

function removeFavoriteItem(id) {
   favoriteCart.splice( favoriteCart.findIndex((i) => i.id === id), 1 );
   renderFavoriteCart();
   favoriteBadge.innerHTML = favoriteCart.length;
   itemCountFavorite.innerHTML = favoriteCart.length;

   favoriteCart.length == 0 && (favoriteProducts.innerHTML = emptyFavoriteDiv);
}

function clearFavoriteF() {
   favoriteCart = [];
   renderFavoriteCart();
   favoriteBadge.innerHTML = favoriteCart.length;
   itemCountFavorite.innerHTML = favoriteCart.length;

   favoriteProducts.innerHTML = emptyFavoriteDiv;
}
clearFavorite.addEventListener("click", clearFavoriteF);
// -------------------------------- end add item to Favorite cart -------------------------------------
// to tooltip work ------------------------------------------------
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipTriggerListBs = document.querySelectorAll('[data-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList, ...tooltipTriggerListBs].map((El) => new bootstrap.Tooltip(El));
