const currentPage = new URLSearchParams(location.search).get("page");
const $sidebarMenuItems = document.querySelectorAll(".sidebar__menu a");
const $mainContents = document.querySelectorAll("main > div");
const userId = JSON.parse(atob(localStorage.getItem("token").split(".")[1])).id;
const $allContent = document.querySelector("#all-content");
const $modalDeleteWrapper = document.querySelector(".modal-delete-wrapper");
const $modalDelete = document.querySelector(".modal-delete");
const $modalDeleteClose = document.querySelector("#modal-delete-close");
const $modalDleteBtn = document.querySelector(".modan-delete-btn");

$sidebarMenuItems.forEach((sidebarLink) => {
  if (sidebarLink.href.includes(currentPage)) {
    sidebarLink.setAttribute("aria-current", "page");
  }
});

$mainContents.forEach((content) => {
  if (content.dataset.contentName.includes(currentPage)) {
    content.style.display = "flex";
  }
});

async function fetchData(endpoint) {
  const response = await axios(`http://localhost:3000/api${endpoint}`);
  renderAllRealEstatedata(response.data);
}

function renderAllRealEstatedata(data) {
    $allContent.innerHTML = ""
  const allrealEstateFragment = document.createDocumentFragment();
  data.map((realestate) => {
    const $realEstateCardItem = document.createElement("div");
    $realEstateCardItem.classList = "real-estate__card-item";
    $realEstateCardItem.innerHTML = `
            <img src="${realestate.imageUrls[0]}"  alt="${
      realestate.description
    }"/>
            <h3>${realestate.name}</h3>
            <p>${realestate.description.split(" ").splice(0, 15)}</p>
            <strong>$${realestate.regularPrice}</strong>
            <div class="card__button-wrapper">
                <button>Edit</button>
                <button id="card-delete" data-realestate-id="${
                  realestate._id
                }">Delete</button>
            </div>

        `;
    allrealEstateFragment.appendChild($realEstateCardItem);
  });
  $allContent.appendChild(allrealEstateFragment);
}

$allContent.addEventListener("click", (e) => {
  if (e.target.closest("#card-delete")) {
    $modalDeleteWrapper.classList.add("modal-delete-wrapper-active");
    $modalDelete.classList.add("modal-delete-active");
    $modalDleteBtn.setAttribute(
      "data-realestate-id",
      e.target.dataset.realestateId
    );
  }
});

$modalDleteBtn.addEventListener("click", (e) => {
  const deleteItemId = e.target.dataset.realestateId;

  axios
    .delete("http://localhost:3000/api/listing/delete/" + deleteItemId, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        $modalDeleteWrapper.classList.remove("modal-delete-wrapper-active");
        $modalDelete.classList.remove("modal-delete-active");
        fetchData("/listing/get");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

$modalDeleteClose.addEventListener("click", (e) => {
  $modalDeleteWrapper.classList.remove("modal-delete-wrapper-active");
  $modalDelete.classList.remove("modal-delete-active");
});

switch (currentPage) {
  case "all":
    fetchData("/listing/get");
    break;
}
