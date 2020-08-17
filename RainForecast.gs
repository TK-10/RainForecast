//���X�̐ݒ�
var channel_access_token = 'LINEdevelopers���擾'
var user_id = 'LINE��userId'
var line_url = 'https://api.line.me/v2/bot/message/push'
var openweathermap_url = 'http://api.openweathermap.org/data/2.5/forecast?id=1853909' //id�ő����w��
var openweathermap_appid = 'Weather API�Ŏ擾����APIkey'
var text
var text_jp = []
var rain_info
var final_text
var weatherforecast_finalurl = openweathermap_url + '&APPID=' + openweathermap_appid //URL���쐬
var response = UrlFetchApp.fetch(weatherforecast_finalurl) //URL�ɃA�N�Z�X�����擾
var json = [JSON.parse(response.getContentText())]         //�擾��������JSON�`���ɕϊ�

//����AM6:00?7:00�Ɉȉ��̃��\�b�h���N��
function weatherforecast() {
  //openweathermap������̓V�C�\����擾
  var weatherforecast_finalurl = openweathermap_url + '&APPID=' + openweathermap_appid //URL���쐬
  var response = UrlFetchApp.fetch(weatherforecast_finalurl) //URL�ɃA�N�Z�X�����擾
  var json = [JSON.parse(response.getContentText())]         //�擾��������JSON�`���ɕϊ�
  Logger.log(json[0]) //�Ӑ}�����ꏊ�̓V�C���擾�ł��Ă��邩�m�F

  //�V�C������{��ɕϊ� 9:00(list3) 12:00(list4) 15:00(list5) 18:00(list6) 21:00(list7)��5�̎��ԑт��擾���������߂̂��̌���For�ł܂킷
  for (var i = 0; i <= 4; i++) {
    text = JSON.stringify((json[0].list[3 + i].weather[0].icon))//�V�C�̏���text�ϐ��ɑ��
    Logger.log(json[0].list[3 + i]) //�Ӑ}�������Ԃ̓V�C���擾�ł��Ă��邩�m�F
    start_weatherforecast(text)
    text_jp[i] = text�@//�V�C����text�ϐ���z��Ɋi�[ 0 1 2 3 4��i�͌J��グ
  }
  //�V�C����line���M�p�ɕҏW����
  text_edit()
  //line�֑��M����
  weatherforecast_to_line(channel_access_token,user_id,final_text);
  //���[���ɑ��M����
  mailSend(channel_access_token,user_id,text);
}

//�V�C������{��ɕϊ�
function start_weatherforecast(weather) {
  if (weather == '"01n"' || weather == '"01d"'){
    text = '����'
  }
  if (weather == '"02n"' || weather == '"02d"'){
    text = '����'
  }
  if (weather == '"03n"' || weather == '"03d"'){
    text = '�܂�'
  }
  if (weather == '"04n"' || weather == '"04d"'){
    text = '�܂�'
  }
  if (weather == '"09n"' || weather == '"09d"'){
    text = '���J'
    rain_info = '�����͎P�������܂��傤�B\n'
  }
  if (weather == '"10n"' || weather == '"10d"'){
    text = '�J'
    rain_info = '�����͎P�������܂��傤�B\n'
  }
  if (weather == '"11n"' || weather == '"11d"'){
    text = '���J'
    rain_info = '�����͎P�������܂��傤�B\n'
  }
  if (weather == '"13n"' || weather == '"13d"'){
    text = '��'
    rain_info = '�����͎P�������܂��傤�B\n'
  }
  if (weather == '"50n"' || weather == '"50d"'){
    text = '��'
  }
}

//line���M�p�Ƀe�L�X�g��ҏW
function text_edit() {
  final_text = '�V�C�\��ł��B\n' + rain_info + '\n09:00  ' + text_jp[0] + '\n12:00  ' + text_jp[1] + '\n15:00  ' + text_jp[2] + '\n18:00  '
              + text_jp[3]+ '\n21:00  ' + text_jp[4];
}

//LINE���g�p���Ă��Ȃ��l�����̃��[���A�h���X���M�p���\�b�h
function mailSend(channel_access_token,user_id,text) {

  const recipient = '���M�惁�[���A�h���X'; //���M��̃��[���A�h���X
  const subject = '�V�C�\��ł��B';

  const body = '�V�C�\��ł��B\n' + rain_info + '\n09:00  ' + text_jp[0] + '\n12:00  ' + text_jp[1] + '\n15:00  ' + text_jp[2] + '\n18:00  '
              + text_jp[3]+ '\n21:00  ' + text_jp[4];

  //�J�̏ꍇ�̂݃��[���𑗐M
  if (rain_info == '�����͎P�������܂��傤�B\n') {
    GmailApp.sendEmail(recipient, subject, body);
  }
}

//LINE�֑��M
function weatherforecast_to_line(channel_access_token,user_id,text){
  if (rain_info == '�����͎P�������܂��傤�B\n') {
    //LINE�Ɏ擾���ʂ𑗂�
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