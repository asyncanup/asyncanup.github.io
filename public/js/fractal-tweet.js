c=v.getContext('2d')
c.lineWidth=.03
C=[1,-.5,-.5]
S=[0,.87,-.87]
F=()=>{
P=[[X=300,Y=300],[X,Y],[X,Y]]
R=()=>{d=parseInt(Math.random()*3)
P=P.map (([x,y],i)=>(c.moveTo(x,y),c.lineTo(X=x+3*C[I=(d+i)%3],Y=y+3*S[I]),[X,Y]))
c.stroke()
setTimeout(R,17)
}
R()}
