1. when you write a recursive function you have to tell it when to stop recursing.

2. That's why every recursive function has two parts. The base case and the recursive case.

function countdown(i){
 console.log(i)
 if(i <=1){ //Base case
  return
}else{
  countdown(i-1)
}
}