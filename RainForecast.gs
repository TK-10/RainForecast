//諸々の設定
var channel_access_token = 'LINEdevelopersより取得'
var user_id = 'LINEのuserId'
var line_url = 'https://api.line.me/v2/bot/message/push'
var openweathermap_url = 'http://api.openweathermap.org/data/2.5/forecast?id=1853909' //idで大阪を指定
var openweathermap_appid = 'Weather APIで取得したAPIkey'
var text
var text_jp = []
var rain_info
var final_text
var weatherforecast_finalurl = openweathermap_url + '&APPID=' + openweathermap_appid //URLを作成
var response = UrlFetchApp.fetch(weatherforecast_finalurl) //URLにアクセスし情報取得
var json = [JSON.parse(response.getContentText())]         //取得した情報をJSON形式に変換

//毎日AM6:00?7:00に以下のメソッドを起動
function weatherforecast() {
  //openweathermapから大阪の天気予報を取得
  var weatherforecast_finalurl = openweathermap_url + '&APPID=' + openweathermap_appid //URLを作成
  var response = UrlFetchApp.fetch(weatherforecast_finalurl) //URLにアクセスし情報取得
  var json = [JSON.parse(response.getContentText())]         //取得した情報をJSON形式に変換
  Logger.log(json[0]) //意図した場所の天気が取得できているか確認

  //天気情報を日本語に変換 9:00(list3) 12:00(list4) 15:00(list5) 18:00(list6) 21:00(list7)の5つの時間帯を取得したいためのその個数分Forでまわす
  for (var i = 0; i <= 4; i++) {
    text = JSON.stringify((json[0].list[3 + i].weather[0].icon))//天気の情報をtext変数に代入
    Logger.log(json[0].list[3 + i]) //意図した時間の天気が取得できているか確認
    start_weatherforecast(text)
    text_jp[i] = text　//天気情報のtext変数を配列に格納 0 1 2 3 4とiは繰り上げ
  }
  //天気情報をline送信用に編集する
  text_edit()
  //lineへ送信する
  weatherforecast_to_line(channel_access_token,user_id,final_text);
  //メールに送信する
  mailSend(channel_access_token,user_id,text);
}

//天気情報を日本語に変換
function start_weatherforecast(weather) {
  if (weather == '"01n"' || weather == '"01d"'){
    text = '快晴'
  }
  if (weather == '"02n"' || weather == '"02d"'){
    text = '晴れ'
  }
  if (weather == '"03n"' || weather == '"03d"'){
    text = '曇り'
  }
  if (weather == '"04n"' || weather == '"04d"'){
    text = '曇り'
  }
  if (weather == '"09n"' || weather == '"09d"'){
    text = '小雨'
    rain_info = '今日は傘を持ちましょう。\n'
  }
  if (weather == '"10n"' || weather == '"10d"'){
    text = '雨'
    rain_info = '今日は傘を持ちましょう。\n'
  }
  if (weather == '"11n"' || weather == '"11d"'){
    text = '雷雨'
    rain_info = '今日は傘を持ちましょう。\n'
  }
  if (weather == '"13n"' || weather == '"13d"'){
    text = '雪'
    rain_info = '今日は傘を持ちましょう。\n'
  }
  if (weather == '"50n"' || weather == '"50d"'){
    text = '霧'
  }
}

//line送信用にテキストを編集
function text_edit() {
  final_text = '天気予報です。\n' + rain_info + '\n09:00  ' + text_jp[0] + '\n12:00  ' + text_jp[1] + '\n15:00  ' + text_jp[2] + '\n18:00  '
              + text_jp[3]+ '\n21:00  ' + text_jp[4];
}

//LINEを使用していない人向けのメールアドレス送信用メソッド
function mailSend(channel_access_token,user_id,text) {

  const recipient = '送信先メールアドレス'; //送信先のメールアドレス
  const subject = '天気予報です。';

  const body = '天気予報です。\n' + rain_info + '\n09:00  ' + text_jp[0] + '\n12:00  ' + text_jp[1] + '\n15:00  ' + text_jp[2] + '\n18:00  '
              + text_jp[3]+ '\n21:00  ' + text_jp[4];

  //雨の場合のみメールを送信
  if (rain_info == '今日は傘を持ちましょう。\n') {
    GmailApp.sendEmail(recipient, subject, body);
  }
}

//LINEへ送信
function weatherforecast_to_line(channel_access_token,user_id,text){
  if (rain_info == '今日は傘を持ちましょう。\n') {
    //LINEに取得結果を送る
    UrlFetchApp.fetch(line_url,{
      'headers': {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': 'Bearer ' + channel_access_token,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'to': user_id,
        'messages' : [
          {
            'type':'text',
            'text':final_text,
          }
        ]
      })
    });
  }
}