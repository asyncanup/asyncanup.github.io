v=document.createElement('canvas')
v.width=500
v.height=500
v.style.backgroundColor='#f4f5f2'
v.onclick=()=>{
  c.clearRect(0,0,v.width,v.height)
  clearTimeout(T)
  F()
}
document.querySelector('#canvas-container').appendChild(v);

F=()=>{
c=v.getContext('2d')
c.lineWidth=.03
C=[1,-.5,-.5]
S=[0,.87,-.87]
P=[[X=250,Y=250],[X,Y],[X,Y]]
R=()=>{d=parseInt(Math.random()*3)
P=P.map (([x,y],i)=>(c.moveTo(x,y),c.lineTo(X=x+3*C[I=(d+i)%3],Y=y+3*S[I]),[X,Y]))
c.stroke()
T=setTimeout(R,17)
}
R()}

F()
