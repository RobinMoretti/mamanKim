import './style.css'

function goTo(number){
  fetch("http://192.168.32.226/zone=" + number, {
    method: "POST",
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
  });
}


document.getElementById("1").addEventListener("click", ()=>{
  goTo(1);
});

document.getElementById("2").addEventListener("click", ()=>{
  goTo(2);
});

document.getElementById("3").addEventListener("click", ()=>{
  goTo(3);
});
document.getElementById("4").addEventListener("click", ()=>{
  goTo(4);
});
document.getElementById("5").addEventListener("click", ()=>{
  goTo(5);
});
document.getElementById("6").addEventListener("click", ()=>{
  goTo(6);
});
document.getElementById("7").addEventListener("click", ()=>{
  goTo(7);
});