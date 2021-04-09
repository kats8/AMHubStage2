$(document).ready(function(){
    console.log('Ready');
  
 
    $('#btnName').click(()=>{
      
      let name=$('#nameBox').val();
      let data = {
        name: name
      }
      //"http://localhost:8080/displayHello
      $.get('/displayHello', data, function(result){
        console.log('Name has returned:'+ result)
        $('#result').val(result);
      })
    })


  })