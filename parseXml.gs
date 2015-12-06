// 救星 : 
// https://sites.google.com/site/scriptsexamples/learn-by-example/parsing-html

function getRecord() {
  var url = "https://www.flyingv.cc/project/9420";
  var response = UrlFetchApp.fetch(url);

  if (response.getResponseCode() != 200)
    throw "Unexpected response code from URL.";

  var doc = Xml.parse(response, true);
  var responseText = doc.html.body[1].toXmlString();
  
  /* // youtube 部份
  var url2 = "https://www.youtube.com/watch?v=aKCKbDhJ3JA";
  var response2 = UrlFetchApp.fetch(url2);
  var doc2 = Xml.parse(response2, true);
  var responseText2 = doc2.html.body[0].toXmlString();
  */
  
  
  if (responseText == null || responseText == "")
    throw "Empty response.";

  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[2];

  var time = new Date();
  var row = [time.toString()];
  
  


  
  try
  { 
    body = XmlService.parse(responseText).getRootElement();//.getChildren();
    
    // 金額
    div_money = getElementsByClassName(body,'rtt');
    money_text = div_money[0].getValue().match(/\d+/)[0];
    row.push(money_text);
    
    // 贊助人數
    div_people = getElementsByClassName(body, 'dt')[0].getChildren()[2];
    people_text = div_people.getValue().match(/\d+/)[0];
    row.push(people_text);
    
    //追縱人數
    div_people2 = getElementsByClassName(body, 'sidebarprj')[0].getChildren()[1].getChildren()[0];
    people2_text = div_people2.getValue().match(/\d+/)[0];
    row.push(people2_text);
    
    /*
    // FB share
    divs = getElementsByClassName(body, 'sharenumber');
    div = divs[0];
    text = div.getValue();
    number = text.match(/\d+/)[0];
    row.push(number);
    
    //g+
    //divs = getElementsByClassName(body, 'sharenumber');
    div = divs[1];
    text = div.getValue();
    number = text.match(/\d+/)[0];
    row.push(number);   
    */
    
    //贊助方案
    divs = getElementsByTagName(body, 'small');
    for(var i = 0 ; i<divs.length;i++){
      text = divs[i].getValue().match(/\d+/)[0];
      row.push(text);
      
    }
    
    /*
    // youtube 部份
    body = XmlService.parse(responseText2).getRootElement();
    divs = getElementsByClassName(body,'watch-view-count');
    div = divs[0];
    text = div.getValue();
    number = text.match(/\d+/)[0];
    row.push(number);  
    */
   
   row.push(getYoutubeViews('aKCKbDhJ3JA'));
    
    
    sheet.appendRow(row);

    
    
    
    
  }
  catch (e)
  {
    throw "Problem with response: " + e;
  }
  
}

function getElementsByClassName(element, classToFind) {  
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);  
  for(i in descendants) {
    var elt = descendants[i].asElement();
    if(elt != null) {
      var classes = elt.getAttribute('class');
      if(classes != null) {
        classes = classes.getValue();
        if(classes == classToFind) data.push(elt);
        else {
          classes = classes.split(' ');
          for(j in classes) {
            if(classes[j] == classToFind) {
              data.push(elt);
              break;
            }
          }
        }
      }
    }
  }
  return data;
}

function getElementsByTagName(element, tagName) {  
  var data = [];
  var descendants = element.getDescendants();  
  for(i in descendants) {
    var elt = descendants[i].asElement();     
    if( elt !=null && elt.getName()== tagName) data.push(elt);      
  }
  return data;
}


// from : http://stackoverflow.com/questions/30898351/how-to-get-number-of-video-views-with-youtube-api-into-a-google-spreadsheet
function getYoutubeViews(videoId){
  var url = "https://www.googleapis.com/youtube/v3/videos?part=statistics&id=" + videoId;
  url = url + "&key={YOUR-API-KEY}";
  var videoListResponse = UrlFetchApp.fetch(url);
  var json = JSON.parse(videoListResponse.getContentText());
  return json["items"][0]["statistics"]["viewCount"];
}
