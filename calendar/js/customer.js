var formItems = [{name:'titleId', display: '行程種類', options: [{type: '記者會',  id: 1}, {type: '媒體參訪',  id: 2}, {type: '活動', id: 3}]}, {name: 'titleData', display: '日期時間'}, {name: 'titleName', display: '行程名稱'}, {name: 'DDL_SDT_DEPTCD', display: '主辦單位', 
                  options: [{type:'局長室', id: 001}, {type:'主秘室', id: 003}, {type:'公關室', id: 103}, {type:'企劃組', id: 40}, {type:'業務組', id: 41}]}, 
                  {name: 'titlePlace', display:'舉辦地點'}, {name: 'titleContact', display: '聯絡人'}, {name: 'titlePhone', display: '聯絡人電話'}, {name: 'DDL_USER_STATUS', display: '代發採訪通知'}, {name: 'DDL_USER_NEWS', display:'代發新聞稿'}, {name:'states', display: 'submit'}]
function eventDialog(color, newEvt, orgEvt){
  var paper=$('<div/>'), newEvt= (newEvt === 'true' || newEvt === true)? true: false;
  paper.addClass('absolute-center '+color);
  if(newEvt) eventAddContent(paper);
  else eventEditContent(paper, orgEvt);
  paper.prepend($('<div class="close btn-lg"><i class="fa fa-times-circle fa-2x"></i></div>'));
  return paper;
};

function eventAddContent(node){ //新增事件
  
  node.html(renderDialogFrame());
  node.find('#table-root').append($('<form role="form" class="form-horizontal form-groups-bordered pull-down"></form>'));
  
  formItems.map(function(v, i){
    node.find('form').append(renderDialogGroup(v));
  })
  
}

function eventEditContent(node, events){//修改事件
  
  node.html(renderDialogFrame());
  node.find('#table-root').append(renderEditButton());
  node.find('#table-root').append($('<form role="form" class="form-horizontal form-groups-bordered pull-down"></form>'));
  
  formItems.map(function(v, i){
    node.find('form').append(renderDialogGroup(v));
  })
  node.find('form').find('#titleName').val($(events.title).text());
  node.find('input').attr('disabled', true);
  node.find('select').attr('disabled', true);
}

function renderDialogFrame(){

  return '' +
      '<div class="content">' +
        '<div class="container-fluid">' +
          '<div class="row">' +
            '<div class="panel-body">' +
              '<div id="table-root">' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
}

function renderDialogGroup(value){
  var dep, item = $('<div class="form-group form-group-lg"/>'), val = value;
  
  var selectStructor = function(){
    var strc = $('<select name="DDL_SST_NUM" class="form-control input-lg" id="'+val.name+'"></select>');
        $(val.options).each(function(i, v){
          strc.append($('<option>',
          {
            value: v.id,
            text : v.type 
          }));
        })
    return strc;
  }

  if(val.options){
    item.append('<label for="'+val.name+'" class="col-sm-2 control-label">'+val.display+'</label>') 
    item.append('<div class="col-sm-10"/>');
    item.children().eq(1).append(selectStructor());
  }else{
    switch(val.display){
      case '日期時間': 
        item.append('<label for="'+val.name+'" class="col-sm-2 control-label">'+val.display+'</label>');
        item.append('<div class="col-sm-10"/>');
        item.find('.col-sm-10').append('<div class="input-group date" id="datetimepicker1"><span class="input-group-addon"><i class="fa fa-calendar"></i></span><input type="text" class="form-control input-lg" id="titleData" /></div></div>');
        break;
      case '行程名稱':
      case '舉辦地點':
      case '聯絡人':
      case '聯絡人電話':
        item.append('<label for="'+val.name+'" class="col-sm-2 control-label">'+val.display+'</label>');
        item.append('<div class="col-sm-10 padding-tb-h"/>');
        item.find('.col-sm-10').append('<input class="form-control input-lg" id="'+val.name+'" placeholder="" type="text" >');
        break;
      case '代發採訪通知':
      case '代發新聞稿':
        item.append('<label for="'+val.name+'" class="col-sm-2 control-label">'+val.display+'</label>');
        item.append('<div class="col-sm-10 padding-tb-h"/>');
        item.find('.col-sm-10').append('<input checked data-toggle="toggle" type="checkbox"/>')
        item.find('input').bootstrapToggle();
        break;
      case 'submit':
        item.append('<div class="col-sm-offset-2 col-sm-10"/>');
        item.find('.col-sm-10').append($('<button type="submit" class="btn btn-danger btn-lg" onclick="javascript:location.href=\'content_read.html\'"/>').append('<i class="fa fa-save fa-lg margin-r-h"></i>儲&nbsp;存'));
        item.find('.col-sm-10').append($('<button type="submit" class="btn btn-orange btn-lg"/>').append('<i class="fa fa-times fa-lg margin-r-h"></i>取&nbsp;消'));

        break;
    }
  }
  return item; 
}

function renderEditButton(){
  var button = $('<button/>'), div = $('<div class="pull-right"/>'), value=true;
  var ChangeDisabled=function(){
    if(value){
      value = false;
      document.getElementById('titleId').disabled=false;
      document.getElementById('titleData').disabled=false;
      document.getElementById('titleName').disabled=false;
      document.getElementById('DDL_SDT_DEPTCD').disabled=false;
      document.getElementById('titlePlace').disabled=false;
      document.getElementById('titleContact').disabled=false;
      document.getElementById('titlePhone').disabled=false;
    }else{
      value = true;
      document.getElementById('titleId').disabled=true;
      document.getElementById('titleData').disabled=true;
      document.getElementById('titleName').disabled=true;
      document.getElementById('DDL_SDT_DEPTCD').disabled=true;
      document.getElementById('titlePlace').disabled=true;
      document.getElementById('titleContact').disabled=true;
      document.getElementById('titlePhone').disabled=true;
    }
  }

  button.attr({
    id: 'button',
    class: 'btn btn-primary btn-lg',
    title: 'Edit',
    value: '編輯',
  })
  button.append('<i class="fa fa-edit fa-lg margin-r-h"></i>編&nbsp;輯').appendTo(div);
  button.on('click', ChangeDisabled);
  return div;
}

function EvnetUpdate(newEvt, events){
  var target=$('.dropbg');

  if(newEvt)
    target.append(eventDialog('white', true));
  else
    target.append(eventDialog('white', false, events));
}
function getWindowWidth(){
  return $(window).width();
}
function getView(ww){
  return (ww <= 480) ? 'basicWeek' : 'month';
}

$(function () {
  // window.prettyPrint && prettyPrint();

  if($.browser.mobile) window.location = './content_list.html' //if on mobile device redirect to list page;

  $('#datetimepicker6').datetimepicker({format:'YYYY/M/D HH:mm:ss'});
  $('#datetimepicker7').datetimepicker({
    useCurrent: false, //Important! See issue #1075
    format:'YYYY/M/D HH:mm:ss'
  });

  $('#table').bootstrapTable(); // init via javascript
    $(window).resize(function () {
      $('#table').bootstrapTable('resetView');
    });
  });
  
  var $table = $('#table'),
      $button = $('#button');
  
  $button.click(function () {
    var ids = $.map($table.bootstrapTable('getSelections'), function (row) {
         return row.id;
    });
    $table.bootstrapTable('remove', {
      field: 'id',
      values: ids
    });
  });
  
  function operateFormatter(value, row, index) {
    return [
      '<a class="remove ml10" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon icon-remove"></i>',
      '</a>'
      ].join('');
  }

  window.operateEvents = {
    'click .remove': function (e, value, row, index) {
        alert('You click remove icon, row: ' + JSON.stringify(row));
        console.log(value, row, index);
    }
  };
  var today = new Date();
  today= moment(today).format('YYYY-MM-DD');
  $('#table-list').fullCalendar({
    locale: 'zh-tw',
    header: {
        left: 'today prev,next',
        center: 'title',
        right: ''
    },
    defaultDate: today,
    theme: true,
    editable: false,
    eventLimit: false, // allow "more" link when too many events
    events: {
      url: '../calendar/data1.json',
      type: 'POST',
      error: function() {
        alert('there was an error while fetching events!');
      },
    },
    eventRender: function(date, cell){
      // element.append('<div style="float:left;">/*push pin image*/</div>');
    },
    windowResize: function( viewEl ){
      var ww = getWindowWidth();
      var view = getView(ww);
      if($('#table-list').fullCalendar('getView').type !== view)
        $('#table-list').fullCalendar('changeView',view);
    },
    dayClick: function(date, jsEvent, view) {
      // $('.dropbg').empty();
      // EvnetUpdate(true);
      // $('.dropbg').fadeIn(500);
      // $('.close').on('click', function(){
      //   $('.dropbg').fadeOut(500);
      // })
    },
    eventClick: function(calEvent, jsEvent, view) {
      // $('.dropbg').empty();
      // var evtUpdate =[];
      // EvnetUpdate(false, calEvent);
      // $('.dropbg').fadeIn(500);
      // $('.close').on('click', function(){
      //   $('.dropbg').fadeOut(500);
      // })
    }
  });
$('#show-list').fullCalendar({
    defaultDate: today,
    theme: true,
    editable: true,
    eventLimit: true, // allow "more" link when too many events
    events: {
      url: './contentadmin/data1.json',
      type: 'POST',
      error: function() {
        alert('there was an error while fetching events!');
      }
    }
  });