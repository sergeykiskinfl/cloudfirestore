//Render отвечает за отображение пользовательского интерфейса
var Render = (function(render){
    
    //Построение интерфейса
    render.build = function() {
                        
        var objRender = {
        
          vendor:App.clientglobals.divs.checkboxes.vendor,
          category:App.clientglobals.divs.checkboxes.category,
        
        };
        
        var objData = App.clientglobals.data;

        Object.keys(objRender).forEach(function(keyForSelector){
                    
          var container = objRender[keyForSelector];
          var data = objData[keyForSelector];
          
          data.forEach(function(d,i){
                                      
              var labelBox = document.createElement('label');
              var checkbox = document.createElement('input');
              var text = document.createTextNode(d);
              
              labelBox.setAttribute("for", i);
              labelBox.classList.add("labelbox");
                          
              checkbox.type = "checkbox";
              checkbox.id = i;
              checkbox.value = d;
              checkbox.classList.add("checkboxitem");
                          
              labelBox.appendChild(checkbox);
              labelBox.appendChild(text);
                          
              container.appendChild(labelBox);
                          
            });
        
          });
         
    }    
    
    //Регистрация изменения состояния флажков
    render.showCheckboxes = function(heading) {

      var checkboxes =  App.clientglobals.divs.checkboxes[heading];
      var expanded = App.clientglobals.expanded[heading]; 
      
      if (!expanded) {
        checkboxes.style.display = "block";
        App.clientglobals.expanded[heading] = true;
      } else {
        checkboxes.style.display = "none";
        App.clientglobals.expanded[heading] = false;
      }

    }

    return render;

})(Render || {});