//Addon отвечает за первоначальную инициализацию и добавление меню в "Дополнения" Google Sheet
function onOpen() {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Show dialog', 'showDialog')
      .addToUi();
}

function showDialog() {
  var ui = HtmlService.createTemplateFromFile('index.html')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Price of components');

  SpreadsheetApp.getUi().showSidebar(ui);
}


