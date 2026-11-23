/* Efectos compartidos por las 5 páginas. Se carga en el <head> (sin defer) para tapar la página
   antes del primer pintado si toca la intro; el resto espera a DOMContentLoaded. */
(function(){
  var d=document.documentElement,
      still=matchMedia('(prefers-reduced-motion: reduce)').matches,
      fino=matchMedia('(hover:hover) and (pointer:fine)').matches,
      intro=false;
  // la intro sale una vez por visita (no en cada cambio de página)
  try{intro=!still&&!sessionStorage.getItem('fx-intro');if(intro)sessionStorage.setItem('fx-intro','1')}catch(e){}
  if(intro){d.classList.add('fx-intro');setTimeout(function(){d.classList.remove('fx-intro')},3000)} // red de seguridad: nunca queda oculta

  document.addEventListener('DOMContentLoaded',function(){
    var b=document.body;

    // ---------- intro con el logo ----------
    function revelar(){b.classList.add('fx-go')}
    if(intro){
      var cap=document.createElement('div'),logo=document.querySelector('.brand img'),src=logo&&logo.getAttribute('src');
      cap.className='fx-cap';cap.setAttribute('aria-hidden','true');cap.innerHTML='<p>PaWn <b>Dev</b></p>';
      b.appendChild(cap);
      if(src) fetch(src).then(function(r){if(!r.ok)throw 0;return r.text()})
        .then(function(t){cap.insertAdjacentHTML('afterbegin',t)})
        .catch(function(){cap.insertAdjacentHTML('afterbegin','<img src="'+src+'" alt="">')});
      var hecho=false,fin=function(){
        if(hecho)return;hecho=true;
        d.classList.remove('fx-intro');cap.classList.add('fx-out');revelar();
        setTimeout(function(){cap.remove()},800);
      };
      setTimeout(fin,1700);
      addEventListener('keydown',fin,{once:true});cap.addEventListener('pointerdown',fin);
    }else revelar();

    if(still) return;

    // ---------- título del hero palabra por palabra ----------
    var h1=document.querySelector('.hero h1,.dhero h1,.chero h1,.phero h1');
    if(h1){
      var i=0;
      [].slice.call(h1.childNodes).forEach(function(n){
        if(n.nodeType===1){n.classList.add('fx-wi');n.style.setProperty('--i',i++);return} // ej. el degradado: se anima entero, sin partirlo
        if(n.nodeType!==3) return;
        var f=document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function(p){
          if(!p) return;
          if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}
          var s=document.createElement('span');s.className='fx-w';s.style.setProperty('--i',i++);s.textContent=p;f.appendChild(s);
        });
        n.replaceWith(f);
      });
    }

    // ---------- aurora + foco de luz en el hero ----------
    document.querySelectorAll('.hero,.dhero,.chero,.phero').forEach(function(h){
      var luz=document.createElement('div');luz.className='fx-luz';luz.setAttribute('aria-hidden','true');h.prepend(luz);
      if(fino) h.addEventListener('pointermove',function(e){var r=h.getBoundingClientRect();luz.style.setProperty('--mx',e.clientX-r.left+'px');luz.style.setProperty('--my',e.clientY-r.top+'px')});
    });
    var art=document.querySelector('.hero-art'),win=art&&art.querySelector('.app');
    if(win&&fino) art.addEventListener('pointermove',function(e){var r=win.getBoundingClientRect();win.style.setProperty('--gx',e.clientX-r.left+'px');win.style.setProperty('--gy',e.clientY-r.top+'px')});

    // ---------- entrada al hacer scroll ----------
    // las páginas sin .rv propias reciben la clase en sus bloques
    if(!document.querySelector('.rv')) document.querySelectorAll('main section>*,section.wrap>*,section>.wrap>*').forEach(function(el){
      if(!el.closest('.hero,.dhero,.chero,.phero,footer')) el.classList.add('rv');
    });
    if('IntersectionObserver' in window){
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
      document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
    }

    if(!fino) return; // en celular no hay mouse: sin inclinación ni imán

    // ---------- tarjetas que se inclinan ----------
    document.querySelectorAll('.rubro,.mod').forEach(function(c){
      c.addEventListener('pointermove',function(e){
        var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        c.classList.add('fx-on');
        c.style.setProperty('--ry',(x*10).toFixed(2)+'deg');c.style.setProperty('--rx',(-y*10).toFixed(2)+'deg');
        c.style.setProperty('--gx',e.clientX-r.left+'px');c.style.setProperty('--gy',e.clientY-r.top+'px');
      });
      c.addEventListener('pointerleave',function(){c.classList.remove('fx-on')});
    });

    // ---------- botones imán ----------
    document.querySelectorAll('.btn.primary,.btn.wa,.wa-float').forEach(function(btn){
      btn.classList.add('fx-iman');
      btn.addEventListener('pointermove',function(e){var r=btn.getBoundingClientRect();btn.style.translate=((e.clientX-r.left-r.width/2)*.22).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.35).toFixed(1)+'px'});
      btn.addEventListener('pointerleave',function(){btn.style.translate=''});
    });
  });
})();
