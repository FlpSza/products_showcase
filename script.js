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

            const images = details[0].items[0].images.map(img => img.imageUrl);
            const price = details[0].items[0].sellers[0].commertialOffer.Price;
            const listPrice = details[0].items[0].sellers[0].commertialOffer.ListPrice;

            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
            <div class="image-container">
                <button class="prev-btn">&#8592;</button> 
                <img class="product-image" src="${images[0]}" alt="${product.productName}">
                <button class="next-btn">&#8594;</button> 
            </div>
            <h3>${product.productName}</h3>
            <p>${product.brand}</p>
            <p class="list-price">De: <s>R$ ${listPrice.toFixed(2)}</s></p>
            <p class="price">R$ ${price.toFixed(2)}</p>
            <button class='buy-button'>Comprar</button>
            `;

            productGrid.appendChild(productCard);

            const prevBtn = productCard.querySelector(".prev-btn");
            const nextBtn = productCard.querySelector(".next-btn");
            const img = productCard.querySelector(".product-image");

            let currentImageIndex = 0;

            // Função para mudar a imagem
            const changeImage = (index) => {
                img.src = images[index];
            };

            // Alterar para a imagem anterior
            prevBtn.addEventListener("click", () => {
                if (currentImageIndex > 0) {
                    currentImageIndex--;
                } else {
                    currentImageIndex = images.length - 1;
                }
                changeImage(currentImageIndex);
            });

            // Alterar para a próxima imagem
            nextBtn.addEventListener("click", () => {
                if (currentImageIndex < images.length - 1) {
                    currentImageIndex++;
                } else {
                    currentImageIndex = 0;
                }
                changeImage(currentImageIndex);
            });

            // Evento para expandir a imagem ao clicar nela
            img.addEventListener("click", () => {
                openModal(images[currentImageIndex]);
            });
        }

        // Garantir que a grid se reorganize corretamente após a inserção dos elementos
        productGrid.style.display = 'grid';
        productGrid.style.gridTemplateColumns = 'repeat(5, 1fr)'; // Garantir que as colunas sejam 5

    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
    }
}

// Função para abrir a modal de imagem
function openModal(imageSrc) {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <img src="${imageSrc}" class="modal-image" alt="Expanded Image">
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector(".close-btn");
    closeBtn.addEventListener("click", () => {
        modal.remove();  // Fecha a modal
    });

    // Fecha a modal quando clicar fora da imagem
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function loadMoreProducts() {
    currentPage++; // Incrementar para carregar os próximos produtos
    const response = await fetch("https://desafio.xlow.com.br/search");
    const products = await response.json();

    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    
    // Se não houver mais produtos, volta para a primeira página
    if (startIndex >= products.length) {
        currentPage = 0; // Reinicia a páginação
    }

    fetchProducts(); // Carregar os produtos (agora pode reiniciar se necessário)
}

// Adicionar evento para o botão de "Alterar Layout"
document.getElementById("toggle-layout").addEventListener("click", loadMoreProducts);

window.onload = fetchProducts;
