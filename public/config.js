fetch("/__/firebase/init.json").then(async (response) => {
  const firebaseConfig = await response.json();
  // AppId is missing on hosting environment
  // https://github.com/firebase/firebase-js-sdk/issues/2287#issuecomment-553860831
  const appId = "1:926644409140:web:de1896577fbaa28dbecb61";
  const completedFirebaseConfig = {
    ...firebaseConfig,
    appId,
  };

  const app = firebase.initializeApp(completedFirebaseConfig);

  // [START get_messaging_object]
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  // [END get_messaging_object]

  // IDs of divs that display registration token UI or request permission UI.
  const tokenDivId = "token_div";
  const permissionDivId = "permission_div";
  const productListDivId = "product_list";

  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a service worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage((payload) => {
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    appendMessage(payload);
    // [END_EXCLUDE]
  });
  // [END receive_message]

  const db = firebase.firestore();
  const url = window.location.href;
  const isOnLocalhost = url.includes("localhost");

  if (isOnLocalhost) {
    db.useEmulator("localhost", 8080);
  }

  const activeProducts = await getActiveProducts();

  showProducts(activeProducts);

  function resetUI() {
    clearMessages();
    showToken("loading...");
    // [START get_token]
    // Get registration token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging
      .getToken({
        vapidKey:
          "BFY5FpCj31wxBdg8RgX-J3xykYA0ChWnVNj968Gu3oUslytWzbkUXxFa-HyrbzUpeXvJTqGoksJP22ccyKLujMQ",
      })
      .then((currentToken) => {
        if (currentToken) {
          sendTokenToServer(currentToken);
          updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // Show permission UI.
          updateUIForPushPermissionRequired();
          setTokenSentToServer(false);
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        showToken("Error retrieving registration token. ", err);
        setTokenSentToServer(false);
      });
    // [END get_token]
  }

  function showToken(currentToken) {
    // Show token in console and UI.
    const tokenElement = document.querySelector("#token");
    tokenElement.textContent = currentToken;
  }

  async function getActiveProducts() {
    const activeProductsRef = await db
      .collection("products")
      .where("active", "==", true)
      .get();

    let activeProducts = [];
    activeProductsRef.forEach((doc) => activeProducts.push(doc.data()));

    return activeProducts;
  }

  function showProducts(products) {
    const productsGridRow = document.getElementById(productListDivId);

    products.forEach((product) => {
      const productElement = createProductElement(product);
      productElement.classList.add(
        "mdl-cell",
        "mdl-cell--12-col-phone",
        "mdl-cell--4-col-tablet",
        "mdl-cell--4-col-desktop"
      );

      productsGridRow.appendChild(productElement);
    });
  }

  function createProductElement(product) {
    const cardElement = document.createElement("div");
    const html = `<div class="mdl-card mdl-shadow--4dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">${product.title}</h2>
      </div>
      <div class="mdl-card__media">
        <img
          src="${product.imageUrl}"
          width="100%"
          alt="${product.title}"
        />
      </div>
      <div class="mdl-card__actions">
        <a href="${product.url}" target="_blank" class="mdl-button mdl-button--colored">Visit</a>
      </div>
    </div>`;
    cardElement.innerHTML = html;
    const node = cardElement.firstElementChild;
    return node;
  }

  // Send the registration token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  async function sendTokenToServer(currentToken) {
    const addTokenInDb = (id) => {
      return fetch("/messagingToken", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: currentToken }),
      });
    };
    if (!isTokenSentToServer()) {
      console.log("Sending token to server...");
      addTokenInDb(currentToken);
      setTokenSentToServer(true);
    } else {
      console.log(
        "Token already sent to server so won't send it again " +
          "unless it changes"
      );
    }
  }

  function isTokenSentToServer() {
    return window.localStorage.getItem("sentToServer") === "1";
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem("sentToServer", sent ? "1" : "0");
  }

  function showHideDiv(divId, show) {
    const div = document.querySelector("#" + divId);
    if (show) {
      div.style = "display: visible";
    } else {
      div.style = "display: none";
    }
  }

  function requestPermission() {
    console.log("Requesting permission...");
    // [START request_permission]
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        // TODO(developer): Retrieve a registration token for use with FCM.
        // [START_EXCLUDE]
        // In many cases once an app has been granted notification permission,
        // it should update its UI reflecting this.
        resetUI();
        // [END_EXCLUDE]
      } else {
        console.log("Unable to get permission to notify.");
      }
    });
    // [END request_permission]
  }

  async function deleteToken() {
    const deleteTokenInDb = (id) => {
      return fetch("/messagingToken", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
    };

    // Delete registration token.
    // [START delete_token]
    messaging
      .getToken()
      .then((currentToken) => {
        messaging
          .deleteToken(currentToken)
          .then(() => deleteTokenInDb(currentToken))
          .then(() => {
            console.log("Token deleted.");
            setTokenSentToServer(false);
            // [START_EXCLUDE]
            // Once token is deleted update UI.
            resetUI();
            // [END_EXCLUDE]
          })
          .catch((err) => {
            console.log("Unable to delete token. ", err);
          });
        // [END delete_token]
        return currentToken;
      })
      .catch((err) => {
        console.log("Error retrieving registration token. ", err);
        showToken("Error retrieving registration token. ", err);
      });
  }

  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector("#messages");
    const dataHeaderElement = document.createElement("h5");
    const dataElement = document.createElement("pre");
    dataElement.style = "overflow-x:hidden;";
    dataHeaderElement.textContent = "Received message:";
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderElement);
    messagesElement.appendChild(dataElement);
  }

  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector("#messages");
    while (messagesElement.hasChildNodes()) {
      messagesElement.removeChild(messagesElement.lastChild);
    }
  }

  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }

  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }

  document
    .getElementById("deleteButton")
    .addEventListener("click", deleteToken);

  document
    .getElementById("requestPermissionButton")
    .addEventListener("click", requestPermission);

  resetUI();
});
