

//declaring variables
let mainSection = document.querySelector("#mainMeals");
const limit = 20;
const nameInput = document.querySelector("#nameInput");
const nameErr = document.querySelector("#nameAlert");
const emailInput = document.querySelector("#emailInput");
const mailErr = document.querySelector("#emailAlert");
const phoneInput = document.querySelector("#phoneInput");
const phoneErr = document.querySelector("#phoneAlert");
const ageInput = document.querySelector("#ageInput");
const ageErr = document.querySelector("#ageAlert");
const passwordInput = document.querySelector("#passwordInput");
const passwordErr = document.querySelector("#passwordAlert");
const repasswordInput = document.querySelector("#repasswordInput");
const repasswordErr = document.querySelector("#repasswordAlert");
const submitBtn = document.querySelector("#submitBtn");
const letterSearch = document.querySelector("#letterSearch");
const nameSearch = document.querySelector("#nameSearch");
let letterResult;
let tagsArray;


//home meals function called when document is ready and in search
async function GetHomeMeals(name) {
  const apiData = await fetch(
    `https://themealdb.com/api/json/v1/1/search.php?s=${name?name:""}`
  );
  const response = await apiData.json();
  let homeMealsList = ``;
  //name is the search parameter
  if (name) {
    //Avoiding search issues by making the blured input empty
    $("#letterSearch").on('blur', function(){
      letterSearch.value ='';
    })
    $("#nameSearch").on('blur', function(){
      nameSearch.value ='';
    })
    
    let searchResult;
    // check on name.length 
    if(name.length>1){
      try{
        searchResult = response.meals.filter(meal => meal.strMeal.includes(name));
      }catch{
        mainSection.innerHTML = `<div class="alert alert-danger fw-bold text-center text-black p-5 my-5 w-75 mx-auto">No meals found!</div>`
        $(".fa-spinner").fadeOut(100, function () {
          $(".inner-loading-screen").fadeOut(100, function(){
        $("#mainMeals").fadeIn(50);
          });
        });
        return;
      }
        for (let i = 0; i < searchResult.length && i<limit +1; i++) {
          homeMealsList += `
            <div class="col-md-3">
              <div class="position-relative nameOfMeal" id="mealDetails">
                <img src="${searchResult[i].strMealThumb}" alt="meal img" id="mainImage" class="w-100 rounded rounded-2"/>
                <div class="position-absolute d-flex align-items-center align-content-center w-100 bottom-0 mealNameHov rounded rounded-2">
                  <p class="mb-0 fs-2 text-black ms-2 fw-semibold">${searchResult[i].strMeal}</p>
                </div>
              </div>
            </div>`
        };
      //handling search by one letter
    }else{
        searchResult = response.meals.filter(meal => meal.strMeal.charAt(0) == name.toUpperCase());
        if(searchResult.length==0){
          mainSection.innerHTML = `<div class="alert alert-danger fw-bold text-center text-black p-5 my-5 w-75 mx-auto">No meals found!</div>`
          $(".fa-spinner").fadeOut(100, function () {
            $(".inner-loading-screen").fadeOut(100, function(){
          $("#mainMeals").fadeIn(50);
            });
          });
          return;
        }
        for (let i = 0; i < searchResult.length && i<limit +1 ; i++) {
          homeMealsList += `
            <div class="col-md-3">
              <div class="position-relative nameOfMeal" id="mealDetails">
                <img src="${searchResult[i].strMealThumb}" alt="meal img" id="mainImage" class="w-100 rounded rounded-2"/>
                <div class="position-absolute d-flex align-items-center align-content-center w-100 bottom-0 mealNameHov rounded rounded-2">
                  <p class="mb-0 fs-2 text-black ms-2 fw-semibold">${searchResult[i].strMeal}</p>
                </div>
              </div>
            </div>`
        };
    }
  mainSection.innerHTML = homeMealsList;
  //the default logic to get meals after the document is ready
  }else{
    for (let i = 0; i < response.meals.length; i++) {
      homeMealsList += `
        <div class="col-md-3">
          <div class="position-relative nameOfMeal" id="mealDetails">
            <img src="${response.meals[i].strMealThumb}" alt="meal img" id="mainImage" class="w-100 rounded rounded-2"/>
            <div class="position-absolute d-flex align-items-center align-content-center w-100 bottom-0 mealNameHov rounded rounded-2">
              <p class="mb-0 fs-2 text-black ms-2 fw-semibold">${response.meals[i].strMeal}</p>
            </div>
          </div>
        </div>`;
    };
  };
  mainSection.innerHTML = homeMealsList;
  $("#mainMeals").fadeIn(50)
  $(document).ready(function () {
    $(".side-nav-menu").fadeIn(300);
    $(".side-nav-menu").removeClass("d-block").addClass("d-flex");
    $(".fa-spinner").fadeOut(100, function () {
      $(".inner-loading-screen").fadeOut(100);
    });
    $(".mealNameHov").on("click", function () {
      $("#mainMeals").fadeOut(50, function () {
        $("#searchContainer").fadeOut(50);
        $(".fa-spinner").show(100);
        $(".inner-loading-screen").show(100);
      });
      const mealId =
        response.meals[$(this).closest(".col-md-3").index()].idMeal;
      getMealDetails(mealId);
    });
  });
};
GetHomeMeals();

//function to get meal details contains a terinary operator to check for the presence of ingredients 
//if there is an ingredient it will display a <li>
async function getMealDetails(mealId) {
  const apiData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );
  const response = await apiData.json();
  if (response) {
    $(".fa-spinner").fadeOut(100, function () {
      $(".side-nav-menu").fadeIn(500);
      $(".side-nav-menu").removeClass("d-none").addClass("d-flex");
      $(".inner-loading-screen").fadeOut(100, function(){
        $("#mainMeals").fadeIn(50);
      })
    });
    const info = response.meals[0];
    if(info.strTags){
       tagsArray = info.strTags.split(",")
    }
    mainSection.innerHTML = `
  <div class="min-vh-100 position-relative">
    <div class="container">
        <div class="row py-5 g-4 " id="rowData">
  <div class="col-md-4">
            <img class="w-100 rounded-3" src="${info.strMealThumb}" alt="">
                <h2>${info.strMeal}</h2>
        </div>
        <div class="col-md-8">
            <h2>Instructions</h2>
            <p>${info.strInstructions}</p>
            <h3><span class="fw-bolder">Area : </span>${info.strArea}</h3>
            <h3><span class="fw-bolder">Category : </span>${info.strCategory}</h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            <li class='alert alert-info m-2 p-1'>${info.strMeasure1} ${info.strIngredient1}</li>
            <li class='alert alert-info m-2 p-1'>${info.strMeasure2} ${info.strIngredient2}</li>
            <li class='alert alert-info m-2 p-1'>${info.strMeasure3} ${info.strIngredient3}</li>
            <li class='alert alert-info m-2 p-1'>${info.strMeasure4} ${info.strIngredient4}</li>
            ${info.strIngredient5
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure5} ${info.strIngredient5}</li>`
                : ""}
            ${info.strIngredient6
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure6} ${info.strIngredient6}</li>`
                : ""}
            ${
              info.strIngredient7
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure7} ${info.strIngredient7}</li>`
                : ""}
            ${
              info.strIngredient8
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure8} ${info.strIngredient8}</li>`
                : ""}
            ${info.strIngredient9
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure9} ${info.strIngredient9}</li>`
                : ""}
            ${info.strIngredient10
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure10} ${info.strIngredient10}</li>`
                : ""}
            ${info.strIngredient11
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure11} ${info.strIngredient11}</li>`
                : ""}
            ${info.strIngredient12
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure12} ${info.strIngredient12}</li>`
                : ""}
            ${info.strIngredient13
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure13} ${info.strIngredient13}</li>`
                : ""}
            ${info.strIngredient14
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure14} ${info.strIngredient14}</li>`
                : ""}
            ${info.strIngredient15
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure15} ${info.strIngredient15}</li>`
                : ""}
            ${info.strIngredient16
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure16} ${info.strIngredient16}</li>`
                : ""}
            ${info.strIngredient17
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure17} ${info.strIngredient17}</li>`
                : ""}
            ${info.strIngredient18
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure18} ${info.strIngredient18}</li>`
                : ""}
            ${info.strIngredient19
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure19} ${info.strIngredient19}</li>`
                : ""}
            ${info.strIngredient20
                ? `<li class='alert alert-info m-2 p-1'>${info.strMeasure20} ${info.strIngredient20}</li>`
                : ""}
            </ul>
            <h3>Tags :</h3>
            ${info.strTags == null? '': `
            <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${tagsArray[0]
              ? `<li class='alert alert-danger m-2 p-1'>${tagsArray[0]}</li>`
              : ""}
              ${tagsArray[1]
                ? `<li class='alert alert-danger m-2 p-1'>${tagsArray[1]}</li>`
                : ""}
                ${tagsArray[2]
                  ? `<li class='alert alert-danger m-2 p-1'>${tagsArray[2]}</li>`
                  : ""}
                  ${tagsArray[3]
                    ? `<li class='alert alert-danger m-2 p-1'>${tagsArray[3]}</li>`
                    : ""}
                    ${tagsArray[4]
                      ? `<li class='alert alert-danger m-2 p-1'>${tagsArray[4]}</li>`
                      : ""}
                      ${tagsArray[5]
                        ? `<li class='alert alert-danger m-2 p-1'>${tagsArray[5]}</li>`
                        : ""}
            </ul>`}
            <a target="_blank" href="${
              info.strSource
            }" class="btn btn-success">Source</a>
            <a target="_blank" href="${
              info.strYoutube
            }" class="btn btn-danger">Youtube</a>
        </div></div>
    </div>
  </div>`;
  }
};

// function to animate side nav elements
function openSideNav() {
    $(".side-nav-menu").animate({left: 0},600);
    $("#openNav").hide(50, function(){
    $("#closeNav").show(50);
    $("ul #search").animate({top:0},400);
      $("ul #categories").animate({top:0},500);
        $("ul #area").animate({top:0},600);
          $("ul #ingredients").animate({top:0},700);
            $("ul #contact").animate({top:0},800);
    });
};

$("#openNav").on("click",function(){
  openSideNav();
})


function closeSideNav() {
    $(".side-nav-menu").animate({left: `-${$(".nav-tab").innerWidth()}`},600);
    $("#closeNav").hide(50, function(){
    $("#openNav").show(50);
    $("ul li").animate({top:300},400)
    });
}

$("#closeNav").on("click",function(){
  closeSideNav();
})



function showSearchSection(){
  $("#mainMeals").fadeOut(50,function(){
    $("#contactForm").fadeOut(50, function(){
      $("#searchContainer").fadeIn(50);
    });
  })
}

$("#search").on("click", function(){
  closeSideNav();
  showSearchSection()
});


//function that calls the search function
$("#nameSearch, #letterSearch").on("keyup", function(e){
  $(".fa-spinner").fadeIn(100);
  $(".inner-loading-screen").fadeIn(100);
  $("#mainMeals").fadeOut(50);
  GetHomeMeals(e.target.value);
});


//function to open categories section and call the category api
$("#categories").on("click", function(){
  closeSideNav();
  GetSideMeals("c");
  $("#mainMeals").fadeOut(50);
  $("#searchContainer").fadeOut(50, function(){
    $("#contactForm").fadeOut(50, function(){
      $(".fa-spinner").fadeIn(50);
  $(".inner-loading-screen").fadeIn(50);
    });
  });
});


//function to open area section and call the area api

$("#area").on("click", function(){
  closeSideNav();
  GetSideMeals("a");
  $("#mainMeals").fadeOut(50)
  $("#searchContainer").fadeOut(50, function(){
    $("#contactForm").fadeOut(50, function(){
      $(".fa-spinner").fadeIn(50);
  $(".inner-loading-screen").fadeIn(50);
    });
  });
});


//function to open ingredients section and call the ingredients api
$("#ingredients").on("click", function(){
  closeSideNav();
  GetSideMeals("i");
  $("#mainMeals").fadeOut(50, function(){
    $("#searchContainer").fadeOut(50, function(){
      $("#contactForm").fadeOut(50, function(){
        $(".fa-spinner").fadeIn(50);
    $(".inner-loading-screen").fadeIn(50);
      });
    });
  })
});


//function to open contact section
$("#contact").on("click", function(){
  closeSideNav();
  $("#mainMeals").fadeOut(50)
  $("#searchContainer").fadeOut(50, function(){
    $("#contactForm").fadeIn(50);
  });
});

//inputs validation functions
function nameValidation(){
  var regex = /^[a-zA-Z]{1,}$/
  if(regex.test(nameInput.value)){
    nameInput.classList.add("is-valid");
    nameInput.classList.remove("is-invalid");
    nameErr.classList.replace("d-block", "d-none");
    return true;
  }else{
    nameInput.classList.add("is-invalid");
    nameInput.classList.remove("is-valid");
    nameErr.classList.replace("d-none", "d-block");
    return false;
  };
};


function mailValidation(){
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(regex.test(emailInput.value)){
    emailInput.classList.add("is-valid");
    emailInput.classList.remove("is-invalid");
    mailErr.classList.replace("d-block", "d-none");
    return true;
  }else{
    emailInput.classList.add("is-invalid");
    emailInput.classList.remove("is-valid");
    mailErr.classList.replace("d-none", "d-block");
    return false;
  };
};

function phoneValidation(){
  const regex = /^01[0125]\d{8}$/;
  if(regex.test(phoneInput.value)){
    phoneInput.classList.add("is-valid");
    phoneInput.classList.remove("is-invalid");
    phoneErr.classList.replace("d-block", "d-none");
    return true;
  }else{
    phoneInput.classList.add("is-invalid");
    phoneInput.classList.remove("is-valid");
    phoneErr.classList.replace("d-none", "d-block");
    return false;
  };
};


function ageValidation(){
  const regex = /^[1-9][0-9]|[1-9]$/;
  if(regex.test(ageInput.value)){
    ageInput.classList.add("is-valid");
    ageInput.classList.remove("is-invalid");
    ageErr.classList.replace("d-block", "d-none");
    return true;
  }else{
    ageInput.classList.add("is-invalid");
    ageInput.classList.remove("is-valid");
    ageErr.classList.replace("d-none", "d-block");
    return false;
  };
};

function passwordValidation(){
   const regex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  if(regex.test(passwordInput.value)){
    passwordInput.classList.add("is-valid");
    passwordInput.classList.remove("is-invalid");
    passwordErr.classList.replace("d-block", "d-none");
    return true;
  }else{
    passwordInput.classList.add("is-invalid");
    passwordInput.classList.remove("is-valid");
    passwordErr.classList.replace("d-none", "d-block");
    return false;
  };
};

function repasswordValidation(){
  if(repasswordInput.value == passwordInput.value && repasswordInput.value !=""){
    repasswordInput.classList.add("is-valid");
    repasswordInput.classList.remove("is-invalid");
    repasswordErr.classList.replace("d-block", "d-none");
    return true;
  }else{
    repasswordInput.classList.add("is-invalid");
    repasswordInput.classList.remove("is-valid");
    repasswordErr.classList.replace("d-none", "d-block");
    return false;
  };
};

//calling validation function for each input
$("#nameInput").on("keyup", function(){
  nameValidation();
checkValidation();
});

$("#emailInput").on("keyup", function(){
  mailValidation();
checkValidation();
});

$("#phoneInput").on("keyup", function(){
  phoneValidation();
checkValidation();
});


$("#ageInput").on("keyup", function(){
  ageValidation();
checkValidation();
});


$("#passwordInput").on("keyup", function(){
  passwordValidation();
checkValidation();
});

$("#repasswordInput").on("keyup", function(){
  repasswordValidation();
checkValidation();
});

//function to check all inputs are valid and enable submit button
function checkValidation(){
  if(nameValidation() && mailValidation() && phoneValidation() &&
  ageValidation() && passwordValidation() && repasswordValidation())
  {
    $("#submitBtn").attr("disabled" ,false);
    return true;
  }else{
    $("#submitBtn").attr("disabled" ,true);
    return false;
  }
}


//generic function to call category , ingredients, area apis
async function GetSideMeals(query) {
  let homeMealsList = ``;
  let response;
  let mealInfo;
  if(query =="c"){
    const apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  
   response = await apiData.json();
//checking for response to hide the loader and display the data
  if(response){
    for (let i = 0; i < response.categories.length; i++) {
      homeMealsList += `
        <div class="col-md-3">
          <div class="position-relative nameOfMeal" id="mealDetails">
            <img src="${response.categories[i].strCategoryThumb}" alt="meal img" id="mainImage" class="w-100 rounded rounded-2"/>
            <div class="position-absolute d-flex flex-column align-items-center align-content-center w-100 bottom-0 mealNameHov rounded rounded-2">
              <p class="mb-0 fs-2 text-black ms-2 fw-semibold">${response.categories[i].strCategory}</p>
              <p class="mb-0 fs-6 text-black ms-2 custom-description">${response.categories[i].strCategoryDescription}</p>
            </div>
          </div>
        </div>`;
    };
}
  }else{
  const apiData = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?${query}=list`);
    response = await apiData.json();
    if(response){
      for (let i = 0; i < response.meals.length && i<limit +1; i++) {
        homeMealsList += `
          <div class="col-md-3">
            <div class="position-relative nameOfMeal text-center d-flex pointer-card flex-column align-items-center" id="mealDetails ">
              ${query =='a'?  `<i class="fa-solid fa-house-laptop fa-4x mx-auto"></i> 
              <p class="mb-0 fs-2 text-white fw-semibold mx-auto">${response.meals[i].strArea}</p>
              `: `<i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <p class="mb-0 fs-3 text-white fw-semibold mx-auto">${response.meals[i].strIngredient}</p>
              <p class="mb-0 fs-6 text-white ms-2 custom-desc">${response.meals[i].strDescription}</p>
              `}
              
            </div>
          </div>`;
      };
  }
  }
  mainSection.innerHTML = homeMealsList;
  $(document).ready(function () {
    $(".fa-spinner").fadeOut(100, function () {
      $(".inner-loading-screen").fadeOut(100, function(){
        $("#mainMeals").fadeIn(50);
      });
    });
    $(".nameOfMeal").on("click", function () {
      $("#mainMeals").fadeOut(50, function () {
        $(".fa-spinner").show(100);
        $(".inner-loading-screen").show(100);
      });
      query =="c" ? mealInfo = response.categories[$(this).closest(".col-md-3").index()].strCategory
        :query =="i"?  mealInfo = response.meals[$(this).closest(".col-md-3").index()].strIngredient
        : mealInfo = response.meals[$(this).closest(".col-md-3").index()].strArea
        GetTypeMeals(query, mealInfo);
    });
  });
  };




//function to get specific data of specific category , ingredient or area
async function GetTypeMeals(query, name) {
  const apiData = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?${query}=${name}`
  );
  const response = await apiData.json();
  let homeMealsList = ``;
    for (let i = 0; i < response.meals.length; i++) {
      homeMealsList += `
        <div class="col-md-3">
          <div class="position-relative nameOfMeal" id="mealDetails">
            <img src="${response.meals[i].strMealThumb}" alt="meal img" id="mainImage" class="w-100 rounded rounded-2"/>
            <div class="position-absolute d-flex align-items-center align-content-center w-100 bottom-0 mealNameHov rounded rounded-2">
              <p class="mb-0 fs-2 text-black ms-2 fw-semibold">${response.meals[i].strMeal}</p>
            </div>
          </div>
        </div>`;
    };
  mainSection.innerHTML = homeMealsList;
  $(document).ready(function () {
    $(".fa-spinner").fadeOut(100, function () {
      $(".inner-loading-screen").fadeOut(100, function(){
        $("#mainMeals").fadeIn(50);
      });
    });
    $(".mealNameHov").on("click", function () {
      $("#mainMeals").fadeOut(50, function () {
        $(".fa-spinner").show(100);
        $(".inner-loading-screen").show(100);
      });
      const mealId = response.meals[0].idMeal;
      getMealDetails(mealId);
    });
  });
}
