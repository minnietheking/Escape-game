var audio_star=0, obj_count=0, anime_turn=0 , hp_up = 0;

function interval(){

  // 초기화면 중에는 작동하지 않음
  if( scene == 0 ) return;

  // 화면 초기화
  c_obj.clearRect(0, 0, scene_obj.width, scene_obj.height);

  // 불꽃 닿았을때 효과 초기화
  scene_effect.style.opacity= 0;

  // 캐릭터 우로 이동 , 중력 가속도
  if( scene == 2 || scene == 3) char.dx = 0;
  else char.dx = 20;
  if( char.dy < 100 )  char.dy += 4;

  // 오브젝트 충돌 판정
  obj_count = 0;
  for( var i=0; i<a_obj.length; i++){

      // 오브젝트 참조 최적화
      o = a_obj[i];

      // 오브젝트와 캐릭터의 거리가 멀때는 판정하지 않음
      if( o.x > char.x + 1400  ) continue;
      if( o.x <  char.x - 800  ) continue;

      // 오브젝트가 표시 되지 않을때는 판정하지 않음
      if( o.visible == false ) continue;

      // 오브젝트가 한번에 너무 많이 표시될때는 렉을 방지하기 위해 30개까지만 판정하도록 함
      obj_count+=1;
      if( obj_count > 30 ) continue;

      if( o.type == 3 ){  // 불꽃 전용 추가 판정
        if( Math.abs(o.x - char.x) < 200 ){ // 캐릭터와 가로 거리가 200 이하일때
          if( scene != 2){ // 엔딩의 처리
            scene = 2;  scene_clear.style.display="block"; // 엔딩 화면 표시
            a_sound['success'].play() // 엔딩 사운드표시
            clear_message.style.top = "50%"; // 엔딩 메세지 표시
            $(clear_message).animate( { top:'10%'}, 1000); // 엔딩 메세지 에니메이팅
            break;
          }
        }
      }

      // 관통 불가능한 벽과 같은 장애물
      if( o.pass == false ){

          // 사각형 영역으로 가로 부위 판정을 한다.
          if(  ((char.x + char.width + char.dx  > o.x && char.x + char.width + char.dx < o.x + o.width)
               || ( char.x +char.dx > o.x && char.x +char.dx < o.x + o.width ))
            &&
            ( (char.y + char.height  > o.y && char.y + char.height  < o.y + o.height )
            || ( char.y  < o.y +o.height && char.y  > o.y ) )
          ){
            // 만약 가로로 부딪힌 경우 그 앞에서 멈추어 서도록 좌표 보정
            if( char.dx > 0) char.x = o.x - char.width;
            else if( char.dx < 0) char.x = o.x + o.width;

            // 가로 가속도를 없에서 더이상 이동하지 않도록 한다.
            char.dx = 0;
          }

          // 사각형 영역으로 세로 부위 판정을 한다.
          if(
            ((char.y + char.height + char.dy  > o.y && char.y + char.height + char.dy < o.y + o.height)
            || ( char.y + char.dy > o.y   && char.y + char.dy  < o.y+ o.height ) )
            &&
            ( (char.x + char.width  > o.x && char.x + char.width  < o.x + o.width )
            || ( char.x  < o.x +o.width && char.x  > o.x ) )
          ){

            // 만약 세로로 부딪힌 경우 그 위나 밑에서 멈추어 서도록 좌표를 보정한다.
            if( char.dy > 0 ) char.y = o.y - char.height
            else if( char.dy < 0 ) char.y = o.y + o.height

            // 중력 가속도를 없에서 더이상 추락하지 않도록 한다.
            char.dy = 0
           }


      }  // 관통 가능한 오브젝트, 사각형 영역으로 충돌을 판정한다.
      else if( o.x < char.x + char.width*0.9 && o.x+o.width > char.x + char.width*0.1
         && o.y + o.height > char.y + char.height*0.1 && o.y < char.y + char.height*0.9 )
      {
        if( o.type == 0 ){ // 별

            o.visible = false; // 별을 먹으면 별표시를 없엔다.

            // 별을 먹을때 나는 효과음을 3개를 돌아가며 나도록 한다.
            if( audio_star == 0 ) a_sound['star'].play()
            if( audio_star == 1 ) a_sound['star2'].play()
            if( audio_star == 2 ) a_sound['star3'].play()
            audio_star+=1;
            if( audio_star > 2) audio_star=0;
            // 별을 먹었을때 점수를 1점 증가시킨다.
            point+=1;
        }
        else if( o.type == 4 ){ // 불꽃

          // 불꽃의 경우 원형이고, 충돌을 더 정확하게 하기 위해 사각형 충돌외에 원형 범위 충돌을 한번더 계산한다.
          var w = (o.x+o.width*0.5 ) - (char.x+char.width*0.5);
          w = w*w;
          var h = (o.y+o.height*0.5 ) - (char.y+char.height*0.5);
          h = h*h;
          var r = 175*175; // 충돌 반지름 간격 설정
          r *=0.8;
          if( h < r && w < r ){ // 불꽃에 닿았을때
            char.hp -= 30;  // 체력 감소
            scene_effect.style.opacity= Math.random()*0.25+0.2; // 화면이 빨갛게 반짝이는 효과
            a_sound["enemy"].play(); // 불꽃 닿았을때의 효과음 재생
          }
        }
        else if( o.type == 5 ){ // 물약
            o.visible = false; // 물약을 먹으면 물약 표시를 없엔다.
            a_sound['potion'].play() // 물약 먹었을때 효과음
            hp_up = 250; // 체력을 바로 증가시키는게 아니라 점진적으로 증가시키도록 hp_up 변수를 사용한다.
        }
        else if( o.type == 6 ){ // (비사용)
          o.visible = false;
          a_sound['potion'].play()
          hp_up = 200;
        }

      }
    }

  // 위쪽에서 오브젝트와 플레이어의 충돌을 판정하고 아래에서는 그 그림을 그린다.

  obj_count = 0;
  for( var i=0; i<a_obj.length; i++){

     // 오브젝트 참조 변수( 최적화 )
      o = a_obj[i];

      // 오브젝트와 캐릭터의 간격이 먼경우는 그리지 않는다.
      if( o.x > char.x + 1400  ) continue;
      if( o.x <  char.x - 800  ) continue;

      // 오브젝트가 표시되지 않을때는 그리지 않는다.
      if( o.visible == false ) continue;

      // 오브젝트가 화면에 너무 많이 표시되어 랙걸리는것을 막기 위해 30개까지만 표시하도록 한다.
      obj_count+=1;
      if( obj_count > 30 ) continue;

      // 불꽃처럼 에니메이션이 있는 그림의 경우에는 img , img2, img3 를 번갈아 가며 그려준다.
      if( o.anime ){
        if( anime_turn < 2) c_obj.drawImage( o.img , o.x -char.x + char.tx , o.y, o.width, o.height );
        else if( anime_turn < 4) c_obj.drawImage( o.img2 , o.x -char.x + char.tx , o.y, o.width, o.height );
        else c_obj.drawImage( o.img3 , o.x -char.x + char.tx , o.y, o.width, o.height );
      } // 에네미이션이 없는 경우에는 바로 그린다.
      else c_obj.drawImage( o.img , o.x -char.x + char.tx , o.y, o.width, o.height );
  }

  // 뒷 배경 간격 조절
  // 캐릭터가 이동함에 따라 뒷배경이 슬라이드되도록 한다.
  // 원경효과를 주기 위해 캐릭터 이동보다 느리게 이동하도록 0.2 를 곱해 준다.
  img_background.style.left = ~~((char.x%1280 * -0.2 ))+"px";

  // 캐릭터가 추락하거나 체력이 고갈되었을때
  if( char.y > 1200 || char. hp <= 0 ){
    if( scene != 3){ // 사망 화면
      scene = 3;
      char.y = 2000;  // 캐릭터의 위치를 완전히 아래로 보낸다. 추락한 경우는 상관없지만, 불꽃에 닿은 경우에는 캐릭이 사라지도록 하는것.
      a_sound['die'].play() // 사망 효과음 재생
      scene_re.style.display="block"; // 사망 화면 표시
      re_message.style.top = "-40%"; // 사망 메세지 표시
      $(re_message).animate( { top:'10%'}, 500); // 사망 메세지 에니메이팅
    }

  }
  else{ // 캐릭터가 살아서 플레이 중임
    char.x += char.dx; // 캐릭터 가로 이동
    char.y += char.dy; // 캐릭터 세로 이동
    if( char.dy == 0 )  char.jump=0; // 캐릭터가 땅에 닿아있으면 점프를 허가해준다.
  }

  // 에니메이션 패턴
  // 불꽃과 캐릭터의 그림을 번갈아 가며 표시하기위한 변수이다.
  anime_turn+=1;
  if( anime_turn > 6 ) anime_turn = 0;

  if( char.dy != 0 ) char.img =  a_img['char03'].img;  // 캐릭터가 체공중인 경우의 그림
  else if( anime_turn > 3 ) char.img =  a_img['char02'].img;  // 캐릭터가 달리는 경우의 그림
  else char.img =  a_img['char01'].img;  // 캐릭터가 달리는 경우의 그림의 다음패턴

  // 물약 먹었을때 체력이 바로 차는게 아니라 서서히 차오르도록 해준다.
  if( hp_up > 0 ){
    hp_up-=10;
    char.hp += 10;
    if( char.hp > 1000 ) char.hp = 1000;  // 만약 체력이 1000보다 크다면 1000으로 고정해준다.
  }

  gauge_hp.style.width = (char.hp / 10 )+"%"; // 체력의 가로길이를 표시해준다.

  // 캐릭터 그림을 화면에 그려준다.
  c_obj.drawImage( char.img , char.tx - char.width*0.1, char.y-char.height*0.1 , char.width*1.2, char.height*1.1 );

  // 별을 먹은 점수를 화면에 표시해 준다.
  txt_point.innerText = point;


}
