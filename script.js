const form = document.querySelector(".search-form")
const recipeList = document.querySelector(".recipe-list")
const recipeDetails = document.querySelector(".recipe-details")

form.addEventListener("submit", (event) => {
    event.preventDefault()

    // primeiro item é o input
    const inputValue = event.target[0].value

    searchRecipe(inputValue)
})

// funcao assincrona para retornar os valores da api
async function searchRecipe(ingredient) {
    try{
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    // trazer os dados em formato de objeto
    const data = await response.json()
    showRecipes(data.meals)
    }catch(err){
        recipeList.innerHTML = `<h2 class="busca-erro">Nenhuma receita encontrada</h2>`
    }
    
} 

function showRecipes(recipes) {

    // colocar na tag dentro do html 
    // template string
    recipeList.innerHTML = recipes.map((item) =>
        `
        <div class="recipe-card" onClick=getRecipeDetails(${item.idMeal})>
            <img src=${item.strMealThumb} alt="foto-receita" >
            <h3>${item.strMeal}</h3>
        </div>

        `
    ).join("");
}

// buscar ingredientes de cada id da receita

async function getRecipeDetails(id) {

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    const data = await response.json()
    const recipe = data.meals[0]

    let ingredients = ""

    for (let i = 1; i <= 20; i++) {
        // passando pelos ingredientes do 1 ao 20
        if (recipe[`strIngredient${i}`]) {
            ingredients +=
                `
            <li>${recipe[`strIngredient${i}`]}</li> - ${recipe[`strMeasure${i}`]}
            <br>
            
            `
        } else {
            break
        }
    }

    recipeDetails.innerHTML = `
   <div class="container-detalhes">
        <div class="imagem-texto">
            <div>
                <h2>${recipe.strMeal}</h2>
                <img class="imagem-detalhes" src="${recipe.strMealThumb} "alt ="${recipe.strMeal}" >
                <h4>Origem: ${recipe.strArea}</h4>
            </div>
            <div class="texto-detalhes">
                <h3>Instruções</h3>
                <p>${recipe.strInstructions}</p>
                <p>Tags: ${recipe.strTags}</p>
                <p>Vídeo: <a href="${recipe.strYoutube}" target="_blank" rel="noopener noreferer">Assista no YouTube</a></p>
            </div>
        </div>
        <div class="ingredientes-detalhes">
            <h3>Ingredientes</h3>
            <ul>${ingredients}</ul>
        </div>
    </div>

    `

}