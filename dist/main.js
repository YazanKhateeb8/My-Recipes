const render = new Render();


$('#recipe-btn').on('click', function () {

  const glutenCheck = $('#gluten-btn').is(':checked')
  const dairyCheck = $('#dairy-btn').is(':checked')
  const ingredient = $('input').val()


  $.get(`/recipes/${ingredient}?gluten=${glutenCheck}&diary=${dairyCheck}`)
  .then((recipes) => {
    render.renderRecipes(recipes);
  })
 
});



$('.main').on('click', 'img', function () {
  alert($(this).siblings('ul').find('li:first-child').text());
});






