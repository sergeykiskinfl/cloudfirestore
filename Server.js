//Server отвечает за запуск функций на сервере в ответ на запросы google.script.run со стороны клиента
var Server = (function(server){
   
    /**
    * Функция для получение "снимка" базы данных
    *
    */       
    server.getSnapshotData = function(){
      
      //Инициализация необходимых данных для осуществления запроса
      App.initServer();
             
      const nameCollSnapshot=App.serverglobals.cloudproject.nameofdocumentsnapshot;
      const email=App.serverglobals.cloudproject.email;
      const key=App.serverglobals.cloudproject.key;
      const projectId=App.serverglobals.cloudproject.id;
      const headingsKeyFields = App.serverglobals.headings;
      
      var obj = {};

      //Получение снимка
      headingsKeyFields.forEach(function(heading){
          
          var pathDoc = nameCollSnapshot + "/" + heading;
          var objBuffer = FirestoreRead.getDocumentFields(pathDoc, email, key, projectId);
          
          obj[heading] = Object.keys(objBuffer).map(function(k){return objBuffer[k]});
                   
      })
      
      return obj;
      
      };
      
      /**
      * Создание запроса и чтение из базы данных
      *
      * @param {Object} readObj Отображает данные для запроса на основании пользовательского интерфейса
      */
      server.readDataFromCF = function(readObj){
        
        //Проверка данных от клиента
        var checkboxObj = readObj['checkboxes'];
        
        var priceMin = readObj['inputs']['price_min'];
        var testPriceMin = testInteger_(priceMin);
                
        var priceMax = readObj['inputs']['price_max'];
        var testPriceMax = testInteger_(priceMax);
        
        //Инициализация необходимых данных для осуществления запроса
        App.initServer();
        
        const nameCollSnapshot = App.serverglobals.cloudproject.nameofdocumentsnapshot;
        const email = App.serverglobals.cloudproject.email;
        const key = App.serverglobals.cloudproject.key;
        const projectId = App.serverglobals.cloudproject.id;
        const nameColl = App.serverglobals.cloudproject.nameofcolection;
        const nameDoc = App.serverglobals.cloudproject.nameofdocument;
        const nameSheet = App.serverglobals.sheet.name;
        const idSob = App.serverglobals.sheet.id;
        
        var snapshotPath = nameCollSnapshot + '/keyStr';
        var docPath = nameColl+'/'+nameDoc; 
                
        //Удаление устаревших данных и фильтра
        var sheet = SpreadsheetApp.openById(idSob).getSheetByName(nameSheet);
  
        var ilastRow = sheet.getLastRow();
        var ilastColumn = sheet.getLastColumn();
        
        var filterRange = sheet.getRange(1, 1, ilastRow, ilastColumn);
        if (filterRange.getFilter() !== null){filterRange.getFilter().remove()};
              
        sheet.getRange(2, 1, ilastRow, ilastColumn).clear();
        
        var headers = sheet.getRange(1,1,1,ilastColumn).getValues()[0].map(function(d){return d.toString().toLowerCase()});
                
        //Формирование запросов через рекурсивную функцию. Если ни один флажок не выбран, выбирается все.
        var requestObj = {};
        
        Object.keys(checkboxObj).forEach(function(nameField){
        
          if(checkboxObj[nameField].length == 0){
            
            var pathSnapshot = nameCollSnapshot + '/' + nameField;
            
            var objBuffer = FirestoreRead.getDocumentSnapshot(pathSnapshot, email, key, projectId);
            var arrBuffer = [];
            
            Object.keys(objBuffer).forEach(function(d){arrBuffer.push(objBuffer[d]);})
            
            checkboxObj[nameField] = arrBuffer;
            
            }
                             
          var requestPart = checkboxObj[nameField].map(function(value){return nameField + '/' + value});

          requestObj[nameField] = requestPart;
        
        });
            
        var arrBuffer = [], arrRequestStart = [], i=0, length = Object.keys(requestObj).length;

        recurse_(arrBuffer, arrRequestStart, requestObj, i, length);

        var snapshot = FirestoreRead.getDocumentFields(snapshotPath, email, key, projectId);
                
        var arrSnapshot = [], arrRequest =[];

        Object.keys(snapshot).forEach(function(keyField){
        
          arrSnapshot.push(snapshot[keyField]);
        
        });
        
        //Выборка запросов по параметрам клиента
        arrRequestStart.forEach(function(request){
        
          if (arrSnapshot.some(function(sn){return sn == request})){
              
              var requestPath = docPath + '/' + request;
              
              arrRequest.push(requestPath);

          }
        
        });
        
        //Запросы к базе данных
        var arrWriteStart = [];
        
        arrRequest.forEach(function(request){
        
          var objBuffer = FirestoreRead.getDocumentFields(request, email, key, projectId);
  
          var arrBuffer = [];
            
          Object.keys(objBuffer).forEach(function(row){

              var price = objBuffer[row]['cost_rub'];
              price = Number(price);
                            
              if(testPriceMin){

                if(testPriceMax){

                  if(price>=priceMin && price<=priceMax){

                    arrBuffer.push(objBuffer[row]);

                  }
                                  
                }

                else {

                  if(price>=priceMin){arrBuffer.push(objBuffer[row]);}

                };
              
              }

              else {

                if(testPriceMax){

                  if(price<=priceMax){arrBuffer.push(objBuffer[row]);}

                }

                else{arrBuffer.push(objBuffer[row]);}

              }
                                      
          });
          
          arrWriteStart.push(arrBuffer);
                   
        });
        
        //Приведение ответа в подходящий вид и запись на лист Google Sheet
        var arrWrite = [];
        var iRow = 0;
        
        arrWriteStart.forEach(function(arrRow){
        
          iRow += arrRow.length;
          
          arrRow.forEach(function(row){
          
              var arrBuffer = [];
              
              headers.forEach(function(column){
                  
                arrBuffer.push(row[column]);
              
              });
      
              arrWrite.push(arrBuffer);
          
            });
        
        });
                
        sheet.getRange(2,1,iRow,ilastColumn).setValues(arrWrite);
        sheet.getRange(1,1,iRow+1,ilastColumn).createFilter();
                
      };
      
      /**
      * Создание запроса и запись в базу данных
      *
      */
      server.loadDataToCF = function(){

        //Инициализация необходимых данных для осуществления запроса
        App.initServer();

        const nameCollSnapshot = App.serverglobals.cloudproject.nameofdocumentsnapshot;
        const email = App.serverglobals.cloudproject.email;
        const key = App.serverglobals.cloudproject.key;
        const projectId = App.serverglobals.cloudproject.id;
        const nameColl = App.serverglobals.cloudproject.nameofcolection;
        const nameDoc = App.serverglobals.cloudproject.nameofdocument;
        const nameSheet = App.serverglobals.sheet.name;
        const idSob = App.serverglobals.sheet.id;
        const headingsKeyFields = App.serverglobals.headings;
        const pathDoc = nameColl + "/" + nameDoc;

        //Извлечение данных с листа Google Sheet
        var sob = new SheetOb().open(idSob, nameSheet);
        var sobData = sob.getData();

        //Список уникальных ключевых строк
        var keyfieldObj = {};
        //Данные с листа Google Sheet, сгруппированные по ключевым полям
        var metaSobData = [];
        
        var metaHeadingsData = {};

        headingsKeyFields.forEach(function(nameField){
                          
          metaHeadingsData[nameField] = {};

        });

        /** 
        * Создание ключевых строк для дальнейшего разделения
        * Каждая строка представляет собой путь для сохранения отдельного элемента и сохраняется в виде отдельного ключа объекта row
        *
        * @param {Object} row объект, представляющий собой отдельную строку таблицы
        */
        sobData.forEach(function(row){

          //Массив выбранных значений свойств объекта row
          var arrBuffer = [];

          headingsKeyFields.forEach(function(nameField){
                          
            arrBuffer.push(nameField);
            arrBuffer.push(row[nameField]);
            metaHeadingsData[nameField][row[nameField]] = true;

          });

          //Ключевая строка
          var keyStrValues = arrBuffer.join('/');

          row['keyStr'] = keyStrValues;

          keyfieldObj[keyStrValues] = true;

        });

        var keyFieldArr = Object.keys(keyfieldObj);

        //Группировка данных по значению ключевых строк
        keyFieldArr.forEach(function(keyFieldvalue){

          var arrBuffer =  sobData.filter(function(row){

              return row['keyStr'] == keyFieldvalue;

          });

          metaSobData.push(arrBuffer);

        });
        
        //Создание снимка базы данных
        //Перевод значений metaHeadingsData из объектов в массивы
        Object.keys(metaHeadingsData).forEach(function(nameField){
        
          var arrBuffer = Object.keys(metaHeadingsData[nameField]);
          delete metaHeadingsData[nameField];
          metaHeadingsData[nameField] = arrBuffer;
        
        });

        //Добавить ключевые строки в снимок
        metaHeadingsData['keyStr'] =  keyFieldArr;
        
        //Перенос снимка в базу данных
        var pathColl = nameCollSnapshot;

        Object.keys(metaHeadingsData).forEach(function(nameField){
          
          var arrSnapShot = metaHeadingsData[nameField];
          
          var pathDocAdditional = pathColl + "/" + nameField;

          try {
          
            var objOldData = FirestoreRead.getDocumentFields(pathDocAdditional, email, key, projectId);

            var arrOldData = [];

            Object.keys(objOldData).forEach(function(itemOfData){

              arrOldData.push(objOldData[itemOfData]);

            })

            var arrSnapShot2 = arrSnapShot.concat(arrOldData);
                        
            arrSnapShot2 = FirestoreUtils.arrUniqValues(arrSnapShot2);
                        
            FirestoreWrite.updateDocument(pathDocAdditional, arrSnapShot2, email, key, projectId);

          }
          
          catch (error) {
            
            FirestoreWrite.updateDocument(pathDocAdditional, arrSnapShot, email, key, projectId);
                  
          }
              
        });

        //Перенос информации в базу данных, удаление лишнего ключа
        for (var i = 0; i < metaSobData.length; i++){

          var pathDocAdditional = pathDoc + "/" + metaSobData[i][0]['keyStr'];

          var arrData = metaSobData[i];

          arrData.forEach(function(row){

              delete row['keyStr'];

          });

          FirestoreWrite.updateDocument(pathDocAdditional, arrData, email, key, projectId);

          };
                                  
      };
      
      /**
      * Рекурсивная функция для выполнения запросов с использованием ключевых строк
      *
      * @param {string[]} arrBuffer буферный массив на каждом шаге рекурсии
      * @param {string[]} arrSum конечный массив
      * @param {number} i шаг рекурсии
      * @param {number} length количество уровней рекурсии
      */        
      function recurse_(arrBuffer, arrSum, objStart, i, length){

        if(i+1==length){
      
          var key = Object.keys(objStart)[i];
      
          var arrStartKey = objStart[key];
      
          arrStartKey.forEach(function(value){
          
            arrBuffer.push(value);
      
            var keyString = arrBuffer.join('/');
      
            arrSum.push(keyString);      
      
            arrBuffer.pop();
          
          });
      
        }
      
        else {
      
          var key = Object.keys(objStart)[i];
      
          var arrStartKey = objStart[key];
      
          i++;
      
          arrStartKey.forEach(function(value){
            
            arrBuffer.push(value);
           
            recurse_(arrBuffer, arrSum, objStart, i, length);
            
            arrBuffer.pop();
          
          });
       
        }
      
      };

      function testInteger_(value) {
  
        if (value!==(NaN || null) && value>=0){
        
          return true;
        
        }
        
        return false;
      
      }
          
    return server;

})(Server || {});

//Обертка серверных функций в глобальные функции (необходимо, чтобы можно было вызвать из клиента)
function getSnapshotData(){
              
    return Server.getSnapshotData();
}

function readDataFromCF(readObj){

    return Server.readDataFromCF(readObj);

}

function loadDataToCF(){

  return Server.loadDataToCF();

}