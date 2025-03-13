let currentPage = 0;  

const PRODUCTS_PER_PAGE = 5; 

async function fetchProducts() {
    const productGrid = document.getElementById("product-grid");
    const productCount = document.getElementById("product-count");

    try {
        const response = await fetch("https://desafio.xlow.com.br/search");
        const products = await response.json();

        // Limpar a grid antes de adicionar os novos produtos
        productGrid.innerHTML = ''; 
        
        // Calcular o índice inicial e final dos produtos a serem exibidos
        const startIndex = currentPage * PRODUCTS_PER_PAGE;
        const endIndex = startIndex + PRODUCTS_PER_PAGE;
        const productsToShow = products.slice(startIndex, endIndex);  // Seleciona os produtos da página atual
        
        productCount.textContent = productsToShow.length;
        
        for (const product of productsToShow) {
            const productDetails = await fetch(
                `https://desafio.xlow.com.br/search/${product.productId}`
            );
            const details = await productDetails.json();

            const imageUrl = details[0].items[0].images[0].imageUrl;
            const price = details[0].items[0].sellers[0].commertialOffer.Price;

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img class="product-image" src="${imageUrl}" alt="${product.productName}">
                <h3>${product.productName}</h3>
                <p>${product.brand}</p>
                <p class="price">R$ ${price.toFixed(2)}</p>
                <button>Comprar</button>
            `;

            productGrid.appendChild(productCard);
        }

        // Garantir que a grid se reorganize corretamente após a inserção dos elementos
        productGrid.style.display = 'grid';
        productGrid.style.gridTemplateColumns = 'repeat(5, 1fr)'; // Garantir que as colunas sejam 5

    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

// document.addEventListener("DOMContentLoaded", fetchProducts);

async function loadMoreProducts() {
    currentPage++; // Incrementar para carregar os próximos produtos
    fetchProducts(); // Carregar mais produtos
}

// Adicionar evento para o botão de "Alterar Layout"
document.getElementById("toggle-layout").addEventListener("click", loadMoreProducts);

window.onload = fetchProducts;
