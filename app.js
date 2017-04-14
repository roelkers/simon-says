// create a root instance
var app = new Vue({
  el: '#app',
  data: {
    counter : 1,
    wholeSequence: [],
    buttonPressesLeft: [],
    sequenceLength: 20,
    timeOutLength: 1000,
    highlightedItem: " ",
    green: "#0A860A",
    red: "#A80C0C",
    yellow: "#A88D0C",
    blue: "#2B1473",
    strictEnabled: false,
    buttonsLocked: false
  },
  methods:{
    checkButton: function(userColor){
      if(this.buttonPressesLeft.length>0 && !this.buttonsLocked){
        this.buttonsLocked = true;
        let color = this.buttonPressesLeft.shift();
        this.highlightedItem=userColor;
        this.blinkColor();
        if(color!==userColor){
          this.onUserError();
          this.buttonPressesLeft=this.getCurrentSequence();
        }
        else if(this.buttonPressesLeft.length===0){
          if(this.counter===this.sequenceLength){
            this.onGameComplete();
          }
          else{
            this.onSequenceComplete();
          }
        }
        // user pressed correct button so nothing to do else, unlock and wait for next button press*/
        else{
        this.buttonsLocked = false;
        }
      }
    },
    onSequenceComplete: function(){
      this.counter++;
      this.checkForTimeOutDecrease();
      this.buttonPressesLeft=this.getCurrentSequence();
      setTimeout(this.playSequence,2000,this.getCurrentSequence());
    },
    onGameComplete: function(){
          this.counter="You win!";
          this.clearGameState();
    },
    onUserError:function(){
      this.notifyError();
      if(this.strictEnabled){
        setTimeout(this.startGame,2000);
        return;
      }
      setTimeout(this.playSequence,1500,this.getCurrentSequence());
    },
    checkForTimeOutDecrease:function(){
      if(this.counter===5)
        this.timeOutLength=800;
      if(this.counter===9)
        this.timeOutLength=600;
      if(this.counter===13)
        this.timeOutLength=400;
    },
    getCurrentSequence: function(){
      return this.wholeSequence.slice(0,this.counter);
    },
    notifyError: function(){
      const counter = this.counter;
      const interval1 = setInterval(()=>{
        if(this.counter!=="!!")
           this.counter="!!"
        else
           this.counter="--";
      },500);
      setTimeout(()=>{clearInterval(interval1);
                      this.counter = counter;}
                 ,1500);
    },
    clearGameState: function(){
      this.wholeSequence=[];
      this.timeOutLength = 1000;
    },
    startGame: function(){
      this.clearGameState();
      this.counter=1;
      this.createSequence();
      this.buttonPressesLeft=this.wholeSequence.slice(0,1);
      this.playSequence(this.wholeSequence.slice(0,1));
    },
    createSequence: function(){
      let colorNumber = null,
          lastColor=null;
      for(let i=0;i<this.sequenceLength;i++){
        do{
          colorNumber = Math.round(Math.random()*4);
        }while(colorNumber===lastColor);
        if(colorNumber===0)
          this.wholeSequence.push("green");
        else if(colorNumber===1)
          this.wholeSequence.push("red");
        else if(colorNumber===2)
          this.wholeSequence.push("yellow");
        else if(colorNumber===3)
          this.wholeSequence.push("blue");
        lastColor = colorNumber;
      }
    },
    blinkColor: function(){
      this.highlightColor();
      window.setTimeout(this.shadeColor,this.timeOutLength);
    },
    playSequence: function(sequence){
      this.sequencePlaying = true;
      if(sequence.length>0){
        this.highlightedItem = sequence.shift();
        this.blinkColor();
        window.setTimeout(this.playSequence,this.timeOutLength,sequence);
      }
      else
        //window.setTimeout(this.unlockButtons,this.timeOutLength*this.counter-100000);
        this.unlockButtons();
    },
    unlockButtons: function(){
      this.buttonsLocked=false;
    },
    highlightColor:function(){
      var audio=null;
      switch(this.highlightedItem){
          case "green":
            this.green="#33D833";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
            break;
          case "red":
            this.red="#FF3C3C";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
            break;
          case "yellow":
            this.yellow="#FFDE3C";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
            break;
          case "blue":
            this.blue="#5E3FC3";
            audio = new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
            break;
          }
          if(audio!==null)
            audio.play();
    },
    shadeColor:function(){
      switch(this.highlightedItem){
          case "green":
            this.green="#0A860A";
            break;
          case "red":
            this.red="#A80C0C";
            break;
          case "yellow":
            this.yellow="#A88D0C";
            break;
          case "blue":
            this.blue="#2B1473";
            break;
          }
       }
    }
})
