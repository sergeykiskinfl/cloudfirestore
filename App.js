//App отвечает за сохранение первоначальных настроек и сохранение данных, 
//используемых в других частях приложения, а также за добавление обработчиков событий
var App = (function(app){
        //collections
        const headings = ["category","vendor"];
        
        app.initServer = function () {
        //Первоначальные данные на стороне сервера
            app.serverglobals = {
                sheet:{
                    id:'YOUR_ID_SHEET_HERE',
                    name:'Price'            
                },
                cloudproject:{
                    nameofcolection:'PriceColl',
                    nameofdocument:'DataPrice',
                    nameofdocumentsnapshot:'Snapshot',
                    email:'YOUR_ADMINSDK_EMAIL_HERE',
                    key: 'YOUR_PRIVATE_KEY_HERE',
                    id:'YOUR_PROJECT_ID_HERE'
                },
                                
                headings:headings,
                                         
            };
         };
        
        app.initClient = function () {
          //Первоначальные данные на стороне клиента
          app.clientglobals = {
          
            divs: {

                checkboxes:{
                    category:document.getElementById('category-checkboxes'),
                    vendor:document.getElementById('vendor-checkboxes'),
                },

                select:{
                    category:document.getElementById('category-select'),
                    vendor:document.getElementById('vendor-select'),
                },
              
                container:{
                    category:document.getElementById('category-container'),
                    vendor:document.getElementById('vendor-container'),
                },
              
              message:document.getElementById('message'),

              form:document.getElementById('form1'),

              loadbutton:document.getElementById('loadbutton'),

              inputs:{
                price_min:document.getElementById('price-min'),
                price_max:document.getElementById('price-max'),
              },
              
            },
            
            expanded:{},
                                          
          };            
          
        };
    /**
    * Отображает сообщение о выполнении, либо об ошибке
    *
    * @param {string} message сообщение
    */
    app.reportMessage = function(message){
        document.getElementById('message').innerHTML = message;
    }
    
    //Добавление обработчиков событий    
    app.listeners = function() {
       
        headings.forEach(function(heading){

            app.clientglobals.expanded[heading] = false;
            
            var select = app.clientglobals.divs.select[heading];
            
            select.addEventListener ("click", function(e){
                
                Render.showCheckboxes(heading);

            });
        });
        
       var form1 = app.clientglobals.divs.form;

        form1.addEventListener ("submit", function(e){
                
            e.preventDefault();
                       
            Client.getValues();
                                    
       });

       var loadbutton = app.clientglobals.divs.loadbutton;

       loadbutton.addEventListener ("click", function(e){
                
            Client.loadDatatoCF();

        });
        
    };

    return app;

})(App || {});