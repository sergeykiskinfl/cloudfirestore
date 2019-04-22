//Client определяет изменения в пользовательском интерфейсе и взаимодействует с сервером
var Client = (function(client){
    
    /**
    * Общая функция для выполнения функций на сервере
    *
    * @param{string} serverFunction функция для выполнения на сервере
    * @param{string} successFunction функция, которая запускается при успешном выполнении serverFunction
    * @param{*} serverArg аргументы для выполнения на сервере
    */
    
    client.execute = function(serverFunction,successFunction,serverArg){

        google.script.run

            .withFailureHandler(function(err){
                App.reportMessage(err);
            })

            .withSuccessHandler(successFunction)

            [serverFunction](serverArg);
      }
    
    /**
    * Запуск серверной функции для получение "снимка" базы данных для первоначального построения пользовательского интерфейса
    *
    */
     
    client.getSnapshotData = function() {

        client.execute ('getSnapshotData',function(data){

            App.clientglobals.data = data;

            Render.build();
            
        })
     }
    
    /**
    * Получение данных из пользовательского интерфейса для запроса к базе данных
    *
    */
        
    client.getValues = function(){
                  
      App.reportMessage('Unloading...');
      
      //Сбор информации с флажков ("checkboxes")
      var labelContainers = App.clientglobals.divs.checkboxes;
      var readObjFromCF = {checkboxes:{}, inputs:{}};
           
      Object.keys(labelContainers).forEach(function(nameOfLabelContainer){
      
        var nodeLabelContainer = labelContainers[nameOfLabelContainer];
               
        readObjFromCF['checkboxes'][nameOfLabelContainer] = [];
        var labels = nodeLabelContainer.getElementsByClassName('labelbox');
               
        for(var i = 0, len = labels.length; i<len; i++){
        
          var label = labels[i];
          var chs = label.getElementsByClassName('checkboxitem');
                    
          for(var y = 0, lenchs = chs.length; y<lenchs; y++){
          
            var checkb = chs[y];
                        
            if (checkb.checked == true){
            
              readObjFromCF['checkboxes'][nameOfLabelContainer].push(checkb.value);
                            
            };
          
          };
                  
        };
                
      });
      
      //Сбор информации с полей ввода ("inputs") и проверка правильности значений
      var prices = App.clientglobals.divs.inputs;
      var checkPrice = [];
                 
      Object.keys(prices).forEach(function(priceName){
      
        var priceInput = prices[priceName];
        var price = priceInput.value;
        var plength = price.length;
                        
        price = Number.parseFloat(price);
                
        if(plength>0){
                    
          if (isNaN(price) || price<0){
          
            checkPrice.push(price);
          
          }
            
        }
        
        readObjFromCF['inputs'][priceName]=price;
        
      });
     
      var checkPriceLength = checkPrice.length;
      
      //Проверка правильности введенных данных
      //Если данные некорректные, появляется соответствующие сообщение
      if (checkPriceLength>0){return App.reportMessage('Выберите неотрицательное число');}
      
      if(readObjFromCF.inputs.price_max==0){return App.reportMessage('Максимальная цена не может быть равна нулю');}
      
      if(readObjFromCF.inputs.price_min > readObjFromCF.inputs.price_max){
        
        return App.reportMessage('Выберите правильный диапазон цен');
      
      }
      
      //Информация собирается в объект "readObjFromCF" и передается на сервер для дальнейшего осуществления запроса к базе данных
      client.execute ('readDataFromCF',function(){

            App.reportMessage('Success');
            
        }, readObjFromCF);
               
    };
    
    /**
    * Запускает серверную функцию для загрузки данных с листа Google Sheet в базу данных
    *
    */
    
    client.loadDatatoCF = function() {

      App.reportMessage('Loading...');

      client.execute ('loadDataToCF',function(){

        App.reportMessage('Success');
        
      });      
      
    }

    return client;

})(Client || {}); 