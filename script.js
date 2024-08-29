document.addEventListener('DOMContentLoaded', () => {
    const breedButtonsContainer = document.getElementById('breedButtons');
    const dogImagesContainer = document.getElementById('dogImages');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    async function fetchBreeds() {
        showLoading(true);
        clearError();
        try {
            const response = await fetch('https://dog.ceo/api/breeds/list/all');
            if (!response.ok) throw new Error('Falha ao buscar lista de raças');
            const data = await response.json();
            const breeds = Object.keys(data.message);
            createBreedButtons(breeds);
        } catch (error) {
            console.error('Erro ao buscar lista de raças:', error);
            showError('Erro ao carregar raças. Por favor, tente novamente mais tarde.');
        } finally {
            showLoading(false);
        }
    }

    function createBreedButtons(breeds) {
        breedButtonsContainer.innerHTML = ''; // Limpa botões existentes
        breeds.forEach(breed => {
            const button = document.createElement('button');
            button.innerText = breed.charAt(0).toUpperCase() + breed.slice(1);
            button.addEventListener('click', () => fetchDogImages(breed));
            breedButtonsContainer.appendChild(button);
        });
    }

    async function fetchDogImages(breed) {
        showLoading(true);
        clearImages();
        clearError();
        try {
            const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random/4`);
            if (!response.ok) throw new Error('Falha ao buscar imagens');
            const data = await response.json();
            displayImages(data.message);
        } catch (error) {
            console.error('Erro ao buscar imagens:', error);
            showError('Erro ao carregar imagens. Por favor, tente novamente mais tarde.');
        } finally {
            showLoading(false);
        }
    }

    function displayImages(images) {
        images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Imagem de Cachorro';
            img.className = 'dog-image';
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            img.addEventListener('error', () => {
                console.error('Erro ao carregar imagem:', imageUrl);
                img.src = 'placeholder.jpg'; // Substitua por uma imagem de placeholder real
                img.alt = 'Imagem não disponível';
            });
            dogImagesContainer.appendChild(img);
        });
    }

    function clearImages() {
        dogImagesContainer.innerHTML = '';
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingMessage.classList.remove('hidden');
        } else {
            loadingMessage.classList.add('hidden');
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function clearError() {
        errorMessage.textContent = '';
        errorMessage.classList.add('hidden');
    }

    // Função para recarregar a página
    function reloadPage() {
        location.reload();
    }

    // Adiciona um botão para recarregar a página
    const reloadButton = document.createElement('button');
    reloadButton.textContent = 'Recarregar Raças';
    reloadButton.addEventListener('click', reloadPage);
    reloadButton.classList.add('reload-button');
    document.querySelector('.container').insertBefore(reloadButton, breedButtonsContainer);

    // Inicia o aplicativo buscando as raças
    fetchBreeds();
});