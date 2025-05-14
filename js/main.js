const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "TON_DOMAINE.firebaseapp.com",
  projectId: "TON_PROJECT_ID",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const productsContainer = document.getElementById("products");
const categoryFilter = document.getElementById("categoryFilter");

let allProducts = [];

function renderProducts(products) {
  productsContainer.innerHTML = '';
  if (products.length === 0) {
    productsContainer.innerHTML = '<p>Aucun produit trouvé.</p>';
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h4>${product.name}</h4>
      <p>Catégorie : ${product.category}</p>
      <a href="${product.affiliateLink}" class="btn" target="_blank">Voir</a>
    `;
    productsContainer.appendChild(card);
  });
}

function populateCategories(products) {
  const categories = [...new Set(products.map(p => p.category))];
  categories.forEach(cat => {
    categoryFilter.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;
  const filtered = selected === "all"
    ? allProducts
    : allProducts.filter(p => p.category === selected);
  renderProducts(filtered);
});

db.collection("products").get().then(snapshot => {
  allProducts = snapshot.docs.map(doc => doc.data());
  populateCategories(allProducts);
  renderProducts(allProducts);
});
