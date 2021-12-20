
// 전역 변수 선언
var o , char, a_map, a_obj , a_img , a_sound, c_obj, scene, point;

// 가장 먼저 초기화하는 함수
init();

// 이미지와 사운드 파일을 로드한다.
// 이후 사용할 상수명과 파일의 경로를 입력한다.
function load_files(){

  load_img( "star", "./images/item_star.png" );
  load_img( "ground", "./images/map_ground2.jpg" );
  load_img( "book", "./images/obj_book.png" );
  load_img( "char01", "./images/char01.png" );
  load_img( "char02", "./images/char02.png" );
  load_img( "char03", "./images/char03.png" );
  load_img( "magicball", "./images/magicball.png" );
  load_img( "fire", "./images/fire.png" );
  load_img( "fire2", "./images/fire2.png" );
  load_img( "fire3", "./images/fire3.png" );
  load_img( "potion", "./images/potion.png" );

  // 매인 배경음악은 루프설정
  sound_load( 'bgm' , './audio/Shred The Wall - Ashley Shadow.mp3' , true)
  
  sound_load( 'jump' , './audio/jump.mp3' )
  sound_load( 'jump2' , './audio/jump2.mp3' )
  sound_load( 'star' , './audio/star.mp3' )
  sound_load( 'star2' , './audio/star2.mp3' )
  sound_load( 'star3' , './audio/star3.mp3' )
  sound_load( 'die' , './audio/die.mp3' )
  sound_load( 'start' , './audio/start.mp3' )
  sound_load( 'start2' , './audio/start2.mp3' )
  sound_load( 'success' , './audio/success.mp3' )
  sound_load( 'bird' , './audio/bird.mp3' )
  sound_load( 'damage' , './audio/damage.mp3' )
  sound_load( 'enemy' , './audio/enemy.mp3' )
  sound_load( 'potion' , './audio/potion.mp3' )

}



function obj_add(type , x , y ){

  /*
  맵에 객체를 배치하는 함수
  o.width o.height 객체의 크기
  o.pass 캐릭터가 객체를 지나갈 수 있는지 충돌되는지
  o.img 객체의 이미지
  o.visible 표시 여부( 아이템등은 먹었을때 사라지도록 함 )
  */

  // 기본 속성
  o = { x:x , y:y , type:type , visibie:true }

  // 별
  if( type == 0 ){   o.width = 90; o.height = 80;  o.pass = true; o.img = a_img['star'].img  }

  // 땅
  if( type == 1 ){   o.width = 200; o.height = 500;  o.pass = false; o.img = a_img['ground'].img  }

  // 책 장애물
  if( type == 2 ){   o.width = 200; o.height = 200;  o.pass = false; o.img = a_img['book'].img  }

  // 게임 엔딩에 나오는 마법공
  if( type == 3 ){   o.width = 300; o.height = 300;  o.pass = false; o.img = a_img['magicball'].img  }

  // 불꽃( 불꽃은 에니메이션을 위해 이미지를 3개를 사용한다. )
  if( type == 4 ){   o.width = 350; o.height = 350;  o.pass = true;
    o.anime = true; o.img = a_img['fire'].img; o.img2 = a_img['fire2'].img; o.img3 = a_img['fire3'].img  }

  // 물약
  if( type == 5 ){   o.width = 120; o.height = 150;  o.pass = true; o.img = a_img['potion'].img  }

  // 가로크기가 달라도 서로 같은 중심점에 나오도록 간격을 조정한다.
  o.x -= o.width*0.5;

  // 객체를 배열에 넣는다.
  a_obj.push( o )

}

// 사운드 파일 설정
function sound_load(name, src , loop ){
  // audio 요소를 만들고 audio 변수에 저장
  var audio = document.createElement('audio');
  // 해당 맵에 audio를 추가
  container.append( audio );
  // 플레이중 배경음 무한 루프
  if( loop ) audio.loop = true;
  audio.src = src;
  audio.load();
  a_sound[name] = audio;
}


// 초기화 함수
function init(){
  // a_img라는 배열과 a_sound라는 배열 선언
  // (배열로 선언한 이유는 여러개의 이미지와 사운드를 담아줄 변수가 필요하기 때)
  a_img = [], a_sound =[];
  // 이미지와 사운드 파일 로드하는 함수 호출
  load_files();
  // 0 = 초기화면
  scene=0;

  // 캐릭터 초기 상태 설정
  char = { hp:1000, y:500, x:1000 , tx:400,  jump:0 , dy:0 , dx:0,  width:140, height:200 }
  // a_obj라는 배열 변수 선언
  a_obj=[];

  // stage.js에 있는 set_stage() 함수 호출
  set_stage();
  // getContext() 메소드에 문자열 '2d'를 전달
  // getContext(2d) 객체는 내장된 HTML5 객체
  c_obj = scene_obj.getContext('2d');
  // index.html에 id값이 'container'
  // 특정 이벤트(click)이 발생하였을 때 함수(tap()) 실행
  // addEventListener( "이벤트 종류", 함수 이름);
  container.addEventListener("click", tap);
}

// 이미지 파일 설정
function load_img(name , src){
  // img 변수 선언
  var img;
  // img 요소를 만들고 img 변수에 저장
  img  = document.createElement("img");
  img.src = src;
  a_img[name] = {img:img , loaded:false}
  // 특정 이벤트(load)가 발생하였을 때 함수(img_loaded()) 실행
  img.addEventListener('load', img_loaded)
}

function img_loaded(e){
  // k=0부터 a_img의 길이만큼 반복
  for( var k in a_img){
    if(a_img[k].img == e.currentTarget ){ a_img[k].loaded = true; break; }
  }
  // k=0부터 a_img의 길이만큼 반복
  for( var k in a_img){
    if(a_img[k].loaded == false ) return;
  }

  // 죽고 나서 다시 시작할때 함수 호출
  refresh();
  setInterval( interval, 25 );

}


// 죽고 나서 다시 시작할때
function refresh(){
  // 캐릭터 초기셋팅
  char.y = 300;
  char.dy=0; // 캐릭터 점프 속도
  char.x = 1000;
  char.hp = 1000;

  // 0 초기화면
  scene = 0;
  point=0;
  for( var i=0; i<a_obj.length; i++){
    a_obj[i].visible = true;
  }
  // id가 scene_title인 객체에 display속성을 block으로 설정
  // 초기화면이니까 scene_title만 보여야 함
  // 따라서 나머지는 none 속성 설정
  scene_title.style.display="block";
  scene_re.style.display="none";
  scene_clear.style.display="none";

}


// scene = 0 -> 초기화면
// scene = 1 -> 플레이중
// scene = 2 -> 성공
// scene = 3 -> 죽음

// 화면을 탭 ( 클릭 ) 했을때
function tap(e){
  // 만약에 scene이 초기화면(0)이라면
  if( scene == 0 ){
    // scene을 플레이증(1)으로 바꾸기
    scene = 1;
    // bgm, start 사운드 플레이
    a_sound['bgm'].play();
    a_sound['start'].play()
    scene_title.style.display="none"
    // hp부분은 보여야하니까 block으로 설정
    scene_txt.style.display="block"
  }
  // 만약에 scene이 죽음(3)이라면
  else if( scene == 3 ){
    // start2 사운드 플레이
    a_sound['start2'].play()
    // 죽고 나서 다시 시작할때 함수 호출
    refresh();
  }
  // 캐릭터의 점프가 2보다 미만이라는 조건문을 추가해서
  // 캐릭터가 두번까지 점프 가능하도록 설정
  else if( char.jump < 2 ){  char.dy = -50;  char.jump+=1;
      // 1단 점프일 때 jump 사운드 플레이
      if( char.jump == 1 ) a_sound['jump'].play();
      // 1단 점프가 아닐 때(=2단 점프) jump2 사운드 플레이
      else a_sound['jump2'].play();
  }
}
